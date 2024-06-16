function absCostInArr(arr) {
    let newArr = []
    for (let obj of arr) {
        newArr.push({...obj, cost: Math.abs(obj.cost)})
    }

    return newArr;
}

export default absCostInArr;