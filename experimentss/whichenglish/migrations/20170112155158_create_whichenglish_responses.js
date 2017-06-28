exports.up = function(knex) {
  return knex.schema.createTable('whichenglish_responses', table => {
    table.increments().primary();
    table.timestamps();
    table.integer('userId').references('id').inTable('whichenglish_users');
    table.integer('choiceId').references('id').inTable('whichenglish_choices').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('whichenglish_responses');
};
