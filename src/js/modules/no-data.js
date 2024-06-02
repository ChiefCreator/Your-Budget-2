function noDataToggle(arr, noDataBlock, video, hideElements) {
    console.log(arr)
    if (arr.length == 0) {
        if (hideElements.length > 0) {
            hideElements.forEach(element => {
                element.classList.add("hide")
            });
        }
        noDataBlock.classList.add("no-data_act");
        video.load();
        return;
    } else {
        if (hideElements.length > 0) {
            hideElements.forEach(element => {
                element.classList.remove("hide")
            });
        }
        noDataBlock.classList.remove("no-data_act");
    }
}

export default noDataToggle;