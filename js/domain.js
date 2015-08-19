
/* brat entity indices. */
var ID_IND = 0;
var TYPE_IND = 1;
var CHAR_OFFSETS_IND = 2;
var START_OFFSET_IND = 0;
var END_OFFSET_IND = 1;

var getId = function (e) { return e[ID_IND]; };

var getType = function (e) { return e[TYPE_IND]; };

var getStartOffset = function (e) {
    return e[CHAR_OFFSETS_IND][0][START_OFFSET_IND];
};

var getEndOffset = function (e) {
    return e[CHAR_OFFSETS_IND][0][END_OFFSET_IND];
};

var getSameOffsetEntities = function (e, entities) {
    return entities.filter(function (f) {
        return getStartOffset(e) == getStartOffset(f) &&
        getEndOffset(e) == getEndOffset(f);
    });
};

var getIdNumbers = function (items) {
    return items.map(function(i) {
        return parseInt(getId(i).substring(1, getId(i).length));
    });
};

var getNewIdNumber = function (items) {
    if (items.length > 0) {
        var idNums = getIdNumbers(items);
    
        var i = 1;
        for (i = 1; i <= idNums.length; i++) {
            if (idNums.indexOf(i) == -1)
                return i;
        };
        
        return i;   
    }
    
    return 1;
};

// var getEntitySpan = function(text, entity) {
//     return text.substring(entity[2][0][0], entity[2][0][1]).trim();
// };