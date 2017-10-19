const AdjustCategoryWeightsDirectiveFactory = function() {
    return {
        restrict: 'E',
        scope: {
            categories: '='
        },
        templateUrl: 'js/components/adjust-category-weights/adjust-category-weights.template.html'
    };
};