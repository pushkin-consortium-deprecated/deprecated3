module.exports = db => {
  const UserLanguage = db.Model.extend({
    tableName: 'whichenglish_userLanguages',
    language() {
      return this.belongsTo('Language', 'languageId');
    },
    languages() {
      return this.belongsTo('Language', 'languageId');
    },
    user() {
      return this.belongsTo('User', 'userId');
    }
  });
  return db.model('UserLanguage', UserLanguage);
};
