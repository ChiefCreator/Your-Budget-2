import setDots from "../setDots";

function setOperationToList(arr, blockToPasteHtmlName, isPart, noDataToggle) {
    if (noDataToggle) noDataToggle()

    let blockToPaste = document.querySelector(`.${blockToPasteHtmlName}`);

    blockToPaste.querySelectorAll(`.${blockToPasteHtmlName}__wrapper`).forEach(block => {
        block.remove()
    })

    for (let i = 0;i < arr.length;i++) {
        let block = `<div class="${blockToPasteHtmlName}__wrapper" data-dat-wrapper="all${arr[i].date}">
        <p class="${blockToPasteHtmlName}__wrapper-date">${arr[i].date}</p>
        <div class="${blockToPasteHtmlName}__wrapper-content" data-dat="all${arr[i].date}"></div>
        </div>`;

        let itemCategory = `<div class="operation operation_${arr[i].type} expand-operation expand-operation_${arr[i].type}" data-index="${arr[i].index}">
        <header class="operation__head">
            <div class="operation__icon ${arr[i].icon}" style="background-color: ${arr[i].bg}"></div>
            <div class="operation__name element-name-wrapper">
                <h4 class="operation__title element-name">${arr[i].title}</h4>
            </div>
            <div class="operation__info">
                <div class="operation__cost operation__cost_${arr[i].type}">
                    <p class="operation__total"><span class="operation__total-sign"></span> <span class="operation__total-num">${Math.abs(arr[i].cost)}</span> <span class="operation__totla-currency">BYN</span></p>
                    <span class="operation__arrow operation__arrow_${arr[i].type}"></span>
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
        function parserBlockToPaste(block) {
            var parser = new DOMParser();
            let teg = parser.parseFromString(block, 'text/html');
            let item = teg.querySelector(`.${blockToPasteHtmlName}__wrapper`);
            return item;
        }

        if (isPart) {
            pasteThreeOperations();
            setDots()
        } else {
            pasteAllOperations()
            setDots()
        }

        function pasteThreeOperations() {
            blockToPaste.append(parserBlockToPaste(block));
            document.querySelector(`[data-dat="all${arr[i].date}"]`).prepend(parser(itemCategory));

            if (document.querySelectorAll(`[data-dat="all${arr[i].date}"]`).length > 1) {
                document.querySelectorAll(`[data-dat-wrapper="all${arr[i].date}"]`)[document.querySelectorAll(`[data-dat-wrapper="all${arr[i].date}"]`).length - 1].remove()
            }

            if (arr.length < 6) {
                return
            } 
            else {
                blockToPaste.querySelectorAll(".operation").forEach((operation, index) => {
                    if (index > 4) operation.remove()
                })
                blockToPaste.querySelectorAll(`.${blockToPasteHtmlName}__wrapper`).forEach((block) => {
                    if (block.querySelector(`.${blockToPasteHtmlName}__wrapper-content`).children.length == 0) {
                        block.remove()
                    }
                })
            }
        }
        function pasteAllOperations() {
            blockToPaste.append(parserBlockToPaste(block));
            document.querySelector(`[data-dat="all${arr[i].date}"]`).prepend(parser(itemCategory));
    
            if (document.querySelectorAll(`[data-dat="all${arr[i].date}"]`).length > 1) {
                document.querySelectorAll(`[data-dat-wrapper="all${arr[i].date}"]`)[document.querySelectorAll(`[data-dat-wrapper="all${arr[i].date}"]`).length - 1].remove()
            }
        }
    }
}

export default setOperationToList;