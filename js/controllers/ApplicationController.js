function ApplicationController(RankingService, ColorService) {
    this.objects = RankingService.objects;
    this.categories = RankingService.categories;
    this.ranking = RankingService.ranking;
    this.presetToImport = "";

    this.newObjectName = null;
    this.newCategoryName = null;

    this.addObject = function(name) {
        RankingService.addObject(name);
        this.newObjectName = null;
    };
    this.addCategory = function(name) {
        RankingService.addCategory(name);
        this.newCategoryName = null;
    };

    this.removeObject = RankingService.removeObject;
    this.removeCategory = RankingService.removeCategory;
    this.calculateWeightedRanking = RankingService.calculateWeightedRanking;
    this.exportData = RankingService.exportData;
    this.loadSamplePreset = RankingService.loadSamplePreset;

    this.importPreset = function() {
        RankingService.importPreset(this.presetToImport);
        this.presetToImport = "";
    };

    this.colorizeForRank = function(object) {
        const weight = _.floor(object.weightedRank);
        const maxWeight = RankingService.objects.length;
        const percentage = weight / maxWeight;
        return ColorService.colorize('000000', '00CC00', percentage, ColorService.CURVE_EASE_IN_QUAD);
    };
}