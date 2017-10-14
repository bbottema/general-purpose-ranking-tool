const RankObjectsDirectiveFactory = function() {
    return {
        restrict: 'E',
        scope: {
            objects: '=',
            categories: '=',
            showHint: '='
        },
        templateUrl: 'js/components/rank-objects.template.html',
        controller: function($scope) {
            $scope.focusCategory = function(category) {
                $scope.focussedCategory = category;
            }
        }
    };
};