function ColorServiceFactory() {
    const ColorService = {
        colorize: function(colorAsMinValue, colorAsMaxValue, percentage, curveFunction) {
            const ratio = curveFunction(percentage, 0, 1);

            const r = Math.ceil(parseInt(colorAsMinValue.substring(0, 2), 16) * ratio + parseInt(colorAsMaxValue.substring(0, 2), 16) * (1 - ratio));
            const g = Math.ceil(parseInt(colorAsMinValue.substring(2, 4), 16) * ratio + parseInt(colorAsMaxValue.substring(2, 4), 16) * (1 - ratio));
            const b = Math.ceil(parseInt(colorAsMinValue.substring(4, 6), 16) * ratio + parseInt(colorAsMaxValue.substring(4, 6), 16) * (1 - ratio));

            return "#" + asPaddedCSSHex(r) + asPaddedCSSHex(g) + asPaddedCSSHex(b);

            function asPaddedCSSHex(valueBase10) {
                return padForCSS(valueBase10.toString(16));
            }

            function padForCSS(rgbComponent) {
                return ((rgbComponent.length === 1) ? '0' : '') + rgbComponent;
            }
        },
        CURVE_EASE_IN_QUAD: function(percentComplete, startValue, endValue) {
            return startValue + endValue * percentComplete * percentComplete;
        }
    };
    return ColorService;
}