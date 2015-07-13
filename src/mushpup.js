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

  var rawLocus = locus;

  this.warnings = [];
  this.errors = [];

  /*
   * Public Methods
   */
  this.valid = function() {
    return false;
  };

  this.value = function() {
    return normalizedValue();
  };

  /*
   * Private Methods
   */
  var normalizedValue = function() {
    return rawLocus.trim();
  }
};
