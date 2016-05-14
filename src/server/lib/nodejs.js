var util = require('util');
var split2 = require('split2');
var net = require('net');
var uuid = require('uuid');
var debug = require('debug')('segment-sim:lib:nodejs');
var spawndebug = require('debug')('segment-sim:spawned:nodejs');
var keys = require('../../keys.json');
var EventEmitter = require('events')
  .EventEmitter;
var path = require('path');
var child_process = require('child_process');

var Nodejs = function() {
  debug('constructing');
};
util.inherits(Nodejs, EventEmitter);

var request = function(method, data, cb) {
  var self = this;
  var socketLocation = path.resolve(__dirname, `segment-sim-${uuid.v4()}`);
  debug(`requesting ${method} with ${data} at ${socketLocation}`);
  var process;

  var socket = net.createServer(function(client) {
    self.emit('debug', 'connection opened for library');
    client.on('connect', function() {
      self.emit('debug', 'client connected');
    });
    client.on('data', function(rec) {
      var request = JSON.parse(rec);
      if (request.type == 'connect') {
        self.emit('debug', 'library requesting handshake');
        //client is requesting a handshake, send it back with method and data to complete
        client.write(JSON.stringify({
          type: 'connect',
          method: method,
          data: data
        }));
      } else if (request.type == 'response') {
        self.emit('debug', 'response from library received');
        //got a response from the client
        process.on('close', function() {
          //close the socket (which also removes the socket
          socket.close();
          
          //respond
          cb(request.err, request.response);
        });
        //kill the process
        process.kill();
      }
    });
  });

  //listen to the socket
  socket.listen(socketLocation);

  //spawn the child process thats uses the segment library to issue the request
  debug('spawning nodejs process');
  process = child_process.spawn('node', [path.resolve(__dirname, 'segment', 'nodejs', 'index.js'), socketLocation], {
    env: {
      DEBUG: '*',
      DEBUG_FD: 1,
      SEGMENT_WRITE_KEY: keys.nodejs
    },
    stdio: [null, null, null]
  });

  //stdout is reserved for debug
  process.stdout.pipe(split2())
    .on('data', function(data) {
      spawndebug('from child proc: ' + data);
      self.emit('debug', data);
    });
};

['identify', 'track', 'page', 'alias', 'group'].forEach(function(method) {
  debug(`propping up ${method} on nodejs prototype`);
  Nodejs.prototype[method] = function(data, cb) {
    debug(`calling request with ${method}`);
    request.call(this, method, data, cb);
  };
});


module.exports = exports = Nodejs;
