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
    var $inputPanel = $('<div class="input-panel" />');
    var $form = $('<form />');
    var $fieldset = $('<fieldset />');

    var $locusGroup = buildLocusFormGroup();
    var $pocusGroup = buildPocusFormGroup();
    var $confirmationGroup = buildConfirmationGroup();

    $fieldset
      .append($locusGroup)
      .append($pocusGroup)
      .append($confirmationGroup);

    $inputPanel
      .append($form)
      .append($fieldset);

    return $inputPanel;
  };

  var buildActionPanel = function() {
  };

  var buildOutputPanel = function() {
  };

  var buildLocusFormGroup = function() {
    var $locusGroup = $('<div class="form-group locus" />');
    var $input = $('<input type="text" id="locus" class="form-control" autofocus />');
    var $p = $('<p class="hidden warn warn-site" />');

    $input.attr('placeholder', 'site (e.g. yahoo.com)');

    $locusGroup.append($input).append($p);
    return $locusGroup;
  };

  var buildPocusFormGroup = function() {
  };

  var buildConfirmationGroup = function() {
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
