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

exports.details = function(req, res, next){
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