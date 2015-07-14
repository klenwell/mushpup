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
  module('Mushpup locus normalization');

  test('that locus values are normalized as expected', function() {
    var testCases = [
      // Input, Expect
      ['mushpup.org/klenwell', 'mushpup.org/klenwell'],
      ['  mushpup.org/klenwell  ', 'mushpup.org/klenwell'],
      ['/mushpup.org/klenwell/', 'mushpup.org/klenwell'],
      ['//mushpup.org//klenwell//', 'mushpup.org/klenwell']
    ];

    testCases.map(function(testCase) {
      var locusInput = testCase[0];
      var expects = testCase[1];
      var locus = new LocusValidator(locusInput);
      equal(locus.value(), expects);
    });
  });

  test('that locus with extra spaces raises a warning', function() {
    var locusInput = '  mushpup.org/klenwell  ';
    var locus = new LocusValidator(locusInput);
    equal(locus.value(), locusInput.trim());
    equal(locus.warnings.length, 1);
    equal(locus.warnings[0][1], 'Trimmed whitespace from ends of site value.');
  });

  test('that locus with extra slashes raises a warning', function() {
    var locusInput = '//mushpup.org//klenwell//';
    var locus = new LocusValidator(locusInput);
    equal(locus.value(), 'mushpup.org/klenwell');
    equal(locus.warnings.length, 1);
    equal(locus.warnings[0][1], 'Removed extra slashes from site value.');
  });

  test('should removes duplicate modifiers', function() {
    var locusInput = 'mushpup.org/klenwell/++aia';
    var locus = new LocusValidator(locusInput);
    equal(locus.value(), 'mushpup.org/klenwell/+ai',
          'Expected duplicate modifiers to be removed');
    equal(locus.warnings.length, 1,
          'Expected 1 warning');
    equal(locus.warnings[0][1], 'Removed duplicate modifiers from site value.',
          'Unexpected warning message');
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
