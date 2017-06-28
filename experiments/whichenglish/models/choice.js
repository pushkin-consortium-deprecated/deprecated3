module.exports = db => {
  var Choice = db.Model.extend({
    tableName: 'whichenglish_choices',
    question() {
      this.belongsTo('Question', 'questionId');
    },
    responses() {
      return this.hasMany('Response', 'choiceId');
    }
  });
  return db.model('Choice', Choice);
};

