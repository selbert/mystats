var express = require('express');
var rest = require('./rest-routing.js');


var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.use('/rest', rest);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});