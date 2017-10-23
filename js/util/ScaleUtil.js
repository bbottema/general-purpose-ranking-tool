function ScaleUtilFactory() {
    const ScaleUtil = {
        translateToScale: function(valueScaleA, minScaleA, maxScaleA, minScaleB, maxScaleB) {
            const percentage = (valueScaleA - minScaleA) / (maxScaleA - minScaleA);
            return minScaleB + percentage * (maxScaleB - minScaleB);
        }
    };
    return ScaleUtil;
}