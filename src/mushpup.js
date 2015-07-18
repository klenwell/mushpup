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
    return MushpupHasher.basicHash(locus, pocus)
  };

  var mush = function(locus, pocus) {
    return MushpupHasher.hashWithModifiers(locus, pocus)
  };

  var validateLocus = function(locus) {
    return new LocusValidator(locus);
  };

  /*
   * Public Interface
   */
  var API = {
    basicHash: basicHash,
    mush: mush,
    validateLocus: validateLocus,
    version: function() { return VERSION; }
  };
  return API;
})();


var MushpupHasher = (function() {
  // Maps
  var MUSHPUP_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789tl';
  var ALPHA_MAP   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzAaBbCcDdEeFf';
  var NUMERIC_MAP = '0123456789012345678901234567890123456789012345678901012345678923';
  var SYMBOL_MAP  = '!?@#$%^&*()_+-={}|[]!?@#$%^&*()_+-={}|[]!?@#$%^&*()_+-={}|[]!?@#';

  var basicHash = function(locus, pocus) {
    var hash = base64SHA(locus + pocus);
    hash = normalizeHash(hash);
    return hash.substr(0,24);
  };

  var hashWithModifiers = function(locus, pocus) {
    var validatedLocus = new LocusValidator(locus);
    var modifiers = validatedLocus.modifiers();
    var hash = basicHash(validatedLocus.value(), pocus);

    if ( modifiers ) {
      hash = applyModifers(hash, modifiers);
    }

    return hash;
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

  var applyModifers = function(hash, modifiers) {
    for (var i=0; i < modifiers.length; i++) {
      var modifier = modifiers[i];

      if ( modifier == 'a' ) {
        hash = insertLetterIntoEachStanza(hash);
      }
      else if ( modifier == '+' ) {
        hash = insertNumberIntoEachStanza(hash);
      }
      else if ( modifier == '!' ) {
        hash = insertSymbolIntoEachStanza(hash);
      }
      else if ( modifier == '@' ) {
        hash = hash;
      }
      else if ( modifier == 'A' ) {
        hash = alphaOnly(hash);
      }
      else if ( modifier == '#' ) {
        hash = numericOnly(hash);
      }
      else if ( modifier == '*' ) {
        hash = insertLetterIntoEachStanza(hash);
        hash = insertNumberIntoEachStanza(hash);
        hash = insertSymbolIntoEachStanza(hash);
      }
      else {
        console.warn('Invalid modifier: ' + modifier);
      }
    };

    return hash;
  };

  var insertLetterIntoEachStanza = function(hash) {
    // Insures one alphabetic character in each stanza.
    var stanzas = hashToStanzas(hash);

    for (var i=0; i < stanzas.length; i++) {
      var stanza = stanzas[i];

      // Insert one in 3-spot.
      var char3 = stanza[3];
      var mapIndex = MUSHPUP_MAP.indexOf(char3);
      var alphaChar = ALPHA_MAP[mapIndex];
      stanzas[i] = stanza.slice(0,3) + alphaChar + stanza.slice(4,8);
    }

    return stanzas.join('');
  };

  var insertNumberIntoEachStanza = function(hash) {
    // Insures one numeric character in each stanza.
    var stanzas = hashToStanzas(hash);

    for (var i=0; i < stanzas.length; i++) {
      var stanza = stanzas[i];

      // Insert numeric char in 4-spot.
      var char4 = stanza[4];
      var mapIndex = MUSHPUP_MAP.indexOf(char4);
      var numericChar = NUMERIC_MAP[mapIndex];
      stanzas[i] = stanza.slice(0,4) + numericChar + stanza.slice(5,8);
    }

    return stanzas.join('');
  };

  var insertSymbolIntoEachStanza = function(hash) {
    // Insures one symbol character in each stanza.
    var stanzas = hashToStanzas(hash);

    for (var i=0; i < stanzas.length; i++) {
      var stanza = stanzas[i];

      // Insert symbol in 5-spot.
      var char5 = stanza[5];
      var mapIndex = MUSHPUP_MAP.indexOf(char5);
      var symbol = SYMBOL_MAP[mapIndex];
      stanzas[i] = stanza.slice(0,5) + symbol + stanza.slice(6,8);
    }

    return stanzas.join('');
  };

  var alphaOnly = function(hash) {
    var alphas = [];

    for (var i=0; i < hash.length; i++) {
      var nextChar = hash[i];
      var mapIndex = MUSHPUP_MAP.indexOf(nextChar);
      var alphaChar = ALPHA_MAP[mapIndex];
      alphas.push(alphaChar);
    }

    return alphas.join('');
  };

  var numericOnly = function(hash) {
    var numerics = [];

    for (var i=0; i < hash.length; i++) {
      var nextChar = hash[i];
      var mapIndex = MUSHPUP_MAP.indexOf(nextChar);
      var number = NUMERIC_MAP[mapIndex];
      numerics.push(number);
    }

    return numerics.join('');
  };

  var hashToStanzas = function(hash) {
    return [hash.slice(0,8), hash.slice(8,16), hash.slice(16,24)];
  };

  /*
   * Public Interface
   */
  var API = {
    basicHash: basicHash,
    hashWithModifiers: hashWithModifiers
  };
  return API;
})();


var LocusValidator = function(locus) {

  var self = this;

  // Class Constants
  var VALID_MODS = [
    '@',  // alphanumeric characters only
    'A',  // alphabetic characters only
    '#',  // numeric only
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

  this.input = function() {
    return rawLocus;
  };

  this.normalized = function() {
    return normalLocus;
  };

  this.value = function() {
    // Remove modifier clause
    if ( hasModifierClause(normalLocus) ) {
      var locusTerms = normalLocus.split('/');
      locusTerms.pop();
      return locusTerms.join('/');
    }
    else {
      return normalLocus;
    }
  };

  this.modifiers = function() {
    if ( ! hasModifierClause(normalLocus) ) {
      return null;
    }
    else {
      var locusTerms = normalLocus.split('/');
      var modifierClause = locusTerms[locusTerms.length - 1];
      return modifierClause.split('');
    }
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

  // Helper Methods
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
