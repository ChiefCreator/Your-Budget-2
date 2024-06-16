import setDots from "../setDots";

function setItemToListFromDatabase(arr, typeS) {
    let blockToPaste = document.querySelector(`.list-categories_${typeS}`);
    for (let i = 0;i < arr.length;i++) {
        let itemCategory = `<div class="list-categories__item item-category item-category_${typeS}" data-index="${arr[i].index}" data-options='{"index": ${arr[i].index}, "title": "${arr[i].title}", "cost": ${arr[i].cost}, "icon": "${arr[i].icon}", "bg": "${arr[i].bg}", "color": "${arr[i].color}"}'>
        <div class="item-category__head">
            <div class="item-category__icon ${arr[i].icon}" style="background-color:${arr[i].bg}"></div>
            <div class="item-category__info element-name-wrapper">
                <p class="item-category__name element-name">${arr[i].title}</p>
            </div>
            <div class="item-category__total">${arr[i].cost} BYN</div>
        </div>
            </div>`;
    function parser(itemCategory) {
        var parser = new DOMParser();
        let teg = parser.parseFromString(itemCategory, 'text/html');
        let item = teg.querySelector(".item-category");
        return item;
    }
    blockToPaste.append(parser(itemCategory))
    }

    setDots();
}

export default setItemToListFromDatabase;