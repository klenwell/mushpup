(function() {
  module("Mushpup module");

  test("Mushpup loaded", function() {
    ok(Mushpup);
    equal(Mushpup.version(), '3.0');
  });
})();
