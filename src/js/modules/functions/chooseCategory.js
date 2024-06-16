import setIndex from "./setIndex";

function chooseCategory(category, objCategory, type, indexName) {
    let actCategory = document.querySelector(`.done-category_act`);

    if (actCategory && actCategory != category) {
        actCategory.classList.remove(`done-category_act`);
    }
    category.classList.toggle(`done-category_act`);
    
    objCategory.title = JSON.parse(category.dataset.categoryDone).title
    objCategory.icon = JSON.parse(category.dataset.categoryDone).icon
    objCategory.cost = JSON.parse(category.dataset.categoryDone).cost
    objCategory.bg = JSON.parse(category.dataset.categoryDone).bg
    objCategory.color = JSON.parse(category.dataset.categoryDone).color
    objCategory.type = type
    objCategory.index = setIndex(indexName)
}

export default chooseCategory;