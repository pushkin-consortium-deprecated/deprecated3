![Pushkin Logo](images/logo.png)

Pushkin is a scalable ecosystem for psychological surveys and tests.

It consists of 5 key parts

![](http://i.imgur.com/ncRJMJ5.png)

#####  [Pushkin-Api](https://github.com/l3atbc/pushkin-api#pushkin-api)
#####  [Pushkin-Cli](https://github.com/l3atbc/pushkin-cli#pushkin-cli)
#####  [Pushkin-DB](https://github.com/l3atbc/pushkin-db/blob/master/README.md#pushkin-db)
#####  [Pushkin-Worker](https://github.com/l3atbc/pushkin-worker#pushkin-worker)
#####  [Pushkin-Cron](https://github.com/l3atbc/pushkin-cron/blob/master/README.md#overview)

## Why Pushkin

## Assumptions
1. You are somewhat familiar with isntalling programs and understand what your terminal is and how to use it.
2. You have access to a text editor like sublime/notepad++/etc.
3. [Docker](http://docker.com) is installed on your machine


## Getting started

### Development Mode
1. docker-compose up -f docker-compose.debug.yml


## Deploying

[Deploy Instructions Here](https://github.com/l3atbc/pushkin/blob/master/DEPLOY.md#deploying)

## Directory Structure

## Common Tasks

### Cronjobs

Pushkin makes adding a cron job easy, 
1. just add the file script you want ran in games-with-words-cron/scripts.
2. Add a line calling that file in games-with-words-cron/crontab

Each one of those files has access to the environment variables created in the docker file.

DB Connection is available as `DATABASE_URL` and the message queue as `AMPQ_ADDRESS`.

Right now we only support python and node.js cron tabs. feel free to modify the `Dockerfile` to add a different environment you may need.

### Documentation
Docs can be created by running npm install, then npm run docs.


## Roles and Permissions

## Acknowledgements

Josh DeLieuw of jspsych
