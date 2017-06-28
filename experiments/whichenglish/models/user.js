module.exports = db => {
  const User = db.Model.extend({
    tableName: 'whichenglish_users',
    idAttributes: 'id',
    responses() {
      return this.hasMany('Response', 'userId');
    },
    userLanguages() {
      return this.hasMany('UserLanguage', 'userId');
    },
    languages() {
      return this.hasMany('Language', 'userId').through(
        'UserLanguage',
        'id',
        'trash'
      );
    }
  });
  return db.model('User', User);
};
