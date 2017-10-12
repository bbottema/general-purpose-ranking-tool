var appraisalApp = angular.module('appraisalApp', ['ngAnimate']);

appraisalApp.factory('AppraisalService', function() {
	const AppraisalService = {
		objects: [],
		categories: [],
		ranking: [],

		addObject: function(name) {
			AppraisalService.objects.push({ name: name });
		},
		removeObject: function(object) {
			_.remove(AppraisalService.objects, { name: object.name });
		},
		addCategory: function(name) {
			AppraisalService.categories.push({ name: name, weight: 1 });
		},
		removeCategory: function(category) {
			_.remove(AppraisalService.categories, { name: category.name });
		},
		calculateWeightedRanking: function() {
			AppraisalService.ranking.length = 0;

			const categories = AppraisalService.categories;
			const objects = AppraisalService.objects;

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
				AppraisalService.ranking.push.apply(AppraisalService.ranking, _.sortBy(objects, 'weightedRank'));
				updateAbsoluteRanks(AppraisalService.ranking);
			}

			return AppraisalService.ranking;

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
					const nextRank = i === 0 || rankedEmployees[i] !== rankedEmployees[i - 1];
					idx += (nextRank) ? 1 : 0;
					rankedEmployees[i].absoluteRank = idx;
				}
			}
		},
		exportData: function() {
			return {
				objects: _.map(AppraisalService.objects, _.partialRight(_.omit, ['weightedRank', 'absoluteRank'])),
				categories: AppraisalService.categories
			};
		},
		importPreset: function(presetToImport) {
			if (presetToImport && presetToImport.length) {
				const dataObj = JSON.parse(presetToImport);
				AppraisalService.objects.length = 0;
				AppraisalService.categories.length = 0;
				AppraisalService.objects.push.apply(AppraisalService.objects, dataObj.objects);
				AppraisalService.categories.push.apply(AppraisalService.categories, dataObj.categories);
			}

		}
	};
	return AppraisalService;
});

appraisalApp.controller('AppraisalController', function(AppraisalService) {
	this.objects = AppraisalService.objects;
	this.categories = AppraisalService.categories;
	this.ranking = AppraisalService.ranking;
	this.presetToImport = "";

		this.newObjectName = null;
	this.newCategoryName = null;

	this.addObject = function(name) {
		AppraisalService.addObject(name);
		this.newObjectName = null;
	};
	this.addCategory = function(name) {
		AppraisalService.addCategory(name);
		this.newCategoryName = null;
	};

	this.removeObject = AppraisalService.removeObject;
	this.removeCategory = AppraisalService.removeCategory;
	this.calculateWeightedRanking = AppraisalService.calculateWeightedRanking;
	this.exportData = AppraisalService.exportData;
	this.importPreset = function() {
		AppraisalService.importPreset(this.presetToImport);
		this.presetToImport = "";
	};

	this.colorizeForRank = function(object) {
		const weight = object.absoluteRank;
		const maxWeight = AppraisalService.objects.length;

		const color1 = '000000';
		const color2 = '00FF00';
		const ratio = easeInQuad(weight / maxWeight, 0, 1);

		const r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
		const g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
		const b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));

		return "#" + hex(r) + hex(g) + hex(b);

		function hex(value) {
			const x = value.toString(16);
			return (x.length === 1) ? '0' + x : x;
		}
	};

	function easeInQuad(percentComplete, startValue, endValue) {
		return startValue + endValue * percentComplete * percentComplete;
	}
});