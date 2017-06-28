module.exports = db => {
  const Trial = db.Model.extend({
    tableName: 'whichenglish_trials',
    questions() {
      return this.hasMany('Question', 'trialId');
    },
    hasTimestamps: true
  });
  return db.model('Trial', Trial);
};
