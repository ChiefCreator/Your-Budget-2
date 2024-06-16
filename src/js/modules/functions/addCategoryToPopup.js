import setDots from "../setDots";

function addCategoryToPopup(obj, typeS, popupClass) {
    document.querySelectorAll(`.${popupClass}__body .item-category`).forEach(category => {
        category.style.display = "none";
    })

    let blockToPaste = document.querySelector(`.${popupClass} .list-categories`);
                  
    let itemCategory = `<div class="item-category item-category_${typeS}">
    <div class="item-category__head">
        <div class="item-category__icon ${obj.icon}" style="background-color: ${obj.bg}"></div>
        <div class="item-category__info element-name-wrapper">
            <p class="item-category__name element-name">${obj.title}</p>
        </div>
        <div class="item-category__total">${obj.cost} BYN</div>
    </div>
        </div>`;
            
    function parser(itemCategory) {
        var parser = new DOMParser();
        let teg = parser.parseFromString(itemCategory, 'text/html');
        let item = teg.querySelector(".item-category");
        return item;
    }

    blockToPaste.append(parser(itemCategory));
    setDots();
}

export default addCategoryToPopup;