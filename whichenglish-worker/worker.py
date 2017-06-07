#!/usr/bin/env python
import os
import pika
from rpc.RPCClient import RPCClient
from rpc.RPC import RPC


try:
    RABBIT_LINK = os.environ.get('AMPQ_ADDRESS')
    PREFIX = os.environ.get('QUEUE')
except BaseException as error:
    print error
    print "Couldnt find AMPQ_ADDRESS in environment"


parameters = pika.URLParameters(RABBIT_LINK)
parameters.heartbeat = 0


connection = pika.BlockingConnection(parameters)
# print "created connection"

channel = connection.channel()
RPC_QUEUE = PREFIX + '_rpc_worker'

TASK_QUEUE = PREFIX + "_task_queue"
DB_WRITE_QUEUE = PREFIX + "_db_write"
DURABLE = False

print " declaring queue %s durable: %s" % (TASK_QUEUE, DURABLE)
channel.queue_declare(queue=TASK_QUEUE, durable=DURABLE)


print " declaring queue %s durable: %s" % (DB_WRITE_QUEUE, DURABLE)

channel.queue_declare(queue=DB_WRITE_QUEUE, durable=DURABLE)


def callback(ch, method, properties, body):
    client = RPCClient(connection, RPC_QUEUE)
    rpc = RPC()
    # the key part of this code here is that the python worker can do anything it needs
    # in this scope, we have access to the user id, the question id, and the users choice
    # but it makes sure that it passes the correlation_id(if any) to the db worker, as well as the reply_to
    # this ensures that the data can be returned on the original channel and
    # the api can respond.
    print " [x] Received %r" % body
    try:
        rpc.parse(body)
    except ValueError as error:
        print "message was not a valid json structure message was %r" % body
        return
    except KeyError as error:
        print "message was not a valid JSON-RPC with the keys, 'method' and 'params'"
        return

    # print " METHOD %r" % rpc.method
    # print " params %r" % rpc.params
    # print "properties %r" % properties
    if rpc.method == 'getQuestion':
        if 'questionId' in rpc.params:
            question_id = rpc.params['questionId']
            print "Finding question with %r" % question_id
            # question = client.call(json.dumps({
            #     'method': 'findQuestion',
            #     'params': [question_id]
            # }))
            # print "QUESTION: %r" % question
            # # Pretty self explanatory,
            # # get a user, the question they just answered, and their choice
            # if 'userId' in params:
            #     user_id = params['userId']
            #     print "Finding user with %r" % user_id
            #     user = client.call(json.dumps({
            #         'method': 'findUser',
            #         'params': [user_id]
            #     }))
            #     print "USER: %r" % user
            # if 'choiceId' in params:
            #     choice_id = params['choiceId']
            #     print "Finding choice with %r" % choice_id
            #     choice = client.call(json.dumps({
            #         'method': 'findChoice',
            #         'params': [choice_id]
            #     }))
            #     print "CHOICE: %r" % choice

            new_id = question_id + 2
            send_rpc = RPC()
            send_rpc.method = 'findQuestion'
            send_rpc.params = [new_id, ['choices']]
            routing_key = PREFIX + '_rpc_worker'
            result = client.call(send_rpc.to_JSON())
            correlation_id = properties.correlation_id
            reply_to = properties.reply_to

            # key here is we pass this off to the db worker
            # it replies to the original channel with the original
            # correlation_id
            try:
                channel.basic_publish(
                    exchange='',
                    routing_key=properties.reply_to,
                    body=result,
                    properties=pika.BasicProperties(
                        delivery_mode=2,
                        correlation_id=correlation_id,
                    )
                )
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return 1
            except BaseException as error:
                print "Couldn't publish"
        else:
            print "Cannot get next question without at least the questionId"
            ch.basic_ack(delivery_tag=method.delivery_tag)
    elif rpc.method == 'getInitialQuestions':
        send_rpc = RPC()
        send_rpc.method = 'getInitialQuestions'
        send_rpc.params = []
        routing_key = PREFIX + '_rpc_worker'
        results = client.call(send_rpc.to_JSON())
        correlation_id = properties.correlation_id
        reply_to = properties.reply_to
        body = results
        reply_to = properties.reply_to
        channel.basic_publish(
            exchange='',
            routing_key=properties.reply_to,
            body=body,
            properties=pika.BasicProperties(
                correlation_id=correlation_id,
            )
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return 1

    elif rpc.method == 'getResults':
        # this method is called when a user needs to get results,
        # feel free to make other rpc calls in here
        # and any data analysis that is needed
        send_rpc = RPC()
        send_rpc.method = 'getResults'
        send_rpc.params = [rpc.params['userId']]
        routing_key = PREFIX + '_rpc_worker'
        # The results of an anonymous rpc call along the ROUTING_key
        # _rpc_worker
        results = client.call(send_rpc.to_JSON())

        correlation_id = properties.correlation_id
        reply_to = properties.reply_to
        body = results
        reply_to = properties.reply_to
        print "PUBLISHING TO CHANNEL %r" % body
        print results
        print reply_to
        print "Routing Key %s" % routing_key
        print properties
        channel.basic_publish(
            exchange='',
            routing_key=properties.reply_to,
            body=body,
            properties=pika.BasicProperties(
                correlation_id=correlation_id,
            )
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return 1
    else:
        print "Couldnt find a delivery mechanism for %r" % parameters
        return 1

channel.basic_qos(prefetch_count=1)
channel.basic_consume(callback,
                      queue=TASK_QUEUE)


def exit_handler():
    if channel.is_open:
        channel.close()
print ' [*] Waiting for messages. To exit press CTRL+C'
print ' [*] %s' % TASK_QUEUE
print ' [*] %s' % DB_WRITE_QUEUE

# atexit.register(exit_handler)
channel.start_consuming()
