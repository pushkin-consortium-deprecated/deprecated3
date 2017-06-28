module.exports = db => {
  const Language = db.Model.extend({
    tableName: 'whichenglish_languages',
    users() {
      return this.hasMany('User')
      .through('UserLanguage');
    },
    userLanguages() {
      return this.hasMany('UserLanguage', 'id');
    }
  });
  return db.model('Language', Language);
};
