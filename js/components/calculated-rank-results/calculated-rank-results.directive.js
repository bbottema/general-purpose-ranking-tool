const CalculatedRankResultsDirectiveFactory = function(RankingService, ColorUtil) {
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
                return ColorUtil.colorize('000000', '00CC00', percentage, ColorUtil.CURVE_EASE_IN_QUAD);
            };

            $scope.$watch(function() {
                // I don't know of any other way of triggering based on 'collections with changing deep properties'
                return JSON.stringify(RankingService.objects.concat(RankingService.categories));
            }, updateRadarGraph);
            $scope.$watch('userAspect', updateRadarGraph);

            function updateRadarGraph() {
                $scope.myJson = {
                    type: 'radar',
                    legend: {
                        align: 'right',
                        'vertical-align': 'middle',
                        layout: Math.ceil(RankingService.objects.length / 2) + 'x' + 2
                    },
                    plot: {
                        aspect: $scope.userAspect || (RankingService.objects.length > 3 ? 'rose' : 'area'),
                        tooltip: {
                            text: "%t"
                        }
                    },
                    scaleV: {
                        visible: false
                    },
                    scaleK: {
                        values: '1:' + RankingService.categories.length + ':1',
                        labels: _.map(RankingService.categories, 'name'),
                        item: {
                            fontColor: '#607D8B',
                            backgroundColor: "white",
                            borderColor: "#aeaeae",
                            borderWidth: 1,
                            padding: '5 10',
                            borderRadius: 10
                        },
                        refLine: {
                            lineColor: '#c10000'
                        },
                        tick: {
                            lineColor: '#59869c',
                            lineWidth: 2,
                            lineStyle: 'dotted',
                            size: 20
                        },
                        guide: {
                            lineColor: "#607D8B",
                            lineStyle: 'solid',
                            alpha: 0.3,
                            backgroundColor: "#c5c5c5 #718eb4"
                        }
                    },
                    series: createSeries(RankingService.categories, RankingService.objects)
                };

                function createSeries(categories, objects) {
                    const series = [];
                    objects.forEach(function(object) {
                        series.push({
                            text: object.name,
                            values: _.map(categories, function(category) {
                                return object[category.name]
                                    ? (objects.length - (object[category.name].rank)) + 1
                                    : 0;
                            })
                        });
                    });

                    return series;
                }
            }
        }
    };
};