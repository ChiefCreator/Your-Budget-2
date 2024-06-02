function noDataToggle(arr, noDataBlock, video, hideElements, cost) {
    console.log(cost)
    if (cost != null && cost == 0) {
        console.log("dd")
        if (hideElements.length > 0) {
            hideElements.forEach(element => {
                element.classList.add("hide")
            });
        }
        noDataBlock.classList.add("no-data_act");
        video.load();
        return;
    }
    else if (arr.length == 0) {
        if (hideElements.length > 0) {
            hideElements.forEach(element => {
                element.classList.add("hide")
            });
        }
        noDataBlock.classList.add("no-data_act");
        video.load();
        return;
    } else {
        console.log("kk")
        if (hideElements.length > 0) {
            hideElements.forEach(element => {
                element.classList.remove("hide")
            });
        }
        noDataBlock.classList.remove("no-data_act");
    }
}

export default noDataToggle;