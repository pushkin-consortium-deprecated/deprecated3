exports.up = function(knex) {
  return knex.schema.createTable('whichenglish_userLanguages', table => {
    table.increments();
    table.boolean('primary');
    table.boolean('native');
    table.integer('userId').references('id').inTable('whichenglish_users');
    table.integer('languageId').references('id').inTable('whichenglish_languages').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('whichenglish_userLanguages');
};
