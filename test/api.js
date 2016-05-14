require('mocha-generators')
  .install();

var chai = require('chai');
var debug = require('debug')('segment-sim:test:lib');
var data = require('./data');
var app = require('../src/app');
var got = require('got');

describe('api', function() {
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
          it(`should run ${method} successfully`, function * () {
            var result = (yield got([base, libname, method].join('/'), makeRequest('POST', data[method]))).body;
            result.should.be.ok;
            result.result.should.be.okay;
            chai.should.not.exist(result.err);
          });

          it(`${method} should error on bad json`, function*() {
            var result = (yield got([base, libname, method].join('/'), makeRequest('POST', 'this is bad json')));
            result.body.should.be.ok;
            result.body.err.should.be.ok;
            chai.should.not.exist(result.result);
            result.status.should.equal(400);
          });
        });

        it.skip(`${method} should not accept bad component data`);
      });
    });

  it.skip(`${libName} should not allow bad method names`, function*(){
    var result = (yield got([base, libname, 'junk'].join('/'), makeRequest('POST', data.identify)));
    result.status.should.equal.400;
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
