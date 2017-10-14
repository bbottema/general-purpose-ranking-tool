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
};