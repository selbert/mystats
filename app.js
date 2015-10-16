var express = require('express');
var rest = require('./rest-routing.js');


var app = express();

app.use('/api', rest);

app.get('/js/:jsFile', function (req, res) {
    res.sendFile(__dirname + '/public/javascript/'+req.params.jsFile);
});

app.get('/css/:cssFile', function (req, res) {
    res.sendFile(__dirname + '/public/stylesheets/'+req.params.cssFile);
});

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});