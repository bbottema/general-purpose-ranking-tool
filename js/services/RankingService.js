function RankingServiceFactory(SAMPLE_PRESET) {
    const RankingService = {
        objects: [],
        categories: [],
        ranking: [],

        addObject: function(name) {
            RankingService.objects.push({ name: name });
        },
        removeObject: function(object) {
            _.remove(RankingService.objects, { name: object.name });
        },
        addCategory: function(name) {
            RankingService.categories.push({ name: name, weight: 1 });
        },
        removeCategory: function(category) {
            _.remove(RankingService.categories, { name: category.name });
        },
        calculateWeightedRanking: function() {
            RankingService.ranking.length = 0;

            const categories = RankingService.categories;
            const objects = RankingService.objects;

            if (objectsAreFullyRanked(objects, categories)) {
                objects.forEach(function(object) {
                    object.weightedRank = 0;
                    categories.forEach(function(category) {
                        // map the category-specific rank to a global scale (global scale is 1..nr-of-objects)
                        const categoryRank = object[category.name].rank;
                        const allRanksForCategory = _.map(objects, category.name + '.rank');
                        const maxRankOnGlobalScale = objects.length;
                        const normalizedRank = normalizeRankToGlbalScale(categoryRank, allRanksForCategory, maxRankOnGlobalScale);
                        const arithmeticWeight = calculateArithmeticWeight(category.weight, _.map(categories, 'weight'));
                        object.weightedRank = object.weightedRank + (normalizedRank * arithmeticWeight);
                    });
                });
                RankingService.ranking.push.apply(RankingService.ranking, _.sortBy(objects, 'weightedRank'));
                updateAbsoluteRanks(RankingService.ranking);
            }

            return RankingService.ranking;

            // checks if for all objects that all categories have been filled in with a rank
            function objectsAreFullyRanked(objects, categories) {
                return objects.length && categories.length &&
                    _.reduce(objects, function(objectsComplete, object) {
                        return objectsComplete && _.reduce(categories, function(objectsComplete, category) {
                                return objectsComplete && object[category.name] && object[category.name].rank;
                            }, objectsComplete);
                    }, true);
            }

            function normalizeRankToGlbalScale(denormalizedRank, valuesScaleA, maxScaleB) {
                const minValueScaleA = _.min(valuesScaleA);
                const maxValueScaleA = _.max(valuesScaleA);
                const percentage = (denormalizedRank - minValueScaleA) / (maxValueScaleA - minValueScaleA);
                return percentage * (maxScaleB - 1) + 1;
            }

            function calculateArithmeticWeight(weightFactor, weightFactors) {
                return weightFactor / _.sum(weightFactors);
            }

            function updateAbsoluteRanks(rankedEmployees) {
                var idx = 0;
                for (var i = 0; i < rankedEmployees.length; i++) {
                    const nextRank = i === 0 ||
                        _.floor(rankedEmployees[i].weightedRank) !== _.floor(rankedEmployees[i - 1].weightedRank);
                    idx += (nextRank) ? 1 : 0;
                    rankedEmployees[i].absoluteRank = idx;
                }
            }
        },
        canCondense: function(category) {
            const objectsSortedByRankForCategory = _.sortBy(RankingService.objects, category.name + '.rank');
            for (var currentRank = 1; currentRank <= objectsSortedByRankForCategory.length; currentRank++) {
                for (var i = 0; i < objectsSortedByRankForCategory.length; i++) {
                    var currentObjectForCategory = objectsSortedByRankForCategory[i][category.name];
                    if (currentObjectForCategory && currentObjectForCategory.rank) {
                        if (currentObjectForCategory.rank === currentRank) {
                            break; // current rank is occupied, continue with next rank
                        } else if (currentObjectForCategory.rank > currentRank) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        canRedistribute: function(category) {
            return true;
        },
        canClamp: function(category) {
            return _.some(RankingService.objects, function(object) {
                return object[category.name] && object[category.name].rank > RankingService.objects.length;
            });
        },
        condenseForCategory: function(category) {
            const objectsSortedByRankForCategory = _.sortBy(RankingService.objects, category.name + '.rank');
            console.info('current ranking:', _.map(objectsSortedByRankForCategory, category.name + '.rank'));

            for (var currentRank = 1; currentRank <= objectsSortedByRankForCategory.length; currentRank++) {
                for (var i = 0; i < objectsSortedByRankForCategory.length; i++) {
                    var currentObjectForCategory = objectsSortedByRankForCategory[i][category.name];
                    if (currentObjectForCategory && currentObjectForCategory.rank) {
                        if (currentObjectForCategory.rank === currentRank) {
                            break; // current rank is occupied, continue with next rank
                        } else if (currentObjectForCategory.rank > currentRank) {
                            // current rank is not occupied, move all lower ranks up
                            for (var j = i; j < objectsSortedByRankForCategory.length; j++) {
                                var lowerRanked = objectsSortedByRankForCategory[j][category.name];
                                lowerRanked && lowerRanked.rank && lowerRanked.rank--
                            }
                            currentRank--; // in case multiple objects share current rank
                            break;
                        }
                    }
                }
                console.info('current rank and result so far:', currentRank, _.map(objectsSortedByRankForCategory, category.name + '.rank'));
            }
        },
        redistributeForCategory: function(category) {
        },
        clampForCategory: function(category) {
            RankingService.objects.forEach(function(object) {
                var objectRanking = object[category.name];
                if (objectRanking && objectRanking.rank) {
                    objectRanking.rank = Math.min(objectRanking.rank, RankingService.objects.length);
                }
            });
        },
        exportData: function() {
            return {
                objects: _.map(RankingService.objects, _.partialRight(_.omit, ['weightedRank', 'absoluteRank'])),
                categories: RankingService.categories
            };
        },
        importPreset: function(presetToImport) {
            if (presetToImport && presetToImport.length) {
                const dataObj = JSON.parse(presetToImport);
                RankingService.objects.length = 0;
                RankingService.categories.length = 0;
                RankingService.objects.push.apply(RankingService.objects, dataObj.objects);
                RankingService.categories.push.apply(RankingService.categories, dataObj.categories);
            }

        },
        loadSamplePreset: function() {
            RankingService.importPreset(SAMPLE_PRESET);
        }
    };
    return RankingService;
}