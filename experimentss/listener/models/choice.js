module.exports = db => {
  var Choice = db.Model.extend({
    tableName: 'listener_choices',
    question() {
      this.belongsTo('Question', 'questionId');
    },
    responses() {
      return this.hasMany('Response', 'choiceId');
    }
  });
  return db.model('Choice', Choice);
};
