var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var Promise = require('promise');


var file = "../load.sql";
var db = new sqlite3.Database(file);

var MILLIS_IN_MINUTE = 60*1000;
var dataMap = {
    totalAverage: {query:"SELECT AVG(avg)/100*540 AS avg FROM load", cache:{time: 0, data: 0}},
    averagePerDayOfWeek: {query:"SELECT strftime('%w', time) as dow, ROUND(AVG(avg)/100*540,2) as avg FROM load GROUP BY dow", cache:{time: 0, data: []}},
    averagePerHourOfDay: {query:"SELECT strftime('%H', time) as hod, ROUND(AVG(avg)/100*540,2) as avg FROM load GROUP BY hod", cache:{time: 0, data: []}},
    averagePerDay: {query:"SELECT date(time) as date, ROUND(AVG(avg)/100*540,2) as avg FROM load WHERE date(time) > date('now','localtime','-1 month') GROUP BY date",cache:{time: 0, data: []}},
    totalConsumption: {query:"SELECT MIN(time) as firstMeasure, MAX(time) as lastMeasure, AVG(avg)/100*540*(strftime('%s','now','localtime') - strftime('%s',MIN(time)))/60/60 as totalConsumption FROM load",cache:{time: 0, data: []}},
    yearConsumption: {query:"SELECT AVG(avg)/100*540*(strftime('%s','now','localtime') - strftime('%s',MIN(time)))/60/60 as yearConsumption FROM load WHERE date(time) >= date('now','localtime','start of year')",cache:{time: 0, data: []}},
    monthConsumption: {query:"SELECT AVG(avg)/100*540*(strftime('%s','now','localtime') - strftime('%s',MIN(time)))/60/60 as monthConsumption FROM load WHERE date(time) >= date('now','localtime','start of month','localtime')",cache:{time: 0, data: []}},
    weekConsumption: {query:"SELECT AVG(avg)/100*540*(strftime('%s','now','localtime') - strftime('%s',MIN(time)))/60/60 as weekConsumption FROM load WHERE strftime('%Y-%W',time) = strftime('%Y-%W','now','localtime')",cache:{time: 0, data: []}},
    dayConsumption: {query:"SELECT AVG(avg)/100*540*(strftime('%s','now','localtime') - strftime('%s',MIN(time)))/60/60 as dayConsumption FROM load WHERE date(time) = date('now','localtime')",cache:{time: 0, data: []}},
    lastLoads: {query:"SELECT strftime('%s', time,'localtime') as date, ROUND(avg/100*540,2) as avg, ROUND(max/100*540,2) as max, ROUND(min/100*540,2) as min FROM load ORDER BY id DESC LIMIT ?",cache:{time: 0, data: []}}
};

var getCachedData = function(queryName) {
    var queryData = dataMap[queryName];
    var queryCache = queryData.cache;
    if (Date.now() - queryCache.time < MILLIS_IN_MINUTE) {
        return queryCache.data;
    }
    return null;
}

var updateCache = function(queryName, data) {
    var queryData = dataMap[queryName];
    var queryCache = queryData.cache;
    queryCache.time = Date.now();
    queryCache.data = data;
}

var getQuery = function(queryName) {
    var queryData = dataMap[queryName];
    return queryData.query;
}

var getSingleResultCached = function(queryName, params) {
    return new Promise(function(resolve, reject) {
        var data = getCachedData(queryName);
        if (data) resolve(data);

        getSingleResult(queryName, params)
            .then(
                function(data) {
                    updateCache(queryName, data);
                    resolve(data);
                },
                function(err) {reject(err)});
    })
}

var getMultiResultCached = function(queryName, params) {
    return new Promise(function(resolve, reject) {
        var data = getCachedData(queryName);
        if (data) resolve(data);

        getMultiResult(queryName, params)
            .then(
                function(data) {
                    updateCache(queryName, data);
                    resolve(data);
                 },
                function(err) {reject(err)});
    })
}

var getSingleResult = function(queryName, params) {
    return new Promise(function(resolve, reject) {
        var query = getQuery(queryName);
        db.serialize(function() {
          db.get(query, params, function(err, row) {
            if (err) reject(err);
            else resolve(row);
          });
        });
    })
}

var getMultiResult = function(queryName, params) {
    return new Promise(function(resolve, reject) {
        var query = getQuery(queryName);
        db.serialize(function() {
            var rows = [];
            db.each(query, params, function(err, row) {
                if (err) reject(err);
                else rows.push(row);
            }, function(err, count) {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    })
}

exports.getTotalAverage = function() {
    return getSingleResultCached('totalAverage');
}

exports.getTotalConsumption = function() {
    return getSingleResultCached('totalConsumption');
}

exports.getYearConsumption = function() {
    return getSingleResultCached('yearConsumption');
}

exports.getMonthConsumption = function() {
    return getSingleResultCached('monthConsumption');
}

exports.getWeekConsumption = function() {
    return getSingleResultCached('weekConsumption');
}

exports.getDayConsumption = function() {
    return getSingleResultCached('dayConsumption');
}

exports.getAveragePerDayOfWeek = function() {
    return getMultiResultCached('averagePerDayOfWeek');
}

exports.getAveragePerHourOfDay = function() {
    return getMultiResultCached('averagePerHourOfDay');
}

exports.getAveragePerDay = function() {
    return getMultiResultCached('averagePerDay');
}

exports.getLastLoads = function(amount) {
    return getMultiResultCached('lastLoads', [ amount ]);
}
