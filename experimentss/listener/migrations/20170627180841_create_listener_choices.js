exports.up = function(knex) {
  return knex.schema.createTable('listener_choices', table => {
    table.increments().primary;
    table.string('type');
    table.string('imageUrl');
    table.string('displayText');
    table.boolean('correct');
    table
      .integer('questionId')
      .references('id')
      .inTable('listener_questions')
      .onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('listener_choices');
};
