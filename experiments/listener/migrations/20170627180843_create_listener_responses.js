// const knex = require('knex')(require('./knex.config.js'));

exports.up = function(knex) {
  return knex.schema.createTable('listener_responses', table => {
    table.increments().primary();
    table.timestamps();
    table.integer('userId').references('id').inTable('listener_users');
    table.integer('choiceId').references('id').inTable('listener_choices').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('listener_responses');
};
