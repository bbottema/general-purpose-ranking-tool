angular.module('rankingTool', ['ngAnimate', 'dndLists'])

    .factory('RankingService', RankingServiceFactory)
    .factory('ColorService', ColorServiceFactory)
    .controller('ApplicationController', ApplicationController)
    .constant('SAMPLE_PRESET', SAMPLE_PRESET)
    .directive('rankObjects', RankObjectsDirectiveFactory)
    .directive('adjustCategoryWeights', AdjustCategoryWeightsDirectiveFactory)
    .directive('calculatedRankResults', CalculatedRankResultsDirectiveFactory)
    .directive('objectsManager', ObjectsManagerDirectiveFactory)
    .directive('categoriesManager', CategoriesManagerDirectiveFactory);