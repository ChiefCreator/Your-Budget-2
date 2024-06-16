function setOperationsToAccounts(operationsAll, accounts) {
    for (let account of accounts) {
        let filterOperationsAll = operationsAll.filter(obj => obj.account == account.title)
        account.operations = filterOperationsAll;
        account.cost = sumCosts(filterOperationsAll)
    }
    return accounts;

    function sumCosts(arr) {
        let sum = 0;
        for  (let obj of arr) {
            sum += obj.cost;
        }
        return sum;
    }
}

export default setOperationsToAccounts;