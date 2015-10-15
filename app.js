var express = require('express');
var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();

var file = "../load.sql";
var exists = fs.existsSync(file);
var db = new sqlite3.Database(file);

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

db.serialize(function() {
  db.each("SELECT AVG(avg) AS avg FROM load", function(err, row) {
    console.log("Average load: " + row.avg);
  });
});

db.close();