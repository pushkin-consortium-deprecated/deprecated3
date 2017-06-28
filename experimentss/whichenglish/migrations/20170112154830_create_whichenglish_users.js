exports.up = function(knex, Promise) {
  return knex.schema.createTable('whichenglish_users', table => {
    table.increments().primary();
    table.timestamps();
    table.string('name');
    table.integer('age');
    table.string('education');
    table.string('gender');
    table.boolean('languageDisorder');
    table.boolean('takenBefore');
    table.integer('englishYears');
    table.boolean('householdEnglish');
    table.string('countriesOfResidence');
    table.integer('learnAge');

  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('whichenglish_users');
};
