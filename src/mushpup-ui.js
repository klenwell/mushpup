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
    var $pocusConfirmGroup = buildPocusConfirmFormGroup();

    $fieldset
      .append($locusGroup)
      .append($pocusGroup)
      .append($pocusConfirmGroup);

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
    var $p = $('<p class="hidden warn warn-locus" />');

    $input.attr('placeholder', 'site (e.g. yahoo.com)');

    $locusGroup.append($input).append($p);
    return $locusGroup;
  };

  var buildPocusFormGroup = function() {
    var $pocusGroup = $('<div class="form-group pocus" />');
    var $input = $('<input type="password" id="pocus" class="form-control" />');
    var $p = $('<p class="hidden warn warn-pocus" />');

    $input.attr('placeholder', 'mushpup secret word');

    $pocusGroup.append($input).append($p);
    return $pocusGroup;
  };

  var buildPocusConfirmFormGroup = function() {
    var $pocusConfirmGroup = $('<div class="form-group rolled-up pocus-confirm" />');
    var $input = $('<input type="password" id="pocus-confirm" class="form-control" />');
    var $p = $('<p class="hidden warn warn-pocus-confirm" />');

    $input.attr('placeholder', 'confirm secret word');

    $pocusConfirmGroup.append($input).append($p);
    return $pocusConfirmGroup;
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
