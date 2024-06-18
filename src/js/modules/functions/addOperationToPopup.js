import setDots from "../setDots";

function addOperationToPopup(obj, popupClass) {
    document.querySelectorAll(`.${popupClass}__body .operation`).forEach(category => {
        category.remove()
    })

    let blockToPaste = document.querySelector(`.${popupClass} .list-categories`);

        let itemCategory = `<div class="operation operation_${obj.type}" data-index="${obj.index}">
        <header class="operation__head">
            <div class="operation__icon ${obj.icon}" style="background-color: ${obj.bg}"></div>
            <div class="operation__name element-name-wrapper">
                <h4 class="operation__title element-name">${obj.title}</h4>
            </div>
            <div class="operation__info">
                <div class="operation__cost operation__cost_${obj.type}">
                    <p class="operation__total"><span class="operation__total-sign"></span> <span class="operation__total-num">${Math.abs(obj.cost)}</span> <span class="operation__totla-currency">BYN</span></p>
                    <span class="operation__arrow operation__arrow_${obj.type}"></span>
                </div>
            </div>
        </header>
    </div>`
            
    function parser(itemCategory) {
        var parser = new DOMParser();
        let teg = parser.parseFromString(itemCategory, 'text/html');
        let item = teg.querySelector(".operation");
        return item;
    }

    blockToPaste.append(parser(itemCategory));
    setDots();
}

export default addOperationToPopup;