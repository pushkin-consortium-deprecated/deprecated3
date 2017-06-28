module.exports = db => {
  const Response = db.Model.extend({
    tableName: 'whichenglish_responses',
    question() {
      return this.belongsTo('Choice', 'choiceId');
    },
    user() {
      return this.belongsTo('User', 'userId');
    }
  });
  return db.model('Response', Response);
};
