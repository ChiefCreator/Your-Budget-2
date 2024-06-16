import setDots from "../setDots";

function setItemToList(objCategory, typeS) {
    let blockToPaste = document.querySelector(`.list-categories_${typeS}`);
    let itemCategory = `<div class="list-categories__item item-category item-category_${typeS}" data-index="${objCategory.index}" data-options='{"index": ${objCategory.index}, "title": "${objCategory.title}", "cost": ${objCategory.cost}, "icon": "${objCategory.icon}", "bg": "${objCategory.bg}", "color": "${objCategory.color}"}'>
    <div class="item-category__head">
        <div class="item-category__icon ${objCategory.icon}" style="background-color:${objCategory.bg}"></div>
        <div class="item-category__info element-name-wrapper">
            <p class="item-category__name element-name">${objCategory.title}</p>
        </div>
        <div class="item-category__total">${objCategory.cost} BYN</div>
    </div>
        </div>`;

    function parser(itemCategory) {
        var parser = new DOMParser();
        let teg = parser.parseFromString(itemCategory, 'text/html');
        let item = teg.querySelector(".item-category");
        return item;
    }
    blockToPaste.append(parser(itemCategory))
    setDots()
}

export default setItemToList;