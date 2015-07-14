/*
 * Mushpup Module
 *
 * Requires CryptoJS
 * https://code.google.com/p/crypto-js/
 *
 */
var Mushpup = (function() {

  var VERSION = '3.0';

  var basicHash = function(locus, pocus) {
    var hash = base64SHA(locus + pocus);
    hash = normalizeHash(hash);
    return hash.substr(0,24);
  };

  var normalizeHash = function(hash) {
    return hash
      .replace(/\+/g, 't')
      .replace(/\//g, 'l');
  };

  var base64SHA = function(str) {
    var hashObj = CryptoJS.SHA1(str);
    return CryptoJS.enc.Base64.stringify(hashObj);
  };

  /*
   * validateLocus
   *
   * Validates locus string. Returns validator object.
   */
  var validateLocus = function(locus) {
    return new LocusValidator(locus);
  };

  /*
   * Public Interface
   */
  var API = {
    mush: basicHash,
    validateLocus: validateLocus,
    version: function() { return VERSION; }
  };
  return API;
})();


var LocusValidator = function(locus) {

  var self = this;

  // Class Constants
  var VALID_MODS = [
    '@',  // alphanumeric characters only
    'A',  // alphabetic characters only
    '*',  // include at least one num, alpha, and special (punctuation) character
    '+',  // include at least one numeric character
    'a',  // include at least one alphabetic character
    '!'   // include at least one special character
  ];
  var MUTEX_MODS = [ '@', 'A', '*' ];

  // Public Properties
  self.warnings = [];
  self.errors = [];

  // Private Properties
  var rawLocus,
      normalLocus;

  // Pseudo-constructor
  var init = function(locus) {
    rawLocus = locus;
    normalLocus = normalizeLocus(locus);
    validateLocus(normalLocus);
  };

  /*
   * Public Methods
   */
  this.valid = function() {
    return this.errors.length < 1;
  };

  this.value = function() {
    return normalLocus;
  };

  /*
   * Private Methods
   */
  var normalizeLocus = function(locus) {
    // Trim whitespace
    var trimmedLocus = locus.trim();
    if ( trimmedLocus !== locus ) {
      self.warnings.push(['locus', 'Trimmed whitespace from ends of site value.']);
    }

    // Simplify slashes
    var locusSegments = trimmedLocus.split('/').filter(function(segment) {
      if ( segment ) {
        return segment;
      }
    });
    var filteredLocus = locusSegments.join('/');
    if ( trimmedLocus != filteredLocus ) {
      self.warnings.push(['locus', 'Removed extra slashes from site value.']);
    }

    return filteredLocus;
  };

  var validateLocus = function() {
    return true;
  };

  // Init and return object
  init(locus);
  return self;
};
