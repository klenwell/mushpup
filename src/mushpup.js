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
    return self.errors.length < 1;
  };

  this.value = function() {
    return normalLocus;
  };

  /*
   * Private Methods
   */
  // Validation Methods
  var validateLocus = function(locus) {
    self.errors = [];
    self.errors = self.errors.concat(validateModifierSyntax(locus));
    self.errors = self.errors.concat(validateModifierConflicts(locus));
  };

  var validateModifierSyntax = function(locus) {
    if ( ! hasModifierClause(locus) ) {
      return [];
    }

    var errors = [];
    var locusTerms = locus.split('/');
    var modifierClause = locusTerms[locusTerms.length - 1];

    // Look for invalid modifiers.
    for ( var n=0; n < modifierClause.length; n++ ) {
      var modifier = modifierClause[n];
      if ( VALID_MODS.indexOf(modifier) < 0 ) {
        errors.push(['invalid modifier', 'Invalid modifier: ' + modifier]);
      }
    }

    return errors;
  };

  var validateModifierConflicts = function(locus) {
    if ( ! hasModifierClause(locus) ) {
      return [];
    }

    var errors = [];
    var locusTerms = locus.split('/');
    var modifierClause = locusTerms[locusTerms.length - 1];

    var isExclusiveModifier = function(modifier) {
      return MUTEX_MODS.indexOf(modifier) > -1;
    };

    var mutexModifiers = modifierClause.split('').filter(isExclusiveModifier);

    if ( mutexModifiers.length > 1 ) {
      errors.push([
        'conflicting modifiers',
        'Conflicting modifiers (use only one of these): ' + mutexModifiers.join(', ')
      ]);
    }

    return errors;
  };

  // Normalization Methods
  var normalizeLocus = function(locus) {
    locus = trimWhitespaceWithWarning(locus);
    locus = flattenSlashesWithWarning(locus);
    locus = uniquifyModifiersWithWarning(locus);
    return locus;
  };

  var trimWhitespaceWithWarning = function(locus) {
    var trimmedLocus = locus.trim();

    if ( trimmedLocus !== locus ) {
      self.warnings.push(['normalization', 'Trimmed whitespace from ends of site value.']);
    }

    return trimmedLocus;
  };

  var flattenSlashesWithWarning = function(locus) {
    // Collect non-empty segments between slashes.
    var locusSegments = locus.split('/').filter(function(segment) {
      if ( segment ) {
        return segment;
      }
    });

    var filteredLocus = locusSegments.join('/');

    if ( filteredLocus != locus ) {
      self.warnings.push(['normalization', 'Removed extra slashes from site value.']);
    }

    return filteredLocus;
  };

  var uniquifyModifiersWithWarning = function(locus) {
    // Remove duplicate modifiers: ++a!a -> +a!
    var uniqueModifierLocus = locus;

    // Filter out duplicate modifiers
    // WARNING: this could be an issue if user were to use locus unconventionally
    if ( hasModifierClause(locus) ) {
      var locusSegments = locus.split('/');
      var modifierClause = locusSegments[locusSegments.length - 1];
      locusSegments[locusSegments.length - 1] = uniquifyStringCharacters(modifierClause);
      uniqueModifierLocus = locusSegments.join('/');
    }

    if ( uniqueModifierLocus != locus ) {
      self.warnings.push(['normalization', 'Removed duplicate modifiers from site value.']);
    }

    return uniqueModifierLocus;
  };

  var hasModifierClause = function(locus) {
    var locusSegments = locus.split('/');

    // Isolate last segment of locus to look for modifiers
    if ( locusSegments.length <= 1 ) {
      return false;
    }
    else {
      var potentialModifierString = locusSegments[locusSegments.length - 1];
    }

    // Escape regex chars: http://stackoverflow.com/a/9310752/1093087
    var modifierRegexStr = VALID_MODS.join('').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    var modifierInclusionRegex = new RegExp('[' + modifierRegexStr + ']');

    return modifierInclusionRegex.test(potentialModifierString);
  };

  var uniquifyStringCharacters = function(str) {
    // Source: http://stackoverflow.com/a/19301868/1093087
    var isFirstOccurrenceInArray = function(element, index, arr) {
      return arr.indexOf(element) === index;
    };

    return str.split('').filter(isFirstOccurrenceInArray).join('');
  };

  // Init and return object
  init(locus);
  return self;
};
