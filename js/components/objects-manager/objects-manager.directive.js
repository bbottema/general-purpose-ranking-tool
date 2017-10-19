const ObjectsManagerDirectiveFactory = function(RankingService) {
    return {
        restrict: 'E',
        scope: { objects: '=' },
        templateUrl: 'js/components/objects-manager/objects-manager.template.html',
        controller: function($scope) {
            $scope.newObjectName = null;
            $scope.addObject = function(name) {
                RankingService.addObject(name);
                $scope.newObjectName = null;
            };
            $scope.removeObject = RankingService.removeObject;
        }
    };
};