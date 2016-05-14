require('mocha-generators')
  .install();

var chai = require('chai');
var should = chai.should();
var debug = require('debug')('segment-sim:test:lib');
var data = require('./data');
var app = require('../src/app');
var got = require('got');
var lib = require('../src/server/lib');

describe('api', function() {
  var base='http://localhost:3456/api'
  before(function(done) {
    app.listen(3456, done);
  });
  after(function(done) {
    app.close();
    done();
  });

  Object.keys(lib)
    .forEach(function(libName) {
      describe(`api for ${libName}`, function() {
        ['identify', 'track', 'page', 'alias', 'group'].forEach(function(method) {
          it.skip(`should run ${method} successfully`, function * () {
            var result = (yield got([base, libName, method].join('/'), makeRequest('POST', data[method])))
              .body;
            result.should.be.ok;
            result.result.should.be.okay;
            should.not.exist(result.err);
          });

          it(`${method} should error on bad json`, function (done) {
            got([base, libName, method].join('/'), makeRequest('POST', 'this is bad json'))
            .catch(error => {
              error.statusCode.should.equal(400);
              done()
            })
          });

          it.skip(`${method} should not accept bad component data`);
        });

      });

      it.skip(`${libName} should not allow bad method names`, function * () {
        var result = (yield got([base, libName, 'junk'].join('/'), makeRequest('POST', data.identify)));
        result.status.should.equal(400);
      });
    });
});

function makeRequest(verb, body) {
  return {
    headers: {
      'Content-type': 'application/json'
    },
    body: /^$/.test(body || '') ? null : JSON.stringify(body),
    encoding: 'utf8',
    method: verb,
    json: true
  };
};
