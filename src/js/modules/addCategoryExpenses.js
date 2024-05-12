import firebaseConfig from "./firebaseConfig";
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import changeChart from "./changeChartExpensesAndIncome";
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

function addCategoryExpenses(chartExpensesPie, chartIncomePie, chart, series, xAxis) {
    // expenses переменные
    let categoryExpenses = {};
    let categoriesExpenses = [];
    let operationsExpenses = [];
    let operationsExpensesByCurrentDate = [];
    let categoriesExpensesByCurrentDate = [];

    let btnAddDoneCategoriesExpenses = document.querySelector(".add-expenses");
    let popupDoneCategoriesExpenses = document.querySelector(".popup-category-done_expenses");

    let popupOperationExpenses = document.querySelector(".popup-operation_expenses");
    let btnCreateopupOperationExpenses = popupOperationExpenses.querySelector(".popup-operation__button");
    let inputCostExpenses = popupOperationExpenses.querySelector(".input-cost__input");
    let inputDateExpenses = popupOperationExpenses.querySelector(".input-date__input");
    let textarreaCommentExpenses = popupOperationExpenses.querySelector(".textarrea__input");
    let closeBtnPopupOperationExpenses = popupOperationExpenses.querySelector(".popup-operation__close");
    let moreExpenses = document.querySelector(".operation-list__more_expenses");
    let moreExpensesText = moreExpenses.querySelector(".tool-operation__item-text");

    const swiper = new Swiper('.swiper_categories-expenses', {
        speed: 600,
        spaceBetween: 0,
        pagination: {
            el: '.pagination_done-expenses',
            type: 'bullets',
            clickable: true,
        },
    })
    const swiperAcoounts = new Swiper('.swiper-accounts-operations-expenses', {
        speed: 600,
        spaceBetween: 15,
        slidesPerView: 1,
        loop: true,
    })

    // income переменные 
    let categoryIncome = {};
    let categoriesIncome = [];
    let operationsIncome = [];
    let operationsIncomeByCurrentDate = [];
    let categoriesIncomeByCurrentDate = [];

    let btnAddDoneCategoriesIncome = document.querySelector(".add-income");
    let popupDoneCategoriesIncome = document.querySelector(".popup-category-done_income");

    let popupOperationIncome = document.querySelector(".popup-operation_income");
    let btnCreateopupOperationIncome = popupOperationIncome.querySelector(".popup-operation__button");
    let inputCostIncome = popupOperationIncome.querySelector(".input-cost__input");
    let inputDateIncome = popupOperationIncome.querySelector(".input-date__input");
    let textarreaCommentIncome = popupOperationIncome.querySelector(".textarrea__input");
    let closeBtnPopupOperationIncome = popupOperationIncome.querySelector(".popup-operation__close");
    let moreIncome = document.querySelector(".operation-list__more_income");
    let moreIncomeText = moreIncome.querySelector(".tool-operation__item-text");
    
    // общие 
    let indexCategory = 0;
    let index = 0;
    let overblock = document.querySelector(".overblock");
    let switchButton = document.querySelector(".switch-operations");
    let userEmail = localStorage.getItem("email").replace(".", "*");

    let allOperationsByCurrentDate = [];
    let allCategoriesByCurrentDate = [];
    let accountArr = [];
    let chartsArr = [];

    Promise.all([getDataFromFirestore("categoriesExpenses"), getDataFromFirestore("categoriesExpensesByDate"),getDataFromFirestore("categoriesIncome"), getDataFromFirestore("categoriesIncomeByDate"),  getDataFromFirestore("operationsExpenses"), getDataFromFirestore("operationsExpensesByDate"), getDataFromFirestore("operationsIncome"), getDataFromFirestore("operationsIncomeByDate"), getDataFromFirestore("accounts")])
        .then(response => {
            return Promise.all([response[0].json(), response[1].json(), response[2].json(), response[3].json(), response[4].json(), response[5].json(),response[6].json(), response[7].json(), response[8].json()]);
        })
        .then(data => {
            categoriesExpenses = (data[0] != null) ? data[0] : [];
            categoriesExpensesByCurrentDate = (data[1] != null) ? data[1] : [];
            categoriesIncome = (data[2] != null) ? data[2] : [];
            categoriesIncomeByCurrentDate = (data[3] != null) ? data[3] : [];

            operationsExpenses = (data[4] != null) ? data[4] : [];
            operationsExpensesByCurrentDate = (data[5] != null) ? data[5] : [];
            operationsIncome = (data[6] != null) ? data[6] : [];
            operationsIncomeByCurrentDate = (data[7] != null) ? data[7] : [];
            accountArr = (data[8] != null) ? data[8] : [];
            
            allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);
            allCategoriesByCurrentDate = categoriesExpensesByCurrentDate.concat(categoriesIncomeByCurrentDate);

            setItemToListFromDatabase(categoriesExpensesByCurrentDate, "expenses");
            chart(categoriesExpensesByCurrentDate, chartExpensesPie);
            changeCostsOfCategories(categoriesExpensesByCurrentDate, "expenses");

            setItemToListFromDatabase(categoriesIncomeByCurrentDate, "income");
            chart(categoriesIncomeByCurrentDate, chartIncomePie);
            changeCostsOfCategories(categoriesIncomeByCurrentDate, "income");

            setOperationToList(sortByDate(allOperationsByCurrentDate), moreExpenses, "expenses");
            changeChart(allOperationsByCurrentDate, chart, series, xAxis);

            setAccountsToList(accountArr, "swiper-accounts-operations-expenses")
            console.log(accountArr)
        })

    togglePopup(btnAddDoneCategoriesExpenses, popupDoneCategoriesExpenses);
    togglePopup(btnAddDoneCategoriesIncome, popupDoneCategoriesIncome);

    // добавление категорий

    window.addEventListener("click", (event) => addCategory(event, categoryExpenses, categoriesExpenses, operationsExpenses, categoriesExpensesByCurrentDate, operationsExpensesByCurrentDate, chartExpensesPie, "expenses", "Expenses", "expensesCategory"));
    window.addEventListener("click", (event) => addCategory(event, categoryIncome, categoriesIncome, operationsIncome, categoriesIncomeByCurrentDate, operationsIncomeByCurrentDate, chartIncomePie, "income", "Income", "incomeCategory"));

    function addCategory(event, objCategory, categories,operations, categoriesByCurrentDate, operationsByCurrentDate, chartPie, typeS, typeXL, indexName) {
        let category = event.target.closest(`.done-${typeS}`);

        if (event.target.closest(`.done-${typeS}`)) {
            chooseCategory(category, objCategory, typeS, indexName)
        }
        if (event.target.closest(`.popup-category-done_${typeS} .popup-category-done__button`)) {
            categories.push(Object.assign({}, objCategory));

            for (let obj of operationsByCurrentDate) {
                operationsByCurrentDate.pop()
            }
            operationsByCurrentDate = Object.assign(operationsByCurrentDate, sortArrayByCurrentDate(operations));

            categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateOperation(categories, operationsByCurrentDate));

            addToFirestore(categories, `categories${typeXL}`);
            addToFirestore(updateOperation(categoriesByCurrentDate, operationsByCurrentDate), `categories${typeXL}ByDate`);

            setItemToList(objCategory, typeS);
            chart(categoriesByCurrentDate, chartPie);
            changeCostsOfCategories(categoriesByCurrentDate, typeS)
        }
    }

    function chooseCategory(category, objCategory, type, indexName) {
        let actCategory = document.querySelector(`.done-${type}_act`);

        if (actCategory && actCategory != category) {
            actCategory.classList.remove(`done-${type}_act`);
        }
        category.classList.toggle(`done-${type}_act`);
        
        objCategory.title = JSON.parse(category.dataset.categoryDone).title
        objCategory.icon = JSON.parse(category.dataset.categoryDone).icon
        objCategory.cost = JSON.parse(category.dataset.categoryDone).cost
        objCategory.bg = JSON.parse(category.dataset.categoryDone).bg
        objCategory.color = JSON.parse(category.dataset.categoryDone).color
        objCategory.type = type
        objCategory.index = setIndex(indexName)

    }
    
    function setItemToList(objCategory, typeS) {
        let blockToPaste = document.querySelector(`.list-categories_${typeS}`);
        let itemCategory = `<div class="list-categories__item item-category item-category_${typeS}" data-index="${objCategory.index}" data-options='{"index": ${objCategory.index}, "title": "${objCategory.title}", "cost": ${objCategory.cost}, "icon": "${objCategory.icon}", "bg": "${objCategory.bg}", "color": "${objCategory.color}"}'>
        <div class="item-category__head">
            <div class="item-category__icon ${objCategory.icon}" style="background-color:${objCategory.bg}"></div>
            <div class="item-category__info">
                <p class="item-category__name">${objCategory.title}</p>
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
    }

    function togglePopup(btn, popup) {
        let overblock = document.querySelector(".overblock");

        btn.addEventListener("click", function() {
            popup.classList.add("popup-category-done_open");
            overblock.classList.add("overblock_open");
        })

        overblock.addEventListener("click", function() {
            popup.classList.remove("popup-category-done_open");
            overblock.classList.remove("overblock_open");
        })
    }

    function chart(arr, chart) {
        let titles = [];
        let bgArr = [];
        let costArr = [];

        arr.forEach(item => {
            titles.push(item.title);
            bgArr.push(item.bg);

            if (item.cost == 0) {
                costArr.push(1);
            } else {
                costArr.push(item.cost);
            }
        })

        chart.data.labels = titles;
        chart.data.datasets[0].data = costArr;
        chart.data.datasets[0].backgroundColor = bgArr;
        chart.update();
    }

    function addToFirestore(arr, collection) {
        const firestoreUrl = `https://database-fc7b1-default-rtdb.europe-west1.firebasedatabase.app/users/${userEmail}/${collection}.json`;

        fetch(firestoreUrl, {
            method: 'PUT',
            body: JSON.stringify(arr),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        // .then(data => {
        //   console.log('Category added:', data);
        // })
        .catch(error => {
          console.error('Error adding category:', error);
        });
    }

    function getDataFromFirestore(collection) {
        const firestoreUrl = `https://database-fc7b1-default-rtdb.europe-west1.firebasedatabase.app/users/${userEmail}/${collection}.json`;
    
        return fetch(firestoreUrl)
    }

    function setItemToListFromDatabase(arr, typeS) {
        let blockToPaste = document.querySelector(`.list-categories_${typeS}`);
        for (let i = 0;i < arr.length;i++) {
            let itemCategory = `<div class="list-categories__item item-category item-category_${typeS}" data-index="${arr[i].index}" data-options='{"index": ${arr[i].index}, "title": "${arr[i].title}", "cost": ${arr[i].cost}, "icon": "${arr[i].icon}", "bg": "${arr[i].bg}", "color": "${arr[i].color}"}'>
            <div class="item-category__head">
                <div class="item-category__icon ${arr[i].icon}" style="background-color:${arr[i].bg}"></div>
                <div class="item-category__info">
                    <p class="item-category__name">${arr[i].title}</p>
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
    }

    function changeCostsOfCategories(arr, typeS) {
        let total = 0;

        document.querySelectorAll(`.list-categories_${typeS} .list-categories__item`).forEach((category, i) => {
            if (arr[i]) {
                total += arr[i].cost;

                category.querySelector(".item-category__total").textContent = arr[i].cost + " BYN";
            }
        })
        document.querySelector(`.slider-categories__item_${typeS} .slider-categories__total-num`).textContent = total;
    }

    // создание операций

    window.addEventListener("click", (event) => addCategoryToPopupOperation(event, "expenses", popupOperationExpenses, categoriesExpensesByCurrentDate));
    window.addEventListener("click", (event) => addCategoryToPopupOperation(event, "income", popupOperationIncome, categoriesIncomeByCurrentDate))

    btnCreateopupOperationExpenses.addEventListener("click", () => createOperation(inputCostExpenses, inputDateExpenses, textarreaCommentExpenses, "expenses", "Expenses", operationsExpenses, operationsExpensesByCurrentDate, categoriesExpenses, categoriesExpensesByCurrentDate, chartExpensesPie, accountArr))
    btnCreateopupOperationIncome.addEventListener("click", () => createOperation(inputCostIncome, inputDateIncome, textarreaCommentIncome, "income", "Income", operationsIncome, operationsIncomeByCurrentDate, categoriesIncome, categoriesIncomeByCurrentDate, chartIncomePie, accountArr))

    function addCategoryToPopupOperation(event, typeS, popup, operationsByCurrentDate) {
        if (event.target.closest(`.list-categories_${typeS} .list-categories__item`)) {
            document.querySelectorAll(`.list-categories_${typeS} .list-categories__item`).forEach(cat => {
                cat.classList.remove("act");
            })

            let category = event.target.closest(`.list-categories_${typeS} .list-categories__item`);
            category.classList.add("act");

            let findObjOperation = findObjectByHtmlIndex(category, operationsByCurrentDate);

            addPopup(popup);

            addCategoryToPopup(findObjOperation, typeS, "popup-operation");
        }
    }

    window.addEventListener("click", (event) => chooseAccount(event))
    function chooseAccount(event) {
        if (event.target.closest(".swiper-accounts-operations-expenses .account-choose")) {
            let account = event.target.closest(".swiper-accounts-operations-expenses .account-choose");
            let actAccount = document.querySelector(`.account-choose_act`);
            if (actAccount && actAccount != account) {
                actAccount.classList.remove(`account-choose_act`);
            }
            account.classList.toggle("account-choose_act")
        }
    }

    function createOperation(inputCost, inputDate, inputComment, typeS, typeXL, operations, operationsByCurrentDate, categories, categoriesByCurrentDate, chartPie, accountArr) {
        let category = document.querySelector(`.list-categories__item.item-category_${typeS}.act`);
        let account = document.querySelector(`.account-choose_act`);

        let cost = +inputCost.value;
        let date = inputDate.value;
        let comment = inputComment.value;
        let index = setIndex(typeS);
        let findObjOperation = findObjectByHtmlIndex(category, categoriesByCurrentDate);
        let findObjAccount = findObjectByHtmlIndex(account, accountArr);
        let obj = objOperation(cost, date, comment, index, findObjOperation, findObjAccount);

        operations.push(Object.assign({}, obj));
        for (let obj of operationsByCurrentDate) {
            operationsByCurrentDate.pop()
        }
        operationsByCurrentDate = Object.assign(operationsByCurrentDate, sortArrayByCurrentDate(operations));

        categories = Object.assign(categories, updateOperation(categories, operations));
        categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateOperation(categoriesByCurrentDate, operationsByCurrentDate));

        allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);

        addToFirestore(categories, `categories${typeXL}`);
        addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`);

        chart(categoriesByCurrentDate, chartPie);
        changeCostsOfCategories(categoriesByCurrentDate, typeS);

        addToFirestore(operations, `operations${typeXL}`);
        addToFirestore(operationsByCurrentDate, `operations${typeXL}ByDate`);

        setOperationToList(sortByDate(allOperationsByCurrentDate), moreExpenses, typeS);
        changeChart(sortByDate(allOperationsByCurrentDate), chart, series, xAxis);

        addToFirestore(setOperationsToAccounts(operationsExpenses.concat(operationsIncome), accountArr), `accounts`);

        if (operationsByCurrentDate == operationsExpensesByCurrentDate) {
            switchButton.querySelector(".switch-operations__input").checked = false;
        } else {
            switchButton.querySelector(".switch-operations__input").checked = true;
        }
    }

    overblock.addEventListener("click", function() {
        closePopup(popupOperationExpenses, inputCostExpenses);
        closePopup(popupOperationIncome, inputCostIncome);
    })

    closeBtnPopupOperationExpenses.addEventListener("click", function() {
        closePopup(popupOperationExpenses, inputCostExpenses);
    })

    function addPopup(popup) {
        popup.classList.add("popup-operation_open");
        overblock.classList.add("overblock_open");
    }

    function closePopup(popup, inputCost) {
        popup.classList.remove("popup-operation_open");
        overblock.classList.remove("overblock_open");

        inputCost.value = "";
    }

    function addCategoryToPopup(obj, typeS, popupClass) {
        document.querySelectorAll(`.${popupClass}__body .item-category`).forEach(category => {
            category.style.display = "none";
        })

        let blockToPaste = document.querySelector(`.${popupClass}_${typeS} .list-categories`);
        console.log(blockToPaste)
                      
        let itemCategory = `<div class="item-category item-category_${typeS}">
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

    function setIndex(indexName) {
        let indexCode = 0;
        if (localStorage.getItem("indexCode")) {
            indexCode = JSON.parse(localStorage.getItem("indexCode"))
            indexCode++;
        }
        localStorage.setItem("indexCode", JSON.stringify(indexCode))

        return indexName + indexCode;
    }

    function findObjectByHtmlIndex(htmlItem, arr) {
        let index = htmlItem.dataset.index;
        let modifiedObj = {}; 

        for (let obj of arr) {
            if (obj.index == index) {
                modifiedObj = Object.assign({}, obj);
            }
        }

        return modifiedObj;
    }

    function objOperation(cost, date, comment, index, objCategory, objAccount) {
        return {
            title: objCategory.title,
            icon: objCategory.icon,
            bg: objCategory.bg,
            color: objCategory.color,
            cost: cost,
            date: date,
            comment: comment,
            index: index,
            type: objCategory.type,
            account: objAccount.title,
        }
    }

    function setOperationToList(arr, more, typeS) {
        let blockToPaste = document.querySelector(`.operation-list__item`);

        blockToPaste.querySelectorAll(".operation-list__wrapper").forEach(block => {
            block.remove()
        })

        for (let i = 0;i < arr.length;i++) {
            let block = `<div class="operation-list__wrapper wrapper-operation" data-dat-wrapper="all${arr[i].date}">
            <p class="wrapper-operation__date">${arr[i].date}</p>
            <div class="wrapper-operation__wrapper-content" data-dat="all${arr[i].date}"></div>
            </div>`;

            let itemCategory = "";
            if (arr[i].comment) {
                itemCategory = `<div class="list-category__item item-category item-category_${arr[i].type} expand-operation" data-index="${arr[i].index}">
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
                itemCategory = `<div class="list-category__item item-category item-category_${arr[i].type} expand-operation" data-index="${arr[i].index}">
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

            pasteThreeOperations();
         

            function pasteThreeOperations() {
                blockToPaste.append(parserBlockToPaste(block));
                document.querySelector(`[data-dat="all${arr[i].date}"]`).prepend(parser(itemCategory));

                if (document.querySelectorAll(`[data-dat="all${arr[i].date}"]`).length > 1) {
                    document.querySelectorAll(`[data-dat-wrapper="all${arr[i].date}"]`)[document.querySelectorAll(`[data-dat-wrapper="all${arr[i].date}"]`).length - 1].remove()
                }

                if (arr.length < 5) {
                    more.classList.remove("operation-list__more_act")
                } 
                else {
                    blockToPaste.querySelectorAll(".item-category").forEach((operation, index) => {
                        if (index > 3) operation.remove()
                    })
                    blockToPaste.querySelectorAll(".wrapper-operation").forEach((block) => {
                        if (block.querySelector(".wrapper-operation__wrapper-content").children.length == 0) {
                            block.remove()
                        }
                    })

                    more.classList.add("operation-list__more_act")
                }
            }
        }
    }

    switchButton.addEventListener("click", function() {
        if (switchButton.querySelector(".switch-operations__input").checked == false) {
            changeChart(sortByDate(operationsExpensesByCurrentDate))
        } else {
            changeChart(sortByDate(operationsIncomeByCurrentDate))
        }
    })

    function updateOperation(categories, operations) {

        categories.forEach(category => {
            const matchingCategories = operations.filter(operation => operation.title === category.title);
            
            if (matchingCategories.length > 0) {
                const totalCost = matchingCategories.reduce((acc, curr) => acc + curr.cost, 0);
                category.cost = totalCost;
            } else {
                category.cost = 0;
            }
          });
          
        return categories
    }

    function sortByDate(arr) {
        return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    function setAccountsToList(arr, blockToPasteClassName) {
        let blockToPaste = document.querySelector(`.${blockToPasteClassName} .swiper-wrapper`);
    
        blockToPaste.querySelectorAll(".swiper-slide").forEach(block => {
            block.remove()
        })
    
        for (let i = 0; i < arr.length; i++) {
            let itemCategory = `<div class="swiper-slide">
            <div class="account account-choose" style="background-color: ${arr[i].bg};" data-index="${arr[i].index}">
                <header class="account__header">
                    <span class="account__icon account__${arr[i].icon}" style="background-color: ${arr[i].iconBg};"></span>
                    <div class="account__names">
                        <h3 class="account__title">${arr[i].title}</h3>
                        <p class="account__type">${arr[i].type}</p>
                    </div>
                </header>
                <div class="account__body">
                    <div class="account__content">
                        <p class="account__total"><span class="account__num">${arr[i].cost}</span> <span class="account__currency">BYN</span></p>
                    </div>
                    <div class="account__chart">
                        <div class="account__chart-item" id="${arr[i].chartId}"></div>
                    </div>
                </div>
                </div>
            </div>`;
    
            function parser(itemCategory) {
                var parser = new DOMParser();
                let teg = parser.parseFromString(itemCategory, 'text/html');
                let item = teg.querySelector(".swiper-slide");
                return item;
            }
            blockToPaste.append(parser(itemCategory))
            initChart(arr[i].chartId)
        }
    }
    
    function initChart(chartId) {
    var root = am5.Root.new(chartId);   
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      paddingLeft: 0
    }));
      chart.get("colors").set("colors", [
        am5.color(15723498),
    ]);
    var xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 30,
        minorGridEnabled: true,
    });
    var yRenderer = am5xy.AxisRendererY.new(root, {
        minGridDistance: 30,
        minorGridEnabled: true,
    });
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 1,
        categoryField: "date",
        renderer: xRenderer,
        visible: false,
    }));
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: yRenderer,
        visible: false,
    }));
    xRenderer.grid.template.setAll({
        visible: false
    })
    yRenderer.grid.template.setAll({
        visible: false
    })
    var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "cost",
        categoryXField: "date",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueX} {valueY}"
        }),
        stroke: "white",
    }));
    series.fills.template.setAll({
        visible: true,
        fillOpacity: 0.2,
        fill: "#FFFFFF"
    });
    series.bullets.push(function () {
        return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Circle.new(root, {
                radius: 2,
                fill: "white"
            })
        });
    });
    let data = [{
        date: "1",
        cost: 1,
      }, {
        date: "2",
        cost: 4,
      }, {
        date: "3",
        cost: 3,
    }, {
        date: "4",
        cost: 7,
    }, {
        date: "5",
        cost: 2,
    }, {
        date: "6",
        cost: 9,
    }, {
        date: "7",
        cost: 14,
    }, {
        date: "8",
        cost: 10,
    }, {
        date: "9",
        cost: 17,
    }, {
        date: "10",
        cost: 13,
    }];
    xAxis.data.setAll(data);
    series.data.setAll(data);
    series.appear(1000);
    chart.appear(1000, 100);

    chartsArr.push({root, xRenderer, yRenderer, xAxis, yAxis, series, data})
    }

    function setOperationsToAccounts(operationsAll, accounts) {
        for (let account of accounts) {
            let filterOperationsAll = operationsAll.filter(obj => obj.account == account.title)
            account.operations = filterOperationsAll;
            account.cost = sumCosts(filterOperationsAll)
        }
        return accounts;
    }

    function sumCosts(arr) {
        let sum = 0;
        for  (let obj of arr) {
            sum += obj.cost;
        }
        return sum;
    }

    // больше меньше операций

    moreExpenses.addEventListener("click", () => addOperations(moreExpenses, moreExpensesText, "expenses", operationsExpensesByCurrentDate));
    moreIncome.addEventListener("click", () => addOperations(moreIncome, moreIncomeText, "income", operationsIncomeByCurrentDate));

    function addOperations(more, moreText, typeS, operationsByCurrentDate) {

        if (!more.classList.contains("open")) {
            moreText.textContent = "Свернуть операции";
            more.classList.add("open");
        } else {
            moreText.textContent = "Все операции";
            more.classList.remove("open");
        }

        setOperationToList(sortByDate(operationsByCurrentDate), more, typeS);
    }

    // создание категории

    // переменные expenses
    let popupCategoryExpenses = document.querySelector(".popup-category");
    let createBtnsExpenses = document.querySelectorAll(".create-expenses");

    let objCategoryExpenses = {};
    let inpTitleExpenses = popupCategoryExpenses.querySelector(".popup-category__input");
    let inpBgExpenses = popupCategoryExpenses.querySelector(".input-color__input_bg");
    let wrapperInpBgExpenses = inpBgExpenses.parentElement;
    let inpColorExpenses = popupCategoryExpenses.querySelector(".input-color__input_color");
    let wrapperInpColorExpenses = inpColorExpenses.parentElement;
    let iconsExpenses = popupCategoryExpenses.querySelectorAll(".popup-category__icon");
    let buttonCreateExpenses = popupCategoryExpenses.querySelector(".popup-category__button");

    // переменные income
    let popupCategoryIncome = document.querySelector(".popup-category_income");
    let createBtnsIncome = document.querySelectorAll(".create-income");

    let objCategoryIncome = {};
    let inpTitleIncome = popupCategoryIncome.querySelector(".popup-category__input");
    let inpBgIncome = popupCategoryIncome.querySelector(".input-color__input_bg");
    let wrapperInpBgIncome = inpBgIncome.parentElement;
    let inpColorIncome = popupCategoryIncome.querySelector(".input-color__input_color");
    let wrapperInpColorIncome = inpColorIncome.parentElement;
    let iconsIncome = popupCategoryIncome.querySelectorAll(".popup-category__icon");
    let buttonCreateIncome = popupCategoryIncome.querySelector(".popup-category__button");

    createBtnsExpenses.forEach(addBtn => {
        addBtn.addEventListener("click", function() {
            popupCategoryExpenses.classList.add("popup-category_open");
            overblock.classList.add("overblock_open");
        })
    })
    createBtnsIncome.forEach(addBtn => {
        addBtn.addEventListener("click", function() {
            popupCategoryIncome.classList.add("popup-category_open");
            overblock.classList.add("overblock_open");
        })
    })
    overblock.addEventListener("click", function() {
        popupCategoryExpenses.classList.remove("popup-category_open");
        popupCategoryIncome.classList.remove("popup-category_open");
        overblock.classList.remove("overblock_open");
    })

    changeColor(iconsExpenses, inpBgExpenses, inpColorExpenses, wrapperInpBgExpenses, wrapperInpColorExpenses, objCategoryExpenses);
    changeColor(iconsIncome, inpBgIncome, inpColorIncome, wrapperInpBgIncome, wrapperInpColorIncome, objCategoryIncome);

    buttonCreateExpenses.addEventListener("click", () => createCategory(objCategoryExpenses, categoriesExpenses, categoriesExpensesByCurrentDate, operationsExpensesByCurrentDate, chartExpensesPie, popupCategoryExpenses, inpTitleExpenses, inpBgExpenses, inpColorExpenses, "expenses", "Expenses"));
    buttonCreateIncome.addEventListener("click", () => createCategory(objCategoryIncome, categoriesIncome, categoriesIncomeByCurrentDate, operationsIncomeByCurrentDate, chartIncomePie, popupCategoryIncome, inpTitleIncome, inpBgIncome, inpColorIncome, "income", "Income"));

    function createCategory(objCategory, categories, categoriesByCurrentDate, operationsByCurrentDate, chartPie, popupCategory, inpTitle, inpBg, inpColor, typeS, typeXL) {
        setValueToObject(objCategory, index, inpTitle, inpBg, inpColor, typeS);

        if (validation(objCategory)) {
            index++;

            categories.push(Object.assign({}, objCategory))
            categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateOperation(categories, operationsByCurrentDate));

            addToFirestore(categories, `categories${typeXL}`);
            addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`);

            setItemToList(objCategory, typeS);
            chart(categoriesByCurrentDate, chartPie);

            popupCategory.classList.remove("popup-category_open");
            overblock.classList.remove("overblock_open");
        }
    }

    function setValueToObject(obj, index, inpTitle, inpBg, inpColor, typeS) {
        obj.index = index;
        obj.title = inpTitle.value;
        obj.bg = inpBg.value;
        obj.color = inpColor.value;
        obj.cost = 0;
        obj.type = typeS;
        return obj;
    }

    function validation(objCategory) {
        let isError = true;
        if (objCategory.title == "") {
            isError = false;
        }
        if (!objCategory.icon) {
            isError = false;
        }
        console.log(isError)
        return isError;
    }

    function changeColor(icons, inpBg, inpColor, wrapperInpBg, wrapperInpColor, objCategory) {

        icons.forEach(icon => {
            icon.style.backgroundColor = inpBg.value;
            icon.style.color = inpColor.value; 
    
            wrapperInpBg.style.backgroundColor = inpBg.value;
            wrapperInpColor.style.backgroundColor = inpColor.value; 
        })

        window.addEventListener("click", function(event) {
            let icon = event.target.closest(".popup-category__icon");

            if (event.target.closest(".popup-category__icon")) {
                document.querySelectorAll(".popup-category__icon").forEach(icon => {
                    icon.style.backgroundColor = "#A2A6B4";
                    icon.style.color = "white"; 
                    icon.classList.remove("act");
                })

                icon.classList.add("act");
                icon.style.backgroundColor = changeColor(inpBg, inpColor, icon)[0]; 
                icon.style.color = changeColor(inpBg, inpColor, icon)[1]; 
                objCategory.icon = icon.dataset.categoryIcon;
            } else if (!event.target.closest(".popup-category__block-wrapper") && !event.target.closest(".popup-category__icon")) {
                document.querySelectorAll(".popup-category__icon").forEach(icon => {
                    icon.style.backgroundColor = "#A2A6B4";
                    icon.style.color = "white"; 
                    icon.classList.remove("act");
                })
            }
        })

        function changeColor(inpBg, inpColor, icon) {
            let bg = inpBg.value;
            let color = inpColor.value;
            inpBg.addEventListener("input", function() {
                bg = inpBg.value;
    
                if (icon.classList.contains("act")) {
                    icon.style.backgroundColor = bg;
                }
            })
            inpColor.addEventListener("input", function() {
                color = inpColor.value;
    
                if (icon.classList.contains("act")) {
                    icon.style.color = color;
                }
            })
            return [bg, color]
        }
    
        wrapperInpColor.style.border = `2px solid #eef0f4`;
        wrapperInpBg.style.border = `2px solid ${inpBg.value}`;
    
        function changeBgOFInputs() {
            inpBg.addEventListener("input", function() {
                wrapperInpBg.style.backgroundColor = inpBg.value;
    
                if (inpBg.value == "#ffffff") {
                    wrapperInpBg.style.border = `2px solid #eef0f4`;
                } else {
                    wrapperInpBg.style.border = `2px solid ${inpBg.value}`;
                }
            })
    
            inpColor.addEventListener("input", function() {
                wrapperInpColor.style.backgroundColor = inpColor.value;
            
                if (inpColor.value == "#ffffff") {
                    wrapperInpColor.style.border = `2px solid #eef0f4`;
                } else {
                    wrapperInpColor.style.border = `2px solid ${inpColor.value}`;
                }
            
            })
        }
        changeBgOFInputs();
    }

    // календарь

    let dateText = document.querySelector(".main-date__value");
    let currentDate = new Date().getFullYear() + "-" + ("0" + (+(new Date()).getMonth() + 1)).slice(-2);

    if (!localStorage.getItem("currentDate")) {
        localStorage.setItem("currentDate", currentDate); 
    }
    dateText.textContent = transformDate(localStorage.getItem("currentDate"))

    let buttonYear = {
        content: 'Выбрать год',
        className: 'custom-button-classname',
        onClick: (dp) => {
            if (dp.currentView == "years") {
                buttonYear.content = 'Выбрать год'
                dp.update({
                    view : "months",
                    minView : "months",
                    dateFormat: 'yyyy-MM',
                })
            } else if (dp.currentView == "months") {
                buttonYear.content = 'Выбрать месяц'
                dp.update({
                    view : "years",
                    minView : "years",
                    dateFormat: 'yyyy',
                })
            }
        }
    }
    let buttonAll = {
        content: 'Все время',
        className: 'custom-button-classname',
        onClick: (dp) => {
            dateText.textContent = "Все время";
            localStorage.setItem("currentDate", "Все время");
        }
    }
    let mainDatePickerSettings = {
        inline: false,
        position:'left top',
        view: "months",
        minView:"months",
        dateFormat: 'yyyy-MM',
        buttons: [buttonYear, buttonAll],
        onSelect: ({date, formattedDate, datepicker}) => {
            let mounth = transformDate(formattedDate)
        
            if (datepicker.currentView == "months") {
                if (date) {
                    dateText.textContent = mounth;  
                } else {
                    dateText.textContent = "Выберите дату";  
                }
            } else {
                if (date) {
                    dateText.textContent = formattedDate;  
                } else {
                    dateText.textContent = "Выберите дату";  
                }
            }

            localStorage.setItem("currentDate", formattedDate);   
            changeMainDate(operationsIncomeByCurrentDate, categoriesIncomeByCurrentDate, operationsIncome, categoriesIncome, chartIncomePie, moreIncome, "income", "Income");
            changeMainDate(operationsExpensesByCurrentDate, categoriesExpensesByCurrentDate, operationsExpenses, categoriesExpenses, chartExpensesPie, moreExpenses, "expenses", "Expenses");       
        },
    }
    let mainDatePicker = new AirDatepicker('#main-picker', mainDatePickerSettings)


    function changeMainDate(operationsByCurrentDate, categoriesByCurrentDate, operations, categories, chartPie, more, typeS, typeXL) {
        for (let i = 0;i < operationsByCurrentDate.length;i++) {
            for (let k = 0;k < operationsByCurrentDate.length;k++) {
                operationsByCurrentDate.pop()
            }
            operationsByCurrentDate.pop()
        }
    
        operationsByCurrentDate = Object.assign(operationsByCurrentDate, sortArrayByCurrentDate(operations))
        categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateOperation(categories, operationsByCurrentDate))

        allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);

        addToFirestore(operationsByCurrentDate, `operations${typeXL}ByDate`)
        addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`)
        chart(categoriesByCurrentDate, chartPie);
        changeCostsOfCategories(categoriesByCurrentDate, typeS)

        setOperationToList(sortByDate(allOperationsByCurrentDate), more, typeS);
        changeChart(sortByDate(allOperationsByCurrentDate), chart, series, xAxis);

        if (operationsByCurrentDate == operationsExpensesByCurrentDate) {
            switchButton.querySelector(".switch-operations__input").checked = false;
        } else {
            switchButton.querySelector(".switch-operations__input").checked = true;
        }
    }
    
    function transformDate(date) {
        if (date) {
            if (date == "Все время") {
                return date;
            }
            if (date.length == 7) {
                return new Date(date).toLocaleString('default', { month: 'long' }) + " " + new Date(date).getFullYear();
            } 
            else if (date.length == 4) {
                return date
            }
        } else {
            return new Date().toLocaleString('default', { month: 'long' }) + " " + new Date().getFullYear();
        }
    }

    function sortArrayByCurrentDate(arr) {
        function filterExpensesByMonth(arr, yearMonth) {
            const [year, month] = yearMonth.split('-');
            return arr.filter(expense => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getFullYear() === parseInt(year) && expenseDate.getMonth() + 1 === parseInt(month);
            });
        }
    
        console.log(filterExpensesByMonth(arr, localStorage.getItem("currentDate")), "filtered")
        return filterExpensesByMonth(arr, localStorage.getItem("currentDate"));
    
    }

    // удаление операций

    window.addEventListener("click", (event) => deleteOperation(event, "expenses", "Expenses", operationsExpenses, operationsExpensesByCurrentDate, moreExpenses, categoriesExpenses, categoriesExpensesByCurrentDate, chartExpensesPie))
    window.addEventListener("click", (event) => deleteOperation(event, "income", "Income", operationsIncome, operationsIncomeByCurrentDate, moreIncome, categoriesIncome, categoriesIncomeByCurrentDate, chartIncomePie))

    function deleteOperation(event, typeS, typeXL, operations, operationsByCurrentDate, more, categories, categoriesByCurrentDate, chartPie) {
        if (event.target.closest(`.item-category_${typeS} .item-category__button_delete`)) {
            let deleteBtn = event.target.closest(`.item-category_${typeS} .item-category__button_delete`);
            let operation = deleteBtn.closest(".item-category");
   
            sortOperations(operation, operations);
            sortOperations(operation, operationsByCurrentDate);

            categories = Object.assign(categories, updateOperation(categories, operations));
            categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateOperation(categoriesByCurrentDate, operationsByCurrentDate));

            allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);

            addToFirestore(operations, `operations${typeXL}`);
            addToFirestore(operationsByCurrentDate, `operations${typeXL}ByDate`);
            addToFirestore(categories, `operations${typeXL}`);
            addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`);
    
            setOperationToList(sortByDate(allOperationsByCurrentDate), more, typeS);

            chart(categoriesByCurrentDate, chartPie);
            changeCostsOfCategories(categoriesByCurrentDate, typeS);

            changeChart(sortByDate(allOperationsByCurrentDate), chart, series, xAxis);
        }
    }

    function sortOperations(operation, operations) {
        let temp = operations.filter(item => item.index != operation.dataset.index);
        operations.forEach(item => operations.pop())
        operations = Object.assign(operations, temp);
    }

    // изменение операций
    let popupChangeOperationExpenses = document.querySelector(".popup-change-operation_expenses");
    let popupChangeOperationIncome = document.querySelector(".popup-change-operation_income");

    window.addEventListener("click", (event) => changeOperations(event, popupChangeOperationExpenses, "expenses", "Expenses", operationsExpenses, operationsExpensesByCurrentDate, categoriesExpenses, categoriesExpensesByCurrentDate, chartExpensesPie, moreExpenses))
    window.addEventListener("click", (event) => changeOperations(event, popupChangeOperationIncome, "income", "Income", operationsIncome, operationsIncomeByCurrentDate, categoriesIncome, categoriesIncomeByCurrentDate, chartIncomePie, moreIncome))
  

    overblock.addEventListener("click", function() {
        popupChangeOperationExpenses.classList.remove("popup-change-operation_open");
        popupChangeOperationExpenses.classList.remove("popup-change-operation_open");
        popupChangeOperationIncome.classList.remove("popup-change-operation_open");
        popupChangeOperationIncome.classList.remove("popup-change-operation_open");
        overblock.classList.remove("overblock_open");
    })

    function changeOperations(event, popupChangeOperation, typeS, typeXL, operations, operationsByCurrentDate, categories, categoriesByCurrentDate, chartPie, more) {
        if (event.target.closest(`.item-category_${typeS} .item-category__button_change`)) {
            let button = event.target.closest(`.item-category_${typeS} .item-category__button_change`);
            let operation = button.closest(".expand-operation");  
            operation.classList.add("expand-operation_act");
            
            let findObjOperation = findObjectByHtmlIndex(operation, operationsByCurrentDate);
            setDataFromInput(findObjOperation, typeS);
            addCategoryToPopup(findObjOperation, typeS, `popup-change-operation`);

            console.log(operation, operationsByCurrentDate)
           
            popupChangeOperation.classList.add("popup-change-operation_open");
            overblock.classList.add("overblock_open");
        }

        if (event.target.closest(`.popup-change-operation_${typeS} .popup-change-operation__button`)) {
            let operation = document.querySelector(".expand-operation_act");
            
            let findObjOperation = findObjectByHtmlIndex(operation, operationsByCurrentDate);
            let inpCost = document.querySelector(`.popup-change-operation_${typeS} .input-cost__input`);
            let inpComm = document.querySelector(`.popup-change-operation_${typeS} .textarrea__input`);
            let inpDate = document.querySelector(`.popup-change-operation_${typeS} .input-date__input`);
            findObjOperation.cost = +inpCost.value;
            findObjOperation.comment = inpComm.value;
            findObjOperation.date = inpDate.value;

            for (let obj of operationsByCurrentDate) {
                if (findObjOperation.index == obj.index) {
                    obj.cost = findObjOperation.cost;
                    obj.comment = findObjOperation.comment;
                    obj.date = findObjOperation.date;
                }
            }
            for (let obj of operations) {
                if (findObjOperation.index == obj.index) {
                    obj.cost = findObjOperation.cost;
                    obj.comment = findObjOperation.comment;
                    obj.date = findObjOperation.date;
                }
            }
    
            categories = Object.assign(categories, updateOperation(categories, operations));
            categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateOperation(categoriesByCurrentDate, operationsByCurrentDate));

            allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);

            addToFirestore(operations, `operations${typeXL}`)
            addToFirestore(operationsByCurrentDate, `operations${typeXL}ByDate`)
            addToFirestore(categories, `categories${typeXL}`)
            addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`)

            chart(categoriesByCurrentDate, chartPie)
            changeCostsOfCategories(categoriesByCurrentDate, typeS)
            setOperationToList(sortByDate(allOperationsByCurrentDate), more, typeS)
            changeChart(sortByDate(allOperationsByCurrentDate), chart, series, xAxis);

            operation.classList.remove("expand-operation_act");

            if (operationsByCurrentDate == operationsExpensesByCurrentDate) {
                switchButton.querySelector(".switch-operations__input").checked = false;
            } else {
                switchButton.querySelector(".switch-operations__input").checked = true;
            }
        }
    }

    function setDataFromInput(modifiedObj, typeS) {
        let inpCost = document.querySelector(`.popup-change-operation_${typeS} .input-cost__input`);
        let inpComm = document.querySelector(`.popup-change-operation_${typeS} .textarrea__input`);
        let inpDate = document.querySelector(`.popup-change-operation_${typeS} .input-date__input`);

        inpCost.value = modifiedObj.cost;
        inpComm.value = modifiedObj.comment;
        inpDate.value = modifiedObj.date;
    }
}

export default addCategoryExpenses;