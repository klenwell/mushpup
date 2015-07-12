module("Mushpup Test 1");

test("Mushpup loaded", function() {
  ok(Mushpup, "Mushpup module found");
  ok(0, 'Should fail')
});


module("Mushpup Test 2");

test("Mushpup loaded", function() {
  ok(Mushpup, "Mushpup module found");
});
