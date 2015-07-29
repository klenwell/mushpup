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

    prepareRuler();
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

  var prepareRuler = function() {
    var upperRuler = '>***5****0****5****0***>';
    var lowerRuler = '<***0****5****0****5***<';
    var groups = ['west', 'central', 'east'];
    var $upperRuler = $('div.upper.ruler');
    var $lowerRuler = $('div.lower.ruler');

    // Build groups of ruler characters
    jQuery.each(groups, function(n, group) {
      var $upperGroup = $('<span />').addClass('upper group ' + group);
      var $lowerGroup = $('<span />').addClass('lower group ' + group);

      for (var i=0; i < 8; i++) {
        var index = n * 8 + i;
        var upperChar = upperRuler[index].replace('*', '&bull;');
        var lowerChar = lowerRuler[index].replace('*', '&bull;');
        var $upperSpan = $('<span />').addClass('c').html(upperChar);
        var $lowerSpan = $('<span />').addClass('c').html(lowerChar);
        $upperGroup.append($upperSpan);
        $lowerGroup.append($lowerSpan);
      }

      $upperRuler.append($upperGroup);
      $lowerRuler.append($lowerGroup);
    });
  };

  var enableHandlers = function() {
    prepareMushButtonHandler();
    prepareResetButtonHandler();
    prepareConfirmButtonHandler();
  };

  /*
   * DOM Builders
   */
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
    var $actionPanel = $('<div class="action-panel" />');

    var $confirmAction = buildCircleAction('confirm');
    var $mushAction = buildMushAction();
    var $resetAction = buildCircleAction('reset');

    $actionPanel
      .append($confirmAction)
      .append($mushAction)
      .append($resetAction);

    return $actionPanel;
  };

  var buildOutputPanel = function() {
    var $outputPanel = $('<div class="output-panel" />');

    var $alertsBlock = buildAlertsBlock();
    var $payloadBlock = buildPayloadBlock();

    $outputPanel
      .append($alertsBlock)
      .append($payloadBlock);

    return $outputPanel;
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

  var buildCircleAction = function(action) {
    var $actionSpan = $('<span class="action" />').addClass(action);
    var $buttonSpan = $('<span class="circle button" />').text(action);

    $actionSpan.append($buttonSpan);
    return $actionSpan
  };

  var buildMushAction = function() {
    var $mushSpan = $('<span class="action mush" />');
    var $mushButton =
      $('<button type="submit" />')
        .text('mush')
        .addClass('btn btn-lg btn-primary btn-block');

    $mushSpan.append($mushButton);
    return $mushSpan;
  };

  var buildAlertsBlock = function() {
    var $alertsBlock = $('<div class="alerts" />');
    var $helpAlerts = $('<div class="help-alerts" />');
    var $errorAlerts = $('<div class="error-alerts" />');
    var $warningAlerts = $('<div class="warning-alerts" />');

    $alertsBlock
      .append($helpAlerts)
      .append($errorAlerts)
      .append($warningAlerts);

    return $alertsBlock;
  };

  var buildPayloadBlock = function() {
    var $payloadBlock = $('<div class="payload" />');
    var $upperRuler = $('<div class="upper ruler" />');
    var $hash = $('<div class="hash" />');
    var $lowerRuler = $('<div class="lower ruler" />');

    $payloadBlock
      .append($upperRuler)
      .append($hash)
      .append($lowerRuler);

    return $payloadBlock;
  };

  /*
   * Event Handlers
   */
  var prepareMushButtonHandler = function() {};

  var prepareResetButtonHandler = function() {};

  var prepareConfirmButtonHandler = function() {};

  /*
   * Public Interface
   */
  var API = {
    init: init,
    version: function() { return VERSION; }
  };
  return API;
});
