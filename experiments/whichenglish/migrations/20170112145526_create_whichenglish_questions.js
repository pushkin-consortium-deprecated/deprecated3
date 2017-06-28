exports.up = function(knex) {
  return knex.schema.createTable('whichenglish_questions', table => {
    table.increments('id').primary();
    table.string('type');
    table.string('prompt');
    table
      .integer('trialId')
      .references('id')
      .inTable('whichenglish_trials')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('whichenglish_questions');
};
