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
   * Public Interface
   */
  var API = {
    mush: basicHash,
    version: function() { return VERSION; }
  };
  return API;
})();
