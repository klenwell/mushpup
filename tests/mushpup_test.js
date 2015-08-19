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

  test('should remove duplicate modifiers', function() {
    var locusInput = 'mushpup.org/klenwell/++?i?';
    var locus = new LocusValidator(locusInput);
    equal(locus.normalized(), 'mushpup.org/klenwell/+?i',
          'Expected duplicate modifiers to be removed');
    equal(locus.value(), 'mushpup.org/klenwell',
          'Expected modifier clause to be truncated');
    equal(locus.warnings.length, 1,
          'Expected 1 warning');
    equal(locus.warnings[0][1], 'Removed duplicate modifiers from site value.',
          'Unexpected warning message');
  });

  test('should produce 3 normalization warnings', function() {
    var locusInput = '  /mushpup.org//klenwell/++?i?/';
    var locus = new LocusValidator(locusInput);
    equal(locus.normalized(), 'mushpup.org/klenwell/+?i',
          'Expected duplicate modifiers to be removed');
    equal(locus.value(), 'mushpup.org/klenwell',
          'Expected modifier clause to be truncated');
    equal(locus.warnings.length, 3,
          'Expected 3 warnings');
    equal(locus.warnings[0][0], 'normalization',
          'Expected normalization tag on warning');
  });
})();

(function() {
  module('Mushpup locus validation');

  test('that locus values are validated as expected', function() {
    var testCases = [
      // Input, Expect
      ['mushpup.org/klenwell', true],
      ['//mushpup.org//klenwell//', true],
      ['/mushpup.org//klenwell/++?!?/', true],
      ['mushpup.org/klenwell/+?i', false],    // i is invalid modifier
      ['mushpup.org/klenwell/&#', false]      // & and # are mutually exclusive modifiers
    ];

    testCases.map(function(testCase) {
      var locusInput = testCase[0];
      var expects = testCase[1];
      var locus = new LocusValidator(locusInput);
      equal(locus.valid(), expects, locusInput + ' not validated as expected.');
    });
  });
})();

(function() {
  module('Mushpup mush with modifiers');

  test('should generate hash with modifiers', function() {
    var testCases = [
      // Locus, Pocus, Expect
      ['test', '', 'qUqP5cyxm6YcTAhz05Hph5gv'],
      ['te', 'st', 'qUqP5cyxm6YcTAhz05Hph5gv'],
      ['', 'test', 'qUqP5cyxm6YcTAhz05Hph5gv'],
      ['locus', 'pocus', 'dhjcHSkePkdoNZDZwrmZO33v'],
      ['mushpup.org/klenwell',   'pocus', 'dOyw5hTH46xzHJK1N8bagrAT'],
      ['mushpup.org/klenwell/*', 'pocus', 'dOyw5-TH46xz7(K1N8ba2#AT'],
      ['mushpup.org/klenwell/&', 'pocus', 'dOywchTHCDxzHJKaNEbagrAT'],
      ['mushpup.org/klenwell/#', 'pocus', '940853974691790138762309'],
      ['mushpup.org/klenwell/?+!', 'pocus', 'dOyw5-TH46xz7(K1N8ba2#AT'],
    ];

    testCases.map(function(testCase) {
      var locusInput = testCase[0];
      var pocusInput = testCase[1];
      var expects = testCase[2];

      var validatedLocus = new LocusValidator(locusInput);
      var validatedPocus = new PocusValidator(pocusInput);

      var locus = validatedLocus.value();
      var pocus = validatedPocus.value();
      var modifiers = validatedLocus.modifiers();

      equal(Mushpup.mush(locus, pocus, modifiers), expects,
            'Unexpected mush: ' + [locusInput, pocusInput].join(', '));
    });
  });

  test('that non-exclusive modifiers are commutative', function() {
    var baseLocus = 'mushpup.org/klenwell/';
    var pocus = 'pocus';

    var testCases = [
      // modifier str, modifier str
      ['?+!', '!+?'],
      ['+!?', '!?+'],
      ['?+!', '*']
    ];

    testCases.map(function(testCase) {
      var locusInput1 = baseLocus + testCase[0];
      var locusInput2 = baseLocus + testCase[1];

      var validatedLocus1 = new LocusValidator(locusInput1);
      var validatedLocus2 = new LocusValidator(locusInput2);

      var locus1 = validatedLocus1.value();
      var locus2 = validatedLocus1.value();

      equal(Mushpup.mush(validatedLocus1.value(), pocus, validatedLocus1.modifiers()),
            Mushpup.mush(validatedLocus2.value(), pocus, validatedLocus2.modifiers()),
            'Unexpected mush: ' + testCase.join(', '));
    });
  });

  test('should not detect modifiers', function() {
    // This was an issue: https://github.com/klenwell/mushpup/issues/5
    var testCases = [
      // Locus, Pocus, Expect
      ['abc', 'test', 'SUQK587Jg65hVbHU2A7ne9Bx'],
      ['test/abc', 'test', '7PlsyqtSJcT9GmxlWBaHinAq'],
      ['test.com/abc', 'test', 'h2lo6EmZ4TeEa8mYWSqcUKZv']
    ];

    testCases.map(function(testCase) {
      var locusInput = testCase[0];
      var pocusInput = testCase[1];
      var expects = testCase[2];

      var validatedLocus = new LocusValidator(locusInput);
      var validatedPocus = new PocusValidator(pocusInput);

      var locus = validatedLocus.value();
      var pocus = validatedPocus.value();
      var modifiers = validatedLocus.modifiers();

      equal(Mushpup.mush(locus, pocus, modifiers), expects,
            'Unexpected mush: ' + [locusInput, pocusInput].join(', '));
    });
  });
})();
