const CalculatedRankResultsDirectiveFactory = function(RankingService, ColorService) {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/components/calculated-rank-results/calculated-rank-results.template.html',
        controller: function($scope) {
            $scope.calculateWeightedRanking = RankingService.calculateWeightedRanking;

            $scope.colorizeForRank = function(object) {
                const weight = _.floor(object.weightedRank);
                const maxWeight = RankingService.objects.length;
                const percentage = weight / maxWeight;
                return ColorService.colorize('000000', '00CC00', percentage, ColorService.CURVE_EASE_IN_QUAD);
            };
        }
    };
};