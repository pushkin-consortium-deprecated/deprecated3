exports.up = function(knex) {
  return knex.schema.createTable('listener_users', table => {
    table.increments().primary();
    table.timestamps();
    table.string('name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('listener_users');
};
