const Papa = require('babyparse');
const fs = require('fs');
const path = require('path');
const modelObj = require('../../db');
const flatten = require('lodash.flatten');

let quiz = path.resolve(__dirname).split('/').pop();
const db = modelObj[quiz];
const data = Papa.parseFiles(
  [
    `./seeds/${quiz}/Trials.csv`,
    `./seeds/${quiz}/Questions.csv`,
    `./seeds/${quiz}/Choices.csv`
  ],
  { header: true }
);
fs.readFileSync(`./seeds/${quiz}/Trials.csv`);
const trials = data[0].data;
let questions = data[1].data;
let choices = data[2].data;
module.exports = () => {
  return db
    .knex(`${quiz}_choices`)
    .del()
    .then(() => {
      return db.knex(`${quiz}_questions`).del();
    })
    .then(() => {
      return db.knex(`${quiz}_responses`).del();
    })
    .then(() => {
      return db.knex(`${quiz}_users`).del();
    })
    .then(() => {
      return db.knex(`${quiz}_trials`).del();
    })
    .then(() => {
      return db.knex(`${quiz}_trials`).insert(trials).returning('*');
    })
    .then(rows => {
      const allQuestions = rows.map(trial => {
        return questions
          .filter(question => question.trial === trial.name)
          .map(question => {
            question.trialId = trial.id;
            delete question.trial;
            return question;
          });
      });
      return db
        .knex(`${quiz}_questions`)
        .insert(flatten(allQuestions))
        .returning('*');
    })
    .then(rows => {
      const allChoices = rows.map(question => {
        return choices
          .filter(choice => choice.question == question.prompt)
          .map(choice => {
            choice.questionId = question.id;
            delete choice.question;
            return choice;
          });
      });
      return db
        .knex(`${quiz}_choices`)
        .insert(flatten(allChoices))
        .returning('*');
    })
    .then(data => {
      console.log(data); // eslint-disable-line no-console
    })
    .then(() => {
      console.log('done seeding!');
      return process.exit();
    })
    .catch(err => {
      console.log(err); // eslint-disable-line no-console
    });
};
