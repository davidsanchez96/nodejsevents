'use strict';

exports = module.exports = function(app, mongoose) {
  var categorySchema = new mongoose.Schema({
    username: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    date: { type: Date, default: '' },
    startEvent: { type: String, default: '' },
    endEvent: { type: String, default: '' }
  });
  categorySchema.plugin(require('./plugins/pagedFind'));
  categorySchema.index({ username: 1 });
  categorySchema.index({ title: 1 });
  categorySchema.index({ description: 1 });
  categorySchema.index({ date: 1 });
  categorySchema.index({ startEvent: 1 });
  categorySchema.index({ endEvent: 1 });
  categorySchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Event', categorySchema);
};

