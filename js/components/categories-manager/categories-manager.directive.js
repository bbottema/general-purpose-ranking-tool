const CategoriesManagerDirectiveFactory = function(RankingService) {
    return {
        restrict: 'E',
        scope: { categories: '=' },
        templateUrl: 'js/components/categories-manager/categories-manager.template.html',
        controller: function($scope) {
            $scope.newCategoryName = null;
            $scope.addCategory = function(name) {
                RankingService.addCategory(name);
                $scope.newCategoryName = null;
            };
            $scope.removeCategory = RankingService.removeCategory;
        }
    };
};