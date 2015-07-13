/*
 * Mushpup Tests
 */
(function() {
  module('Mushpup module');

  test('should load Mushpup module and verify version', function() {
    ok(Mushpup);
    equal(Mushpup.version(), '3.0');
  });
})();

(function() {
  module('Mushpup basic hash');

  test('should generate basic hash', function() {
    equal(Mushpup.mush('test', ''), 'qUqP5cyxm6YcTAhz05Hph5gv');
    equal(Mushpup.mush('te', 'st'), 'qUqP5cyxm6YcTAhz05Hph5gv');
    equal(Mushpup.mush('', 'test'), 'qUqP5cyxm6YcTAhz05Hph5gv');
    equal(Mushpup.mush('locus', 'pocus'), 'dhjcHSkePkdoNZDZwrmZO33v');
    equal(Mushpup.mush('mushpup.org/klenwell', 'pocus'), 'dOyw5hTH46xzHJK1N8bagrAT');
  });
})();

(function() {
  var validLocus,
      invalidLocus;

  module('Validate locus', {
    setup: function() {
      validLocus = 'mushpup.org/klenwell';
    },
    teardown: function() {
      validLocus = null;
    }
  });

  test('should validate locus', function() {
    console.debug(validLocus);
    var locusValidator = Mushpup.validateLocus(validLocus);
    ok(locusValidator.valid());
    equal(locusValidator.value(), validLocus);
  });
})();
