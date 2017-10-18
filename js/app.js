angular.module('rankingTool', ['ngAnimate', 'dndLists'])

    .factory('RankingService', RankingServiceFactory)
    .factory('ColorService', ColorServiceFactory)
    .controller('ApplicationController', ApplicationController)
    .constant('SAMPLE_PRESET', SAMPLE_PRESET)
    .directive('rankObjects', RankObjectsDirectiveFactory);