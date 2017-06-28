const express = require('express');
const path = require('path');
const fs = require('fs');
const basicAuth = require('basic-auth');

const getFileName = () => {
  const fullPath = __filename;
  const fileName = fullPath.replace(/^.*[\\\/]/, '');
  return fileName.replace('.js', '').toLowerCase();
};

const fileName = getFileName();
const channelName = fileName + '_rpc_worker';
const taskQueueName = fileName + '_task_queue';

const checkUser = (username, password) => {
  const output = fs.readFileSync(path.resolve('./admin.txt'), 'utf-8');
  const outputArray = output.split('\n');
  const users = outputArray.map(currentEl => {
    return {
      username: currentEl.split(':')[0],
      password: currentEl.split(':')[1]
    };
  });
  return users.some(
    admin => admin.username === username && admin.password === password
  );
};
module.exports = (rpc, conn, dbWrite) => {
  const fileName = getFileName();
  const router = new express.Router();
  // get initial questions for a quiz
  router.get('/initialQuestions', (req, res, next) => {
    var rpcInput = {
      method: 'getInitialQuestions',
      params: []
    };
    return rpc(conn, taskQueueName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
    // create a channel
  });
  // get all responses for a quiz
  router.get('/responses', (req, res, next) => {
    // const { user, choiceId, questionId } = req.body;
    var rpcInput = {
      method: 'allResponses',
      params: []
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get one response with an id
  router.get('/responses/:id', (req, res, next) => {
    var rpcInput = {
      method: 'findResponse',
      params: [req.params.id]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // post a response for a quiz and get the next question
  router.post('/response', (req, res, next) => {
    const { user, choiceId, questionId } = req.body;
    // save in db
    // ask for next
    // respond
    var rpcInput = {
      method: 'createResponse',
      params: [{ userId: user.id, choiceId }]
    };
    var findChoiceRPC = {
      method: 'findChoice',
      params: [req.body.choiceId]
    };
    return rpc(conn, channelName, findChoiceRPC)
      .then(choice => {
        return dbWrite(conn, fileName + '_db_write', rpcInput).then(() => {
          // this is going to the python worker so the payload is different
          var workerInput = {
            method: 'getQuestion',
            params: {
              userId: user.id,
              questionId,
              choiceId,
              choice: choice
            }
          };
          return rpc(conn, taskQueueName, workerInput);
        });
      })
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // updates a response with an id
  router.put('/response/:id', (req, res, next) => {
    var rpcInput = {
      method: 'updateResponse',
      params: [req.params.id, req.body]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // delete a response with an id
  router.delete('/response/:id', (req, res, next) => {
    var rpcInput = {
      method: 'deleteResponse',
      params: [req.params.id]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get all trials for a quiz
  router.get('/trials', (req, res, next) => {
    var rpcInput = {
      method: 'allTrials',
      params: []
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get one trial
  router.get('/trials/:id', (req, res, next) => {
    var rpcInput = {
      method: 'findTrial',
      params: [req.params.id]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // create a trial for a quiz
  router.post('/trials', (req, res, next) => {
    var rpcInput = {
      method: 'createTrial',
      params: [{ name: req.body.name }]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // update a trial with an id
  router.put('/trials/:id', (req, res, next) => {
    var rpcInput = {
      method: 'updateTrial',
      params: [req.params.id, req.body]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // delete a trial for an id
  router.delete('/trials/:id', (req, res, next) => {
    var rpcInput = {
      method: 'deleteTrial',
      params: [req.params.id]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get all users for a quiz
  router.get('/users', (req, res, next) => {
    var rpcInput = {
      method: 'allUsers',
      params: []
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get an user with an id
  router.get('/users/:id', (req, res, next) => {
    var rpcInput = {
      method: 'findUser',
      params: [req.params.id, ['userLanguages.languages']]
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // update a user with an id
  router.put('/users/:id', (req, res, next) => {
    var rpcInput = {
      method: 'updateUser',
      params: [req.params.id, req.body]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // create a user
  router.post('/users', (req, res, next) => {
    var rpcInput = {
      method: 'createUser',
      params: [req.body]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // detete a user with an id
  router.delete('/users/:id', (req, res, next) => {
    var rpcInput = {
      method: 'deleteUser',
      params: [req.params.id]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get questions and choices for a quiz
  router.get('/trials/:id/questions', (req, res, next) => {
    var rpcInput = {
      method: 'findTrial',
      params: [req.params.id, ['questions.choices']]
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get all questions for a quiz
  router.get('/questions', (req, res, next) => {
    var rpcInput = {
      method: 'allQuestions',
      params: []
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get one question with choices
  router.get('/questions/:id', (req, res, next) => {
    var rpcInput = {
      method: 'findQuestion',
      params: [req.params.id, ['choices']]
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // create a question
  router.post('/questions', (req, res, next) => {
    var rpcInput = {
      method: 'createQuestion',
      params: [req.body]
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // update a question with an id
  router.put('/questions/:id', (req, res, next) => {
    var rpcInput = {
      method: 'updateQuestion',
      params: [req.params.id, req.body]
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // delete a question with an id
  router.delete('/questions/:id', (req, res, next) => {
    var rpcInput = {
      method: 'deleteQuestion',
      params: [req.params.id]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get all choices for a quiz
  router.get('/choices', (req, res, next) => {
    var rpcInput = {
      method: 'allChoice',
      params: []
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get one choice with an id
  router.get('/choices/:id', (req, res, next) => {
    var rpcInput = {
      method: 'findChoice',
      params: [req.params.id]
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // create a choice
  router.post('/choices', (req, res, next) => {
    var rpcInput = {
      method: 'createChoice',
      params: [req.body]
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // update a choice with an id
  router.put('/choices/:id', (req, res, next) => {
    var rpcInput = {
      method: 'updateChoice',
      params: [req.params.id, req.body]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // delete a choice with an id
  router.delete('/choices/:id', (req, res, next) => {
    var rpcInput = {
      method: 'deleteChoice',
      params: [req.params.id]
    };
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get all responses in csv format for a quiz
  router.get('/admincsv', (req, res, next) => {
    // TODO: refactor this to be set on contruction of the controller
    // possibly
    const user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    }
    if (checkUser(user.name, user.pass)) {
      const rpcInput = {
        method: 'getResponseCsv',
        params: []
      };
      const channelName = fileName + '_rpc_worker';
      return rpc(conn, channelName, rpcInput)
        .then(data => {
          res.set('Content-Type', 'text/csv');
          res.send(data);
        })
        .catch(next);
    } else {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      res.sendStatus(401);
      return;
    }
  });
  // get all languages for a quiz if quiz has language table
  router.get('/languages', (req, res, next) => {
    var rpcInput = {
      method: 'allLanguages',
      params: []
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  // get a choice with an id
  router.get('/choice/:id', (req, res, next) => {
    var rpcInput = {
      method: 'findChoice',
      params: [req.params.id, null]
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        res.json(data);
      })
      .catch(next);
  });
  router.get('/results/:userId', (req, res, next) => {
    var workerInput = {
      method: 'getResults',
      params: {
        userId: req.params.userId
      }
    };
    return rpc(conn, taskQueueName, workerInput)
      .then(data => {
        res.json({ results: data });
      })
      .catch(next);
  });
  router.post('/comments', (req, res, next) => {
    var rpcInput = {
      method: 'setUserLanguages',
      params: [
        req.body.userId,
        {
          nativeLanguages: req.body.nativeLanguages,
          primaryLanguages: req.body.primaryLanguages
        }
      ]
    };
    const channelName = fileName + '_rpc_worker';
    return rpc(conn, channelName, rpcInput)
      .then(data => {
        var rpc2 = {
          method: 'updateUser',
          params: [
            req.body.userId,
            {
              countriesOfResidence: req.body.countryOfResidence
                ? req.body.countryOfResidence.join(',')
                : null,
              englishYears: req.body.englishYears || null,
              householdEnglish: req.body.householdEnglish || null,
              learnAge: req.body.learnAge || null
            }
          ]
        };
        return rpc(conn, channelName, rpc2).then(data2 => {
          return res.json(Object.assign({}, data, data2));
        });
      })
      .catch(next);
  });
  return router;
};
