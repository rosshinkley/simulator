var express = require('express');
var bodyParser = require('body-parser');
var api = require('./server/api');
var debug = require('debug')('segment-sim:server');

var app = express();
var http = require('http')
  .Server(app);
var io = require('socket.io')(http);

//on socket.io connection, pump the socket id back to the client
io.on('connection', function(socket) {
  debug(`received connection from ${socket.id}`);
  socket.emit('id', socket.id);
});

app.use(bodyParser.json());

//add the api controller with a ref to the socket
app.use('/api', api(io));

//if this "module" is not required (eg for a test), 
if (!module.parent) {
  //start that server!
  http.listen(3001, function() {
    debug('server started.');
  });
}

module.exports = exports = http;
