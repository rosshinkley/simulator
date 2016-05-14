var net = require('net');
var debug = require('debug')('segment:nodejs');
var util = require('util');
var Analytics = require('analytics-node');

//always flush after a single request
var analytics = new Analytics(process.env.SEGMENT_WRITE_KEY, {
  flushAt: 1
});

//open a connection to the unix socket location specfied in the command-line arguments
var client = net.createConnection(process.argv[2]);

//TODO: verify socket location
//TODO: verify write key
//TODO: verify method

//on connection,
client.on('connect', function() {
  //send a connection handshake
  client.write(JSON.stringify({
    type: 'connect'
  }));
});

client.on('data', function(data) {
  //parse the data request
  var request = JSON.parse(data.toString());

  if (request.type == 'connect') {
    //handshake complete, issue the data => segment
    debug(`about to issue ${request.method}`);
    //call the request's method in analytics with the data payload
    analytics[request.method](request.data, function(err, response) {
      //send the error and response back to the calling process
      client.write(JSON.stringify({
        type: 'response',
        err: err,
        response: response
      }));
    });
  }

});
