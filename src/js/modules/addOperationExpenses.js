import firebaseConfig from "./firebaseConfig";

function addOperationExpenses() {
    let popupOperation = document.querySelector(".popup-operation_expenses");
    let overblock = document.querySelector(".overblock");
    let btnCreate = popupOperation.querySelector(".popup-operation__button");
    let inputCost = popupOperation.querySelector(".popup-operation__input");
    let inputDate = popupOperation.querySelector("#date-operation-expenses");
    let textarreaComment = popupOperation.querySelector(".popup-operation__textarrea");
    let closeBtn = popupOperation.querySelector(".popup-operation__close");
    let more = document.querySelector(".operation-list__more_expenses");

    let arr = [];

    let collectionName = localStorage.getItem("email") + "OperationsExpenses";

    getDataFromFirestore();
    

    window.addEventListener("click", function(e) {
        if (e.target.closest(".list-categories_expenses .list-categories__item")) {
            document.querySelectorAll(".list-categories_expenses .list-categories__item").forEach(cat => {
                cat.classList.remove("act");
            })

            let category = e.target.closest(".list-categories_expenses .list-categories__item");
            category.classList.add("act");

            addPopup();

            addCategoryToPopup(category);
        }
    })

    btnCreate.addEventListener("click", function() {
        let category = document.querySelector(".list-categories__item.act")

        let cost = +inputCost.value;
        let date = inputDate.value;
        let comment = textarreaComment.value;
        let index = setIndexToOperation("expenses");
        let obj = objOperation(cost, date, comment, index, JSON.parse(category.dataset.options));

        arr.push(obj);
        setOperationToList(sortByDate(arr));
        addToFirestore(obj);
    })

    overblock.addEventListener("click", function() {
        closePopup();
    })

    closeBtn.addEventListener("click", function() {
        closePopup();
    })

    function addPopup() {
        popupOperation.classList.add("popup-operation_open");
        overblock.classList.add("overblock_open");
    }

    function closePopup() {
        popupOperation.classList.remove("popup-operation_open");
        overblock.classList.remove("overblock_open");

        inputCost.value = "";
    }

    function addCategoryToPopup(category) {
        let obj = JSON.parse(category.dataset.options);

        document.querySelectorAll(".popup-operation__body .item-category").forEach(category => {
            category.style.display = "none";
        })

        let blockToPaste = document.querySelector(".list-categories");
                      
        let itemCategory = `<div class="item-category item-category_expenses">
        <div class="item-category__head">
            <div class="item-category__icon ${obj.icon}" style="background-color: ${obj.bg}"></div>
            <div class="item-category__info">
                <p class="item-category__name">${obj.title}</p>
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
    }

    function setIndexToOperation(indexName) {
        let indexCode = 0;
        if (localStorage.getItem("indexCode")) {
            indexCode = JSON.parse(localStorage.getItem("indexCode"))
            indexCode++;
        }
        localStorage.setItem("indexCode", JSON.stringify(indexCode))

        return indexName + indexCode;
    }

    function objOperation(cost, date, comment, index, obj) {
        return {
            title: obj.title,
            icon: obj.icon,
            bg: obj.bg,
            color: obj.color,
            cost: cost,
            date: date,
            comment: comment,
            index: index,
        }
    }

    function setOperationToList(arr) {
        let blockToPaste = document.querySelector(".operation-list__item_expenses");

        blockToPaste.querySelectorAll(".operation-list__wrapper").forEach(block => {
            block.remove()
        })

        for (let i = 0;i < arr.length;i++) {
            let block = `<div class="operation-list__wrapper wrapper-operation" data-dat-wrapper="expenses${arr[i].date}">
            <p class="wrapper-operation__date">${arr[i].date}</p>
            <div class="wrapper-operation__wrapper-content" data-dat="expenses${arr[i].date}"></div>
            </div>`;

            let itemCategory = "";
            if (arr[i].comment) {
                itemCategory = `<div class="list-category__item item-category item-category_expenses expand-operation" data-index="${arr[i].index}">
            <div class="item-category__head">
                <div class="item-category__icon ${arr[i].icon}" style="background-color:${arr[i].bg}"></div>
                <div class="item-category__info">
                    <p class="item-category__name">${arr[i].title}</p>
                </div>
                <div class="item-category__total">${arr[i].cost} BYN</div>
            </div>
            <div class="item-category__footer">
                <div class="item-category__footer-content">
                    <div class="item-category__comment-wrapper">
                        <div class="item-category__comment-icon"></div>
                        <p class="item-category__comment">${arr[i].comment}</p>
                    </div>
                    <div class="item-category__buttons">
                        <button class="item-category__button item-category__button_change">Изменить</button>
                        <button class="item-category__button item-category__button_delete">Удалить</button>
                    </div>
                </div>
            </div>
                </div>`;
            } else {
                itemCategory = `<div class="list-category__item item-category item-category_expenses expand-operation" data-index="${arr[i].index}">
                <div class="item-category__head">
                    <div class="item-category__icon ${arr[i].icon}" style="background-color:${arr[i].bg}"></div>
                    <div class="item-category__info">
                        <p class="item-category__name">${arr[i].title}</p>
                    </div>
                    <div class="item-category__total">${arr[i].cost} BYN</div>
                </div>
                <div class="item-category__footer">
                    <div class="item-category__footer-content">
                        <div class="item-category__buttons">
                            <button class="item-category__button item-category__button_change">Изменить</button>
                            <button class="item-category__button item-category__button_delete">Удалить</button>
                        </div>
                    </div>
                </div>
                    </div>`;
            }
                        
            function parser(itemCategory) {
                var parser = new DOMParser();
                let teg = parser.parseFromString(itemCategory, 'text/html');
                let item = teg.querySelector(".item-category");
                return item;
            }
            function parserBlockToPaste(block) {
                var parser = new DOMParser();
                let teg = parser.parseFromString(block, 'text/html');
                let item = teg.querySelector(".wrapper-operation");
                return item;
            }

            if (more.classList.contains("open")) {
                pasteAllOperations();
            } else {
                pasteThreeOperations();
            }
            function pasteThreeOperations() {
                blockToPaste.append(parserBlockToPaste(block));
                document.querySelector(`[data-dat="expenses${arr[i].date}"]`).prepend(parser(itemCategory));

                if (document.querySelectorAll(`[data-dat="expenses${arr[i].date}"]`).length > 1) {
                    document.querySelectorAll(`[data-dat-wrapper="expenses${arr[i].date}"]`)[document.querySelectorAll(`[data-dat-wrapper="expenses${arr[i].date}"]`).length - 1].remove()
                }

                if (arr.length < 4) {
                    more.classList.remove("operation-list__more_act")
                } 
                else {
                    blockToPaste.querySelectorAll(".item-category").forEach((operation, index) => {
                        if (index > 2) operation.remove()
                    })
                    blockToPaste.querySelectorAll(".list-operation__wrapper").forEach((block) => {
                        if (block.querySelector(".list-operation__wrapper-content").children.length == 0) {
                            block.remove()
                        }
                    })

                    more.classList.add("operation-list__more_act")
                }
            }
            function pasteAllOperations() {
                blockToPaste.append(parserBlockToPaste(block));
                document.querySelector(`[data-dat="expenses${arr[i].date}"]`).prepend(parser(itemCategory));

                if (document.querySelectorAll(`[data-dat="expenses${arr[i].date}"]`).length > 1) {
                    document.querySelectorAll(`[data-dat-wrapper="expenses${arr[i].date}"]`)[document.querySelectorAll(`[data-dat-wrapper="expenses${arr[i].date}"]`).length - 1].remove()
                }
            }
        }
    }

    function addToFirestore(obj) {
        console.log(obj)
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}?key=${firebaseConfig.apiKey}`;
        
        const data = {
            fields: toObject(obj)
        };

        fetch(firestoreUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
          console.log('Category added:', data);
        })
        .catch(error => {
          console.error('Error adding category:', error);
        });

        function toObject(obj) {
            return {
                title: {stringValue: obj.title},
                icon: {stringValue: obj.icon},
                index: {stringValue: obj.index},
                cost: {integerValue: obj.cost},
                bg: {stringValue: obj.bg},
                color: {stringValue: obj.color},
                comment: {stringValue: obj.comment},
                date: {stringValue: obj.date},
            };
        }
    }

    function getDataFromFirestore() {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}?key=${firebaseConfig.apiKey}`;
    
        fetch(firestoreUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data from Firestore');
                }
                return response.json();
            })
            .then(data => {
                if (Object.keys(data).length != 0) {
                    arr = transformToArrayFromDatabase(data);
                    setOperationToList(sortByDate(arr))
                }
            })
            .catch(error => {
                console.error('Error fetching data from Firestore:', error);
            });
    }

    function transformToArrayFromDatabase(data) {
        const transformedArray = data.documents.map(doc => {
            const {title, icon, index, cost, bg, color, date, comment} = doc.fields;
            return {
                title: title.stringValue,
                icon: icon.stringValue,
                index: index ? parseInt(index.integerValue) : null,
                cost: parseInt(cost.integerValue),
                bg: bg ? bg.stringValue : null,
                color: color ? color.stringValue : null,
                date: date.stringValue,
                comment: comment ? comment.stringValue : null,
            };
        });

        return transformedArray
    }

    function sortByDate(arr) {
        return arr.map(obj => ({
            ...obj,
            date: obj.date.split('.').reverse().join('-')
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

export default addOperationExpenses;
