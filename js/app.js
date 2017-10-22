angular.module('rankingTool', ['ngAnimate', 'dndLists', 'zingchart-angularjs'])

    .factory('RankingService', RankingServiceFactory)
    .factory('ColorService', ColorServiceFactory)
    .controller('ApplicationController', ApplicationController)
    .controller('CategoryRankingHelperController', CategoryRankingHelperController)
    .constant('SAMPLE_PRESET', SAMPLE_PRESET)
    .directive('rankObjects', RankObjectsDirectiveFactory)
    .directive('adjustCategoryWeights', AdjustCategoryWeightsDirectiveFactory)
    .directive('calculatedRankResults', CalculatedRankResultsDirectiveFactory)
    .directive('objectsManager', ObjectsManagerDirectiveFactory)
    .directive('categoriesManager', CategoriesManagerDirectiveFactory);