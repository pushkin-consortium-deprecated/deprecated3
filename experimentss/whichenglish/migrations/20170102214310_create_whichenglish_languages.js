exports.up = function(knex) {
  return knex.schema.createTable('whichenglish_languages', table => {
    table.increments().primary();
    table.string('name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('whichenglish_languages');
};
