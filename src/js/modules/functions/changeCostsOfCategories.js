function changeCostsOfCategories(arr, typeS) {
    let total = 0;

    document.querySelectorAll(`.list-categories_${typeS} .list-categories__item`).forEach((category, i) => {
        if (arr[i]) {
            total += Math.abs(arr[i].cost);

            category.querySelector(".item-category__total").textContent = Math.abs(arr[i].cost) + " BYN";
        }
    })
    document.querySelector(`.slider-categories__item_${typeS} .slider-categories__total-num`).textContent = total;
}

export default changeCostsOfCategories;