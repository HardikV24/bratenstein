app.controller('bratVisController', function($scope, $rootScope,
  $firebaseObject) {
  
  var collDataRef = new Firebase(FB.link + "/collData");
  var docDataRef = new Firebase(FB.link + "/docData");
  
  var collDataObjRef = $firebaseObject(collDataRef);
  collDataObjRef.$bindTo($rootScope, 'collData');
  var docDataObjRef = $firebaseObject(docDataRef);
  docDataObjRef.$bindTo($rootScope, 'docData');
  
  collDataObjRef.$loaded(
    function(collData) {
      docDataObjRef.$loaded(function(docData) {
        head.ready(function() {
          var liveDiv = $('#brat-view');
  
          // Hook into the dispatcher.
          var liveDispatcher = Util.embed(
            'brat-view',
            $.extend({
              'collection': null
            }, collData),
            $.extend({}, docData),
            webFontURLs
          );
  
          liveDispatcher.on('renderError: Fatal', function() {
            // liveDiv.css({'border': '2px solid red'}); // Setting this blows the layout.
          });
          
          // TODO: Implement as services so its accessible outside the controller.
          $rootScope.selectedTaggedEntities = [];
          // liveDispatcher.on('doneRendering', $scope.findVisual);
  
          // $rootScope.taggedEntities = sortTaggedEntities(docData.entities);
  
          // // DECPRECATED
          // // $rootScope.entity = firstTaggedEntity($rootScope.taggedEntities);
          // $rootScope.selectedEntity = firstTaggedEntity($rootScope.taggedEntities);
          // $rootScope.taggedEntityIndex = 0;
          // $rootScope.span = getSpan($rootScope.selectedEntity);
          
          // /* Tags that refer specifically to a character. */
          // $rootScope.characterTags = $rootScope.collData.entity_types.filter(function (tag) {
          //   return isCharacterTag(tag);
          // });
          
          // /* Tags that don't refer specifically to a character. */
          // $rootScope.nonCharacterTags = $rootScope.collData.entity_types.filter(function (tag) {
          //   return !isCharacterTag(tag);
          // });
  
          // /* Non-character tags that can be used as tags. */
          // $rootScope.taggableNonCharacterTags = $rootScope.nonCharacterTags.filter(function (tag) {
          //   return !isAliasTag(tag);
          // });
            
          // $rootScope.tagOrdering = $rootScope.characterTags.map(function (tag) { return tag.type; });
          
          // $rootScope.aliasesRemaining = countAliases($rootScope.taggedEntities);
          // $rootScope.unresolvedsRemaining = countUnresolveds($rootScope.taggedEntities);
  
          // docDataObjRef.$watch(function() {
          //   $rootScope.aliasesRemaining = countAliases($rootScope.taggedEntities);
          //   $rootScope.unresolvedsRemaining = countUnresolveds($rootScope.taggedEntities);
          // });
  
          collDataObjRef.$watch(function() {
            liveDispatcher.post('collectionLoaded', [$.extend(
              { 'collection': null },
              $rootScope.collData
            )]);
          });
  
          docDataObjRef.$watch(function() {
            liveDispatcher.post('requestRenderData', [$.extend({},
              $rootScope.docData)]
            );
          });
        });
      },
      function(error) {
        console.error("Error:", error);
      })
    },
    function(error) {
      console.error("Error:", error);
    }
  );
  
  // TODO: Implement better selection display.
  $scope.applyTaggedSelectionStyle = function (el) {
    $(el).css({'stroke': '#000', 'stroke-width': '3px'});
  };

  $scope.unapplyTaggedSelectionStyle = function (el, prevStroke) {
    $(el).css({'stroke': prevStroke, 'stroke-width': '1px'});
  };

  $scope.unselectTagged = function() {
    $rootScope.selectedTaggedEntities.forEach(function (se){
      $scope.unapplyTaggedSelectionStyle(se.element, se.prevStroke);
    });
    
    $rootScope.selectedTaggedEntities = [];
  };
  
  // TODO: Clean-up.
  $rootScope.selectTagged = function (e) {
    if (e.srcElement.nodeName == 'rect' &&
      e.srcElement.attributes.class.nodeValue.indexOf('span') > -1) {
      var attributes = e.srcElement.attributes;
      for (var i = 0, len = attributes.length; i < len; i++) {
        if (attributes[i].nodeName == 'data-span-id') {
          var id = attributes[i].value;
          
          // find function on arrays doesn't work in Chrome :(.
          var entity = $rootScope.docData.entities.filter(function (e) {
            return getId(e) == id;
          });
          
          if (entity.length > 0) {
            entity = entity[0];
            
            var sameOffsetEntities = getSameOffsetEntities(entity,
              $rootScope.docData.entities);
            
            var newTaggedEntities = sameOffsetEntities.map(
              function (e) {
                return {
                  entity: e,
                  element: null,
                  prevStroke: null
                };
              }
            );
            
            $('rect').each(function () {
              var el = this;
              var dataSpanId = $(this).attr('data-span-id');
              newTaggedEntities.forEach(function (se) {
                if (dataSpanId === getId(se.entity)) {
                  se.element = el;
                  se.prevStroke = $(el).attr('stroke');
                  $scope.applyTaggedSelectionStyle(el);
                }
              });
            });
            
            $rootScope.selectedTaggedEntities = $rootScope.selectedTaggedEntities.concat(newTaggedEntities);
          };
        }
      }
    } else
      $scope.unselectTagged();
  };
});
