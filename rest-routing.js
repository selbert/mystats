var express = require('express');
var loadService = require('./load-service.js');
var extend = require('extend');
var Promise = require('promise');

var router = express.Router();

router.get('/total', function(req, res) {
  var response = {};
  Promise.all([
      loadService.getTotalConsumption(),
      loadService.getMonthConsumption(),
      loadService.getWeekConsumption(),
      loadService.getDayConsumption(),
      loadService.getYearConsumption()])
    .then(
      function(rows) {
        rows.forEach(function(row) {
          extend(response, row);
        });
        res.json(response);
      },
      function(err) {
        res.json({error:err})});
});

router.get('/avg', function(req, res) {
  loadService.getTotalAverage()
    .then(
      function(row) {
        res.json(row)
      },
      function(err) {
        res.json({error:err})});
});

router.get('/avg/day', function(req, res) {
  loadService.getAveragePerDay()
    .then(
      function(rows) {
        res.json(rows)
      },
      function(err) {
        res.json({error:err})});
});

router.get('/avg/dayOfWeek', function(req, res) {
  loadService.getAveragePerDayOfWeek()
    .then(
      function(rows) {
        res.json(rows)
      },
      function(err) {
        res.json({error:err})});
});

router.get('/avg/hourOfDay', function(req, res) {
  loadService.getAveragePerHourOfDay()
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
  loadService.getLastLoads(amount)
    .then(
      function(rows) {
        res.json(rows)
      },
      function(err) {
        res.json({error:err})});
});

module.exports = router;