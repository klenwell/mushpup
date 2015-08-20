QUnit.assert.assertStartsWith = function( str, substr, message ) {
  str = (!! str) ? str : '<STR UNDEFINED>';
  substr = (!! substr) ? substr : '<SUBSTR UNDEFINED>';
  message = (!! message) ? message : str + ' does not start with ' + substr;
  this.push( str.slice(0, substr.length) == substr, str, substr, message );
};
