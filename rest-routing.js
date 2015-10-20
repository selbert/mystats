var express = require('express');
var Promise = require('promise');
var loadService = require('./load-service.js');

var router = express.Router();

router.get('/avg', function(req, res) {
  Promise.denodeify(loadService.getTotalAverage)()
    .then(
      function(row) {
        res.json(row.avg)
      },
      function(err) {
        res.json({error:err})});
});

router.get('/avg/day', function(req, res) {
  Promise.denodeify(loadService.getAveragePerDay)()
    .then(
      function(rows) {
        res.json(rows)
      },
      function(err) {
        res.json({error:err})});
});

router.get('/avg/dayOfWeek', function(req, res) {
  Promise.denodeify(loadService.getAveragePerDayOfWeek)()
    .then(
      function(rows) {
        res.json(rows)
      },
      function(err) {
        res.json({error:err})});
});

router.get('/avg/hourOfDay', function(req, res) {
  Promise.denodeify(loadService.getAveragePerHourOfDay)()
    .then(
      function(rows) {
        res.json(rows)
      },
      function(err) {
        res.json({error:err})});
});

router.get('/loads/:amount', function(req, res) {
  var amount = req.params.amount;
  if (!amount || isNaN(amount)) amount = 1000;
  Promise.denodeify(loadService.getLastLoads)(amount)
    .then(
      function(rows) {
        res.json(rows)
      },
      function(err) {
        res.json({error:err})});
});

module.exports = router;