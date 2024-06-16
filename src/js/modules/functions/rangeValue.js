function rangeValue(inputFrom, inputTo, rangeTeg, num){
    var instance = $(rangeTeg).data("ionRangeSlider");
    inputFrom.addEventListener("input", function() {
        var valFrom = inputFrom.value
        instance.update({from: valFrom - num});
    })
    inputTo.addEventListener("input", function() {
        var valTo = inputTo.value
        instance.update({to: valTo - num});
    })
}

export default rangeValue;