exports.up = function(knex) {
  return knex.schema.createTable('listener_questions', table => {
    table.increments('id').primary();
    table.string('type');
    table.string('prompt');
    table
      .integer('trialId')
      .references('id')
      .inTable('listener_trials')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('listener_questions');
};
