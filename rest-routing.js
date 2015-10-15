var express = require('express');
var Promise = require('promise');
var loadService = require('./load-service.js');

var router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/avg', function(req, res) {
  Promise.denodeify(loadService.getTotalAverage)()
    .then(
      function(row) {
        res.send(JSON.stringify(row.avg))
      },
      function(err) {
        res.send(JSON.stringify({error:err}))});
});

router.get('/avg/day', function(req, res) {
  Promise.denodeify(loadService.getAveragePerDay)()
    .then(
      function(rows) {
        res.send(JSON.stringify(rows))
      },
      function(err) {
        res.send(JSON.stringify({error:err}))});
});

router.get('/avg/dayOfWeek', function(req, res) {
  Promise.denodeify(loadService.getAveragePerDayOfWeek)()
    .then(
      function(rows) {
        res.send(JSON.stringify(rows))
      },
      function(err) {
        res.send(JSON.stringify({error:err}))});
});

router.get('/avg/hourOfDay', function(req, res) {
  Promise.denodeify(loadService.getAveragePerHourOfDay)()
    .then(
      function(rows) {
        res.send(JSON.stringify(rows))
      },
      function(err) {
        res.send(JSON.stringify({error:err}))});
});

module.exports = router;