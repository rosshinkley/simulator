var net = require('net');
var debug = require('debug')('segment:nodejs');
var util = require('util');
var Analytics = require('analytics-node');

debug('nodejs child started');

//always flush after a single request
debug(`using write key ${process.env.SEGMENT_WRITE_KEY}`);
var analytics = new Analytics(process.env.SEGMENT_WRITE_KEY, {
  flushAt: 1
});

//open a connection to the unix socket location specfied in the command-line arguments
debug(`opening socket to ${process.argv[2]}`);
var client = net.createConnection(process.argv[2]);

//TODO: verify socket location
//TODO: verify write key
//TODO: verify method

//on connection,
client.on('connect', function() {
  debug('sending connection');
  //send a connection handshake
  client.write(JSON.stringify({
    type: 'connect'
  }));
});

client.on('data', function(data) {
  //parse the data request
  var request = JSON.parse(data);
  debug(request);

  if (request.type == 'connect') {
    //handshake complete, issue the data => segment
    debug(`about to issue ${request.method}`);
    debug(request.data);
    //call the request's method in analytics with the data payload
    analytics[request.method](request.data, function(err, response) {
      debug('response received');
      //send the error and response back to the calling process
      client.write(JSON.stringify({
        type: 'response',
        err: err,
        response: response
      }));
    });
  }
});
