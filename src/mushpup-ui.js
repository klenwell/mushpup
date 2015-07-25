/*
 * Mushpup-UI Module
 *
 * Requires jQuery, jQuery-UI
 *
 */
var MushpupUI = (function() {

  var VERSION = '2.0';

  var init = function(selector) {
    var $selectedElement = $(selector);
    var $mushpupInterface = buildInterface();
    $selectedElement.append($mushpupInterface);
    enableHandlers($selectedElement);
  };

  var buildInterface = function() {
    var $mushpupInterface = $('<div class="mushpup" />');
    var $inputPanel = buildInputPanel();
    var $actionPanel = buildActionPanel();
    var $outputPanel = buildOutputPanel();

    $mushpupInterface
      .append($inputPanel)
      .append($actionPanel)
      .append($outputPanel);

    return $mushpupInterface;
  };

  var enableHandlers = function() {
  };

  // DOM Builders
  var buildInputPanel = function() {
  };

  var buildActionPanel = function() {
  };

  var buildOutputPanel = function() {
  };

  /*
   * Public Interface
   */
  var API = {
    init: init,
    version: function() { return VERSION; }
  };
  return API;
});
