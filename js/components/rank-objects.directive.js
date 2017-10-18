const RankObjectsDirectiveFactory = function($timeout) {
    return {
        restrict: 'E',
        scope: {
            objects: '=',
            categories: '=',
            showHint: '='
        },
        templateUrl: 'js/components/rank-objects.template.html',
        controller: function($scope) {

            $scope.clampRank = function(objectRanking) {
                if (typeof objectRanking.rank === 'number') {
                    objectRanking.rank = Math.min(Math.max(objectRanking.rank, 1), $scope.objects.length);
                    return false;
                }
                return true;
            };

            $scope.focusCategory = function(category) {
                $scope.focussedCategory = category;

                $scope.ranksInCategory = _.times($scope.objects.length, function() { return []; });
                $scope.objectsNotRanked = [];
                $scope.objects.forEach(function(object) {
                    var objectRanking = object[category.name];
                    if (objectRanking && objectRanking.rank) {
                        $scope.ranksInCategory[objectRanking.rank - 1].push(object);
                    } else {
                        $scope.objectsNotRanked.push(object);
                    }
                });
            };

            $scope.syncObjects = function(){
                // sync the rank property of the objects to their respective index in the rank list
                for (var i = 0; i < $scope.ranksInCategory.length; i++) {
                    $scope.ranksInCategory[i].forEach(function(objectForRank) {
                        objectForRank[$scope.focussedCategory.name].rank = i + 1;
                    });
                }
                // the following is needed, because somehow either Angular or dnd-list changes
                // the $$hashkey on the objects (have become different objects to Angular)
                // sad face here...
                $scope.objects.forEach(function(object) {
                    $scope.ranksInCategory.forEach(function(objectsInRank) {
                        objectsInRank.forEach(function(objectInRank) {
                            if (object.name === objectInRank.name) {
                                object[$scope.focussedCategory.name].rank = objectInRank[$scope.focussedCategory.name].rank;
                            }
                        });
                    });
                    $scope.objectsNotRanked.forEach(function(objectNotRanked) {
                        if (object.name === objectNotRanked.name) {
                            object[$scope.focussedCategory.name].rank = null;
                        }
                    });
                });
            };
        }
    };
};