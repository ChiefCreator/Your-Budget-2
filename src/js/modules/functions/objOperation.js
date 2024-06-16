function objOperation(cost, date, comment, index, objCategory, objAccount, typeS) {
    return {
        title: objCategory.title,
        icon: objCategory.icon,
        bg: objCategory.bg,
        color: objCategory.color,
        cost: (typeS == "expenses") ? -cost : cost,
        date: date,
        comment: comment,
        index: index,
        type: objCategory.type,
        account: objAccount.title,
        accountIndex: objAccount.index,
    }
}

export default objOperation;