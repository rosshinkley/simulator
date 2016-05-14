var util = require('util');
var split2 = require('split2');
var net = require('net');
var uuid = require('uuid');
var keys = require('../../keys.json');
var EventEmitter = require('events')
  .EventEmitter;

var Nodejs = function() {};

var request = function(method, data, cb) {
  var self = this;
  var socketLocation = path.resolve(__dirname, `segment-sim-${uuid.v4()}`);
  var process;

  var socket = net.createServer(function(client) {
    self.emit('debug', 'connection opened for library');
    client.on('connect', function() {
      self.emit('debug', 'client connected');
    });
    client.on('data', function(data) {
      var request = JSON.parse(data);
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
          //close the socket
          socket.close();
          //remove the socket
          fs.unlinkSync(socketLocation)

          //respond
          cb(request.err, request.response);
        });
        //kill the process
        process.kill();
      }
    });
  });

  //spawn the child process thats uses the segment library to issue the request
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
      self.emit('debug', data);
    });
};

['identify', 'track', 'page', 'alias', 'group'].forEach(function(method) {
  Nodejs.prototype[method] = function(data, cb) {
    request.bind(this, method, data, cb);
  };
});

util.inherits(Nodejs, EventEmitter);

module.exports = exports = Nodejs;
