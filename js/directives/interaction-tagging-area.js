app.directive('interactionTaggingArea', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      'close': '&onClose',
      selected: '=selected'
    },
    templateUrl: 'templates/interaction-tagging-area.html'
  };
});
