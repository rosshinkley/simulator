var express = require('express');
var lib = require('./lib');

var makeApiRouter = function(io) {

  var apiRouter = express.Router();

  apiRouter.post('/:language/:method', function(req, res) {
    //if the language is a part of the library,
    if (lib[req.params.language]) {
      //make an instance of that language's wrapper
      var instance = new lib[req.params.language];
      //if the socket client id is on the request, add the event listeners,
      if (req.headers['X-Socket-Client']) {
        //re-emit library events to the socket
        instance.on('debug', function() {
          io.to(req.headers['X-Socket-Client'])
            .emit.apply(null, ['debug'].concat(Array.from(arguments)));
        });
      }

      //if the instance has the requested method,
      if (instance[req.params.method]) {
        //call the requseted method with the req body
        instance[req.params.method](req.body, function(err, response) {
          if (err) {
            //if the library errored out, respond appropriately
            res.status(500)
              .json({
                error: err
              });
          } else {
            //otherwise, pump the response from the wrapped segment library back
            res.json(response);
          }
        });
      } else {
        //respond with a bad request
        res.status(400)
          .send({
            error: `Method ${req.params.method} does not exist for language ${req.params.language}`
          });
      }
    }
  });

  return apiRouter;
};

module.exports = exports = makeApiRouter;
