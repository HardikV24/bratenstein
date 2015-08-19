app.controller('interactionTaggingController', function($scope, $rootScope) {

  $scope.taggingPhase = "I1";
  $scope.dialogueResolutionStep = "R0";
  
  $scope.highlightedSelection = null;
  $scope.interactionType = null;
  
  $scope.ds = null;
  
  $scope.characterList = null;
  
  this.speakerInput = "";
  this.listenerInput = "";
  $scope.matchingCharacters = null;
  
  $scope.speakers = [];
  $scope.listeners = [];
  
  $scope.dialogueInteractions = [];
  
  $scope.isFirstPhase = function() {
    return $scope.taggingPhase === "I1";
  };
  
  $scope.isSecondPhase = function() {
    return $scope.taggingPhase === "I2";
  };
  
  $scope.resetPhase = function() {
    $scope.taggingPhase = "I1";
    $scope.interactionType = null;
  };
  
  $scope.isHighlighted = function() {
    return !!$scope.highlightedSelection;
  };
  
  $scope.resetHighlightedSelection = function() {
    $scope.highlightedSelection = null;
  };
  
  $scope.setHighlightedSelection = function(selection) {
    $scope.highlightedSelection = selection;
  };
  
  // TODO: Generalize to all types.
  $scope.setInteractionType = function(interactionType) {
    $scope.interactionType = interactionType;
    $scope.taggingPhase = "I2";
  };
  
  $scope.setCharacters = function() {
    if($rootScope.selectedTaggedEntities.length > 0) {
      var characterItems = $rootScope.selectedTaggedEntities.map(function (e) {
        return ["Character", getId(e.entity)];
      });
      
      var entities = $rootScope.docData.entities;
      var triggers = $rootScope.docData.triggers;
      
      var newTriggerId = "T1";
      if (triggers)
        newTriggerId = "T" + getNewIdNumber(entities.concat(triggers));
      else
        newTriggerId = "T" + getNewIdNumber(entities);
    
      var events = $rootScope.docData.events;
      var newEventId = "E1";
      if (events)
        newEventId = "E" + getNewIdNumber(events);
      
      var newTrigger = [
        newTriggerId,
        $scope.interactionType,
        [
          [
            $scope.highlightedSelection.startAt,
            $scope.highlightedSelection.endAt
          ]
        ]
      ];  
      
      if (triggers)
        $rootScope.docData.triggers.push(newTrigger);
      else
        $rootScope.docData.triggers = [newTrigger];
        
      var newEvent = [
        newEventId,
        newTriggerId,
        characterItems
      ];
      
      if (events)
        $rootScope.docData.events.push(newEvent);
      else
        $rootScope.docData.events = [newEvent];
      
      $scope.resetTagging();
    } else
      alert("Select at least one character alias or click Cancel.");
  };
  
  $scope.resetTagging = function() {
    $scope.resetHighlightedSelection();
    $scope.resetPhase();
  };
  
  $scope.resolvingDialogue = function() {
    return $scope.dialogueResolutionStep !== "R0";
  };
  
  $scope.toFirstStep = function() {
    $scope.dialogueResolutionStep = "R1";
  };
  
  $scope.isFirstStep = function() {
    return $scope.dialogueResolutionStep === "R1";
  };
  
  $scope.isSecondStep = function() {
    return $scope.dialogueResolutionStep === "R2";
  };
  
  $scope.selectDS = function() {
    $scope.ds = $rootScope.selectedTaggedEntities[0].entity;
    console.log($scope.ds);
    
    // TODO: Implement function in domain.
    $scope.characterList = $rootScope.collData.entity_types.filter(
      function(tag) {
        return (tag.type != 'ALIAS' &&
          tag.type != 'NON-CHARACTER' &&
          tag.type != 'OTHER' &&
          tag.type != '???' &&
          tag.type != 'UNRESOLVED' &&
          // TODO: Change dialogue tag types to use non-alphabetical characters.
          !(tag.type.charAt(0) == 'D' && tag.type.length <= 3));
      }
    );
  
    $scope.matchingCharacters = $scope.characterList;
  
    $scope.dialogueResolutionStep = "R2";
  };
  
  $scope.clearSpeakerInput = function () {
    this.speakerInput = "";
  };
  
  $scope.clearListenerInput = function () {
    this.listenerInput = "";
  };
  
  $scope.updateMatchingCharacters = function(prefix) {
    $scope.matchingCharacters = $scope.characterList.filter(function(c) {
      return c.type.substring(0, prefix.length) === prefix;
    });
  };
  
  $scope.changeForSpeakerInput = function(prefix) {
    $scope.clearListenerInput();
    $scope.updateMatchingCharacters(prefix);
  };
  
  $scope.changeForListenerInput = function(prefix) {
    $scope.clearSpeakerInput();
    $scope.updateMatchingCharacters(prefix);
  };
  
  $scope.addCharacter = function(submittedCharacterType, list) {
    if (list.filter(function (c) {
      return c.type === submittedCharacterType;
    }) > 0)
      return;
    
    var m = $scope.characterList.filter(function(c) {
       return c.type === submittedCharacterType; 
    });
    
    if (m.length === 0)
      alert("Invalid character " + submittedCharacterType + ".");
    else
      list.push(m[0]);
  };
  
  this.addSpeaker = function(submittedCharacterType) {
    $scope.addCharacter(submittedCharacterType, $scope.speakers);
  };
  
  this.addListener = function(submittedCharacterType) {
    $scope.addCharacter(submittedCharacterType, $scope.listeners);
  };
  
  $scope.createDialogueInteraction = function() {
    var index = $scope.dialogueInteractions.length + 1;
    
    $rootScope.docData.entities.forEach(function (e) {
      if (getId(e) == getId($scope.ds))
        e[1] = 'DS' + index;
    });
    
    $scope.dialogueInteractions.push({
      ds: $scope.ds,
      index: index,
      speakers: $scope.speakers,
      listeners: $scope.listeners
    });
    
    $scope.resetResolution();
  };
  
  $scope.resetResolution = function() {
    $scope.dialogueResolutionStep = "R0";
    $scope.ds = null;
    
    $scope.clearSpeakerInput();
    $scope.clearListenerInput();
    $scope.matchingCharacters = null;
    
    $scope.speakers = [];
    $scope.listeners = [];
  };
  
});
