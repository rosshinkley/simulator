var express = require('express');
var debug = require('debug')('segment-sim:api');
var fs = require('fs');
var path = require('path');
var lib = require('./lib');

var uiRouter = express.Router();

/*
uiRouter.get('/', function(req, res, next){
  //hack: read html from disk
  var source = fs.readFileSync(path.resolve(__dirname,'..','client','index.html')).toString();

  //pipe raw html back
  res.send(source);
  next();
});
*/

uiRouter.use('/', express.static(path.resolve(__dirname, '..', 'client')))

module.exports = exports = uiRouter;
