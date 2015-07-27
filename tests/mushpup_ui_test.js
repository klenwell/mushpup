/*
 * Mushpup-UI Tests
 */
(function() {
  module('Mushpup-UI module');

  test('should load Mushpup-UI module and verify version', function() {
    var ui = MushpupUI();
    ok(MushpupUI);
    ok(ui);
    equal(ui.version(), '2.0');
  });
})();

(function() {
  var ui;

  module('Mushpup-UI DOM manipulation', {
    setup: function() {
      ui = MushpupUI();
    },

    teardown: function() {
      ui = null;
    }
  });

  test('should display mushpup root element', function() {
    equal($('div#qunit-fixture').length, 1);
    equal($('div.mushpup').length, 0);
    ui.init('div#qunit-fixture');
    equal($('div.mushpup').length, 1);
  });

  test('should display mushpup input panel', function() {
    equal($('div.input-panel').length, 0);
    equal($('div.form-group.locus').length, 0);
    equal($('div.form-group.pocus').length, 0);
    equal($('div.form-group.confirmation').length, 0);

    ui.init('div#qunit-fixture');

    equal($('div.input-panel').length, 1, 'div.input-panel not loaded');
    equal($('div.form-group.locus').length, 1, 'locus form group not loaded');
    equal($('div.form-group.pocus').length, 1, 'pocus form group not loaded');
    equal($('div.form-group.confirmation').length, 0);  // Hidden
  });
})();
