function CategoryRankingHelperController(RankingService) {
    this.canCondense = RankingService.canCondense;
    this.canRedistribute = RankingService.canRedistribute;
    this.canClamp = RankingService.canClamp;
    this.condenseForCategory = RankingService.condenseForCategory;
    this.redistributeForCategory = RankingService.redistributeForCategory;
    this.clampForCategory = RankingService.clampForCategory;
}