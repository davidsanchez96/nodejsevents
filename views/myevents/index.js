'use strict';

exports.find = function(req, res, next){
  req.query.username = req.query.username ? req.query.username : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';

  var filters = {};

  filters.username = req.user.username;

  req.app.db.models.Event.pagedFind({
    filters: filters,
    keys: 'username title description date',
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
      res.render('myevents/index', { 'data': results.data });      
    }
  });
};

exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  

  workflow.on('patchUser', function() {
    var fieldsToSet = {
      title: req.body.title,
      startEvent: req.body.startEvent,
      endEvent: req.body.endEvent,
      description: req.body.description
    };

    var options = {};
    req.app.db.models.Event.findByIdAndUpdate(req.params.id, fieldsToSet, options, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      res.redirect('/account/myevents/');


    });
  });

  workflow.emit('patchUser');
};

exports.init = function(req, res, next){

  req.query.username = req.query.username ? req.query.username : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';
  var filters = {};

  filters._id = req.params.id;

  filters.username = req.user.username;

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
      res.render('myevents/update', { 'data': results.data[0] });    
    }
  });
}


exports.delete = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('deleteUser', function(err) {
    req.app.db.models.Event.findByIdAndRemove(req.params.id, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }
      res.redirect('/account/myevents/');
    });
  });
  workflow.emit('deleteUser'); 
};