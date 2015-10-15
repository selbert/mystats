var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var Promise = require('promise');


var file = "../load.sql";
var exists = fs.existsSync(file);

var MILLIS_IN_MINUTE = 60*1000;
var dataMap = {
    totalAverage: {query:"SELECT AVG(avg) AS avg FROM load", cache:{time: 0, data: 0}},
    averagePerDayOfWeek: {query:"SELECT strftime('%w', time) as dow, AVG(avg) as avg FROM load GROUP BY dow", cache:{time: 0, data: []}},
    averagePerHourOfDay: {query:"SELECT strftime('%H', time) as hod, AVG(avg) as avg FROM load GROUP BY hod", cache:{time: 0, data: []}},
    averagePerDay: {query:"SELECT date(time) as day, AVG(avg) as avg FROM load GROUP BY day",cache:{time: 0, data: []}}
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

var getSingleResultCached = function(queryName) {
    return new Promise(function(resolve, reject) {
        var data = getCachedData(queryName);
        if (data) resolve(data);

        getSingleResult(queryName)
            .then(
                function(data) {
                    updateCache(queryName, data);
                    resolve(data);
                },
                function(err) {reject(err)});
    })
}

var getMultiResultCached = function(queryName) {
    return new Promise(function(resolve, reject) {
        var data = getCachedData(queryName);
        if (data) resolve(data);

        getMultiResult(queryName)
            .then(
                function(data) {
                    updateCache(queryName, data);
                    resolve(data);
                 },
                function(err) {reject(err)});
    })
}

var getSingleResult = function(queryName) {
    return new Promise(function(resolve, reject) {
        var db = new sqlite3.Database(file);
        var query = queryData.query;
        console.log(query);
        db.serialize(function() {
          db.get(query, function(err, row) {
            if (err) reject(err);
            else resolve(row);
          });
        });
        db.close();
    })
}

var getMultiResult = function(queryName) {
    return new Promise(function(resolve, reject) {
        var db = new sqlite3.Database(file);
        var query = queryData.query;
        db.serialize(function() {
         db.each(query, function(err, row) {
             rows.push(row);
           }, function(err, count) {
              if (err) reject(err);
              else resolve(row);
           });
        });
        db.close();
    })
}

exports.getTotalAverage = function() {
    return getSingleResultCached('totalAverage');
}

exports.getAveragePerDayOfWeek = function(callback) {
    return getMultiResultCached('averagePerDayOfWeek')
}

exports.getAveragePerHourOfDay = function(callback) {
    return getMultiResultCached('averagePerHourOfDay')
}

exports.getAveragePerDay = function(callback) {
    return getMultiResultCached('averagePerDay')
}

