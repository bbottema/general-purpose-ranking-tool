angular.module('rankingTool', ['ngAnimate'])

    .factory('RankingService', RankingServiceFactory)
    .factory('ColorService', ColorServiceFactory)
    .controller('ApplicationController', ApplicationController)
    .constant('SAMPLE_PRESET', SAMPLE_PRESET);