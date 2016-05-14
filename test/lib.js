var chai = require('chai');
var debug = require('debug')('segment-sim:test:lib');
var lib = require('../src/server/lib');
var data = require('./data');

describe('lib', function() {
  Object.keys(lib)
    .forEach(function(libName) {
      describe(libName, function() {
        it('should be constructable', function(done) {
          new lib[libName]();
          done();
        });

        ['identify', 'track', 'page', 'alias', 'group'].forEach(function(method) {
          it(`should run ${method} successfully`, function(done) {
            var instance = new lib[libName]();
            instance[method](data[method], function(err, response) {
              debug(err);
              debug(response);

              chai.should().not.exist(err);
              response.should.be.ok;
              done();
            });
          });

          it.skip(`${method} should error on bad json`, function(done) {
            var instance = new lib[libName]();
            instance[method]('this is not json', function(err, response){
              debug(err);
              debug(response);

              err.should.be.ok;
              done();
            });
          });
        
          it.skip(`${method} should not accept bad component data`);
        });

      });
    });
});
