function ApplicationController(RankingService, ColorService) {
    this.objects = RankingService.objects;
    this.categories = RankingService.categories;
    this.ranking = RankingService.ranking;
    this.presetToImport = "";

    this.exportData = RankingService.exportData;
    this.loadSamplePreset = RankingService.loadSamplePreset;

    this.importPreset = function() {
        RankingService.importPreset(this.presetToImport);
        this.presetToImport = "";
    };
}