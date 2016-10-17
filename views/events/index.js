'use strict';

exports.find = function(req, res, next){
  req.query.username = req.query.username ? req.query.username : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';

  var filters = {};

  req.app.db.models.Event.pagedFind({
    filters: filters,
    keys: 'username title description',
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      results.filters = req.query;
      res.send(results);
    }
    else {
      results.filters = req.query;
      console.log(results);
      res.render('events/index', { 'data': results.data });      
    }
  });
};

exports.read = function(req, res, next){
  req.query.username = req.query.username ? req.query.username : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';

  var filters = {};

  filters._id = req.params.id;

  req.app.db.models.Event.pagedFind({
    filters: filters,
    keys: 'username title description date startEvent endEvent',
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      results.filters = req.query;
      res.send(results);
    }
    else {
      results.filters = req.query;
      console.log(results);
      res.render('events/details', { 'event': results.data[0] });      
    }
  });
};

exports.create = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.username) {
      workflow.outcome.errors.push('Please enter a username.');
      return workflow.emit('response');
    }

    workflow.emit('createEvent');
  });

  workflow.on('createEvent', function() {
    var fieldsToSet = {
      username: req.user.username,
      title: req.body.title,
      startEvent: req.body.startEvent,
      endEvent: req.body.endEvent,
      description: req.body.description,
      date: new Date(),
      search: [
        req.user.username
      ]
    };
    req.app.db.models.Event.create(fieldsToSet, function(err, event) {
      if (err) {
        return workflow.emit('exception', err);
      }

      //workflow.outcome.record = event;
      //return workflow.emit('response');

      res.redirect('/account/myevents/');

    });
  });

  workflow.emit('validate');
};

exports.init = function(req, res, next){
  res.render('events/add', {}); 
};