import firebaseConfig from "./firebaseConfig";
import changeChart from "./changeChartExpensesAndIncome";

function addOperationincome(chartIncomePie) {
    let popupOperation = document.querySelector(".popup-operation_income");
    let overblock = document.querySelector(".overblock");
    let btnCreate = popupOperation.querySelector(".popup-operation__button");
    let inputCost = popupOperation.querySelector(".popup-operation__input");
    let inputDate = popupOperation.querySelector("#date-operation-income");
    let textarreaComment = popupOperation.querySelector(".popup-operation__textarrea");
    let closeBtn = popupOperation.querySelector(".popup-operation__close");
    let more = document.querySelector(".operation-list__more_income");
    let moreText = more.querySelector(".tool-operation__item-text");
    let switchButton = document.querySelector(".switch-operations");

    let arr = [];

    let userEmail = localStorage.getItem("email").replace(".", "*");

    getDataFromFirestore();
    

    window.addEventListener("click", function(e) {
        if (e.target.closest(".list-categories_income .list-categories__item")) {
            document.querySelectorAll(".list-categories_income .list-categories__item").forEach(cat => {
                cat.classList.remove("act");
            })

            let category = e.target.closest(".list-categories_income .list-categories__item");
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
        let index = setIndexToOperation("income");
        let obj = objOperation(cost, date, comment, index, JSON.parse(category.dataset.options));

        arr.push(obj);
        setOperationToList(sortByDate(arr));
        addToChartPie(arr);
        changeChart(sortByDate(arr));
        addToFirestore(arr);
        changeCostsOfCategories(updateOperation(arr));
        addToFirestoreCategories(updateOperation(arr));

        switchButton.querySelector(".switch-operations__input").checked = !switchButton.querySelector(".switch-operations__input").checked;
    })

    more.addEventListener("click", addOperations);

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

        let blockToPaste = document.querySelector(".popup-operation_income .list-categories");
                      
        let itemCategory = `<div class="item-category item-category_income">
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
        let blockToPaste = document.querySelector(".operation-list__item_income");

        blockToPaste.querySelectorAll(".operation-list__wrapper").forEach(block => {
            block.remove()
        })

        for (let i = 0;i < arr.length;i++) {
            let block = `<div class="operation-list__wrapper wrapper-operation" data-dat-wrapper="income${arr[i].date}">
            <p class="wrapper-operation__date">${arr[i].date}</p>
            <div class="wrapper-operation__wrapper-content" data-dat="income${arr[i].date}"></div>
            </div>`;

            let itemCategory = "";
            if (arr[i].comment) {
                itemCategory = `<div class="list-category__item item-category item-category_income expand-operation" data-index="${arr[i].index}">
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
                itemCategory = `<div class="list-category__item item-category item-category_income expand-operation" data-index="${arr[i].index}">
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
                document.querySelector(`[data-dat="income${arr[i].date}"]`).prepend(parser(itemCategory));

                if (document.querySelectorAll(`[data-dat="income${arr[i].date}"]`).length > 1) {
                    document.querySelectorAll(`[data-dat-wrapper="income${arr[i].date}"]`)[document.querySelectorAll(`[data-dat-wrapper="income${arr[i].date}"]`).length - 1].remove()
                }

                if (arr.length < 4) {
                    more.classList.remove("operation-list__more_act")
                } 
                else {
                    blockToPaste.querySelectorAll(".item-category").forEach((operation, index) => {
                        if (index > 2) operation.remove()
                    })
                    blockToPaste.querySelectorAll(".wrapper-operation").forEach((block) => {
                        if (block.querySelector(".wrapper-operation__wrapper-content").children.length == 0) {
                            block.remove()
                        }
                    })

                    more.classList.add("operation-list__more_act")
                }
            }
            function pasteAllOperations() {
                blockToPaste.append(parserBlockToPaste(block));
                document.querySelector(`[data-dat="income${arr[i].date}"]`).prepend(parser(itemCategory));

                if (document.querySelectorAll(`[data-dat="income${arr[i].date}"]`).length > 1) {
                    document.querySelectorAll(`[data-dat-wrapper="income${arr[i].date}"]`)[document.querySelectorAll(`[data-dat-wrapper="income${arr[i].date}"]`).length - 1].remove()
                }
            }
        }
    }

    function addToFirestore(arr) {
        const firestoreUrl = `https://database-fc7b1-default-rtdb.europe-west1.firebasedatabase.app/users/${userEmail}/operationsIncome.json`;
        
        fetch(firestoreUrl, {
            method: 'PUT',
            body: JSON.stringify(arr),
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
    }

    function getDataFromFirestore() {
        const firestoreUrl = `https://database-fc7b1-default-rtdb.europe-west1.firebasedatabase.app/users/${userEmail}/operationsIncome.json`;
    
        fetch(firestoreUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data from Firestore');
                }
                return response.json();
            })
            .then(data => {
                if (Object.keys(data).length != 0) {
                    arr = data;
                    setOperationToList(sortByDate(arr));
                    addToChartPie(arr);
                }
            })
            .catch(error => {
                console.error('Error fetching data from Firestore:', error);
            });
    }

    function addToFirestoreCategories(arr) {
        const firestoreUrl = `https://database-fc7b1-default-rtdb.europe-west1.firebasedatabase.app/users/${userEmail}/categoriesIncome.json`;
        
        fetch(firestoreUrl, {
            method: 'PUT',
            body: JSON.stringify(arr),
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
    }

    function sortByDate(arr) {
        return arr.map(obj => ({
            ...obj,
            date: obj.date.split('.').reverse().join('-')
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function addToChartPie(arr) {
        let objCosts = {};
        for (let obj of arr) {
            if (!objCosts[obj.title]) {
                objCosts[obj.title] = obj.cost;
            } else {
                objCosts[obj.title] += obj.cost; 
            }
        }

        let costsArray = Object.values(objCosts);

        chartIncomePie.data.datasets[0].data = costsArray;
        chartIncomePie.update();
    }

    function updateOperation(arr) {
        const groupedByTitle = arr.reduce((acc, obj) => {
            const existingObj = acc.find(item => item.title === obj.title);
            if (existingObj) {
                existingObj.cost += obj.cost;
            } else {
                acc.push({ ...obj });
            }
            return acc;
        }, []);
        
        let indexCounter = 1;
        
        const newArray = groupedByTitle.map((obj) => {
            const { date, comment, ...rest } = obj;
            return { ...rest, index: indexCounter++ };
        });
        
        console.log(newArray);

        return newArray;
    }

    switchButton.addEventListener("click", function() {
        if (switchButton.querySelector(".switch-operations__input").checked == true) {
            changeChart(sortByDate(arr))
        }
    })

    function addOperations() {

        if (!more.classList.contains("open")) {
            moreText.textContent = "Свернуть операции";
            more.classList.add("open");
        } else {
            moreText.textContent = "Все операции";
            more.classList.remove("open");
        }

        setOperationToList(sortByDate(arr));
    }

    function changeCostsOfCategories(arr) {
        let total = 0;

        document.querySelectorAll(".list-categories_income .list-categories__item").forEach((category, i) => {
            if (arr[i]) {
                total += arr[i].cost;

                category.querySelector(".item-category__total").textContent = arr[i].cost + " BYN";
            }
        })
        document.querySelector(".slider-categories__item_income .slider-categories__total-num").textContent = total;
    }
}

export default addOperationincome;
