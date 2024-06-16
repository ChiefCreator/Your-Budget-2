function getMaxCost(arr) {
    return Math.max(...arr.reduce((acc, obj) => {
        acc.push(Math.abs(obj.cost))
        return acc;
    }, []))
}

export default getMaxCost;