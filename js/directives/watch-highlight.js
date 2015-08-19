app.directive('watchHighlight', function() {
  return function($scope, elem) {
    elem.on('mouseup', function() {
      var selectedText = $.trim(("" + document.getSelection()));
      if (selectedText.length > 0) {
        var highlightedSelection = {};
          
        var tspan_array = [];
        var cur_offset = 0; 
        angular.forEach(elem.find('tspan'), function (tspan) {
          tspan_array.push(cur_offset);
          cur_offset += tspan.textContent.length;
        });
        
        // DEBUG
        // console.log(selectedText);
        
        var dataChunkId = document.getSelection().anchorNode.parentElement.attributes['data-chunk-id'];
        if (dataChunkId) {
          var start_at = tspan_array[dataChunkId.nodeValue];
          var index = $scope.docData.text.indexOf(selectedText, start_at);
          
          // DEBUG
          // console.log(index);
          // console.log(index+selectedText.length);
          
          highlightedSelection.text = selectedText;
          highlightedSelection.startAt = index;
          highlightedSelection.endAt = index + selectedText.length;
          
          $scope.setHighlightedSelection(highlightedSelection); 
        }
      } else if (!$scope.isSecondPhase()) {
        $scope.resetTagging();
      }
    });
  }; 
});
