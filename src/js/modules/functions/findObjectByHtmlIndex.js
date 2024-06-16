function findObjectByHtmlIndex(htmlItem, arr) {
    let index = htmlItem.dataset.index;
    let modifiedObj = {}; 

    for (let obj of arr) {
        if (obj.index == index) {
            modifiedObj = Object.assign({}, obj);
        }
    }

    return modifiedObj;
}

export default findObjectByHtmlIndex;