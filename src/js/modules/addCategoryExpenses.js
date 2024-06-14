import firebaseConfig from "./firebaseConfig";
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import changeChart from "./changeChartExpensesAndIncome";
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import noDataToggle from "./no-data";

function addCategoryExpenses(chartExpensesPie, chartIncomePie, chart, series, xAxis) {
    // expenses переменные
    let categoryExpenses = {};
    let categoriesExpenses = [];
    let operationsExpenses = [];
    let operationsExpensesByCurrentDate = [];
    let categoriesExpensesByCurrentDate = [];

    // переменные expenses
    let popupCategory = document.querySelector(".popup-category");
    let inpTitle = popupCategory.querySelector(".popup-category__input");
    let inpBg = popupCategory.querySelector(".input-color__input_bg");
    let wrapperInpBg = inpBg.parentElement;
    let inpColor = popupCategory.querySelector(".input-color__input_color");
    let wrapperInpColor = inpColor.parentElement;
    let icons = popupCategory.querySelectorAll(".popup-category__icon");
    let btnAddCategoriesExpenses = document.querySelector(".add-expenses");

    let popupOperation = document.querySelector(".popup-operation");
    let btnCreateOperationPopup = popupOperation.querySelector(".popup-operation__button");
    let inputCost = popupOperation.querySelector(".input-cost__input");
    let inputDate = popupOperation.querySelector(".input-date__input");
    let textarreaComment = popupOperation.querySelector(".textarrea__input");
    let closeBtnPopupOperation = popupOperation.querySelector(".popup-operation__close");

    const swiper = new Swiper('.swiper_done-categories', {
        speed: 600,
        spaceBetween: 0,
        pagination: {
            el: '.pagination_done-expenses',
            type: 'bullets',
            clickable: true,
        },
    })
    const swiperAcoounts = new Swiper('.swiper-accounts-operations', {
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

    let btnAddCategoriesIncome = document.querySelector(".add-income");
    
    // общие 
    let switchChart = document.querySelector(".switch-chart");
    let titleChart = document.querySelector(".operation-chart__title");
    let indexCategory = 0;
    let index = 0;
    let overblock = document.querySelector(".overblock");
    let switchButton = document.querySelector(".switch-operations");
    let userEmail = localStorage.getItem("email").replace(".", "*");

    let allOperationsByCurrentDate = [];
    let allCategoriesByCurrentDate = [];
    let accountArr = [];
    let chartsArr = [];

    let progressBarExpenses = document.querySelector(".progress-bar_expenses");
    let progressBarIncome = document.querySelector(".progress-bar_income");

    let circleNum = document.querySelector(".progress-ring-wrapper__num");
    let circle = document.querySelector(".progress-ring__circle");
    let radius = circle.r.baseVal.value;
    let circumference = 2 * Math.PI * radius;         
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    function setProgress(percent) {
        const offset = circumference - percent / 100 * circumference;
        circle.style.strokeDashoffset = offset;
    }
    setProgress(50);

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
            accountArr = (data[8] != null) ? data[8] : [{bg: "rgb(229, 151, 78)", chartId: "chartCash", color: "#ffffff", cost: 0, icon: "icon-money7", iconBg: "rgb(205, 129, 59)", index: "Обычный счет1", title: "Наличные", type: "Обычный счет"}, {bg: "#73b813", chartId: "chartCard", color: "#ffffff", cost: 0, icon: "icon-money6", iconBg: "#5f9c09", index: "Обычный счет2", title: "Карта", type: "Обычный счет"}];
            
            allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);
            allCategoriesByCurrentDate = categoriesExpensesByCurrentDate.concat(categoriesIncomeByCurrentDate);

            setItemToListFromDatabase(categoriesExpensesByCurrentDate, "expenses");
            chart(categoriesExpensesByCurrentDate, chartExpensesPie);
            changeCostsOfCategories(categoriesExpensesByCurrentDate, "expenses");

            setItemToListFromDatabase(categoriesIncomeByCurrentDate, "income");
            chart(categoriesIncomeByCurrentDate, chartIncomePie);
            changeCostsOfCategories(categoriesIncomeByCurrentDate, "income");

            setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), "expenses");
            changeChart(sortByDate(operationsExpensesByCurrentDate, "decrease"), chart, series, xAxis);

            setAccountsToList(accountArr, "swiper-accounts-operations")

            setDataToProgressBar(progressBarExpenses, operationsExpensesByCurrentDate, allOperationsByCurrentDate);
            setDataToProgressBar(progressBarIncome, operationsIncomeByCurrentDate, allOperationsByCurrentDate);
        })

    togglePopup(btnAddCategoriesExpenses, popupCategory);
    togglePopup(btnAddCategoriesIncome, popupCategory);

    // добавление категорий

    window.addEventListener("click", (event) => addCategory(event, categoryExpenses, categoriesExpenses, operationsExpenses, categoriesExpensesByCurrentDate, operationsExpensesByCurrentDate, chartExpensesPie, "expenses", "Expenses", "expensesCategory", popupCategory, inpTitle, inpBg, inpColor));
    window.addEventListener("click", (event) => addCategory(event, categoryIncome, categoriesIncome, operationsIncome, categoriesIncomeByCurrentDate, operationsIncomeByCurrentDate, chartIncomePie, "income", "Income", "incomeCategory", popupCategory, inpTitle, inpBg, inpColor));

    function addCategory(event, objCategory, categories,operations, categoriesByCurrentDate, operationsByCurrentDate, chartPie, typeS, typeXL, indexName, popupCategory, inpTitle, inpBg, inpColor) {
        let category = event.target.closest(`.done-category`);

        if (event.target.closest(`.popup-category_${typeS} .done-category`)) {
            chooseCategory(category, objCategory, typeS, indexName)
        }
        if (event.target.closest(`.popup-category_${typeS} .popup-category-done__button`)) {
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
            changeCostsOfCategories(categoriesByCurrentDate, typeS);

            resetPopupCategory();
        }

        if (event.target.closest(`.popup-category_${typeS} .popup-category__button`)) {
            setValueToObject(objCategory, setIndex(indexName), inpTitle, inpBg, inpColor, typeS, document.querySelector(".popup-category__icon.act").dataset.categoryIcon);

            if (validation(objCategory)) {
                index++;

                categories.push(Object.assign({}, objCategory))
                categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateOperation(categories, operationsByCurrentDate));

                addToFirestore(categories, `categories${typeXL}`);
                addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`);

                setItemToList(objCategory, typeS);
                chart(categoriesByCurrentDate, chartPie);

                resetPopupCategory();
            }
        }
    }

    function resetPopupCategory() {
        popupCategory.classList.remove("popup-category_open");
        overblock.classList.remove("overblock_open");

        if (document.querySelector(".done-category_act")) document.querySelector(".done-category_act").classList.remove(`done-category_act`);

        inpTitle.value = "";
        inpBg.value = "#A2A6B4";
        inpColor.value = "#ffffff";
        wrapperInpColor.style.border = `2px solid #eef0f4`;
        wrapperInpBg.style.border = `2px solid ${inpBg.value}`;
        wrapperInpColor.style.backgroundColor = "#ffffff";
        wrapperInpBg.style.backgroundColor = inpBg.value;

        setProgress(50);
        circleNum.textContent = "01";

        document.querySelectorAll(".popup-category__tab-button").forEach(button => {
            button.classList.remove("popup-category__tab-button_act")
            if (button.dataset.tab == "tab-add-category") button.classList.add("popup-category__tab-button_act")
        })
        document.querySelectorAll(".popup-category__tab").forEach(tab => {
            tab.classList.remove("popup-category__tab_act");
            if (tab.id == "tab-add-category") tab.classList.add("popup-category__tab_act")
        })
    }

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
            if (btn.classList.contains("add-income")) {
                popup.classList.add("popup-category_income")
                popup.classList.remove("popup-category_expenses")
            }
            else if (btn.classList.contains("add-expenses")) {
                popup.classList.add("popup-category_expenses")
                popup.classList.remove("popup-category_income")
            }
            popup.classList.add("popup-category_open");
            overblock.classList.add("overblock_open");
        })

        overblock.addEventListener("click", function() {
            resetPopupCategory();
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
                costArr.push(Math.abs(item.cost));
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
                total += Math.abs(arr[i].cost);

                category.querySelector(".item-category__total").textContent = Math.abs(arr[i].cost) + " BYN";
            }
        })
        document.querySelector(`.slider-categories__item_${typeS} .slider-categories__total-num`).textContent = total;
    }

    // создание операций

    window.addEventListener("click", (event) => addCategoryToPopupOperation(event, "expenses", popupOperation, categoriesExpensesByCurrentDate, btnCreateOperationPopup));
    window.addEventListener("click", (event) => addCategoryToPopupOperation(event, "income", popupOperation, categoriesIncomeByCurrentDate, btnCreateOperationPopup))

    function addCategoryToPopupOperation(event, typeS, popup, operationsByCurrentDate, button) {
        if (event.target.closest(`.list-categories_${typeS} .list-categories__item`)) {
            document.querySelectorAll(`.list-categories_${typeS} .list-categories__item`).forEach(cat => {
                cat.classList.remove("act");
            })

            let category = event.target.closest(`.list-categories_${typeS} .list-categories__item`);
            category.classList.add("act");

            let findObjOperation = findObjectByHtmlIndex(category, operationsByCurrentDate);
            findObjOperation.cost = Math.abs(findObjOperation.cost)

            addPopup(popup);
            addCategoryToPopup(findObjOperation, typeS, "popup-operation");

            button.classList.add(`popup-operation__button_${typeS}`)
        }
    }

    window.addEventListener("click", function(event) {
        if (event.target.closest(`.popup-operation__button_expenses`)) {
            createOperation(inputCost, inputDate, textarreaComment, "expenses", "Expenses", operationsExpenses, operationsExpensesByCurrentDate, categoriesExpenses, categoriesExpensesByCurrentDate, chartExpensesPie, accountArr)
        }
        if (event.target.closest(`.popup-operation__button_income`)) {
            createOperation(inputCost, inputDate, textarreaComment, "income", "Income", operationsIncome, operationsIncomeByCurrentDate, categoriesIncome, categoriesIncomeByCurrentDate, chartIncomePie, accountArr)
        }
    })

    window.addEventListener("click", (event) => chooseAccount(event))
    function chooseAccount(event) {
        if (event.target.closest(".swiper-accounts-operations .account-choose")) {
            let account = event.target.closest(".swiper-accounts-operations .account-choose");
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
        let obj = objOperation(cost, date, comment, index, findObjOperation, findObjAccount, typeS);

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

        setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), typeS);
        changeChart(sortByDate(operationsByCurrentDate, "decrease"), chart, series, xAxis);

        accountArr = setOperationsToAccounts(operationsExpenses.concat(operationsIncome), accountArr);
        setAccountsToList(accountArr, "swiper-accounts-operations")
        swiperAcoounts.update()
        addToFirestore(accountArr, `accounts`);

        setDataToProgressBar(progressBarExpenses, operationsExpensesByCurrentDate, allOperationsByCurrentDate);
        setDataToProgressBar(progressBarIncome, operationsIncomeByCurrentDate, allOperationsByCurrentDate);

        if (operationsByCurrentDate == operationsIncomeByCurrentDate) {
            switchChart.classList.add("switch-chart_act");
            switchChart.querySelector(".switch-chart__input").checked = true;
            titleChart.textContent = "График доходов";
        } else {
            switchChart.classList.remove("switch-chart_act");
            switchChart.querySelector(".switch-chart__input").checked = false;
            titleChart.textContent = "График расходов";
        }
    }

    overblock.addEventListener("click", function() {
        closePopup(popupOperation, inputCost);
        btnCreateOperationPopup.classList.remove(`popup-operation__button_expenses`)
        btnCreateOperationPopup.classList.remove(`popup-operation__button_income`)
    })

    closeBtnPopupOperation.addEventListener("click", function() {
        closePopup(popupOperation, inputCost);
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

        let blockToPaste = document.querySelector(`.${popupClass} .list-categories`);
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

    function objOperation(cost, date, comment, index, objCategory, objAccount, typeS) {
        return {
            title: objCategory.title,
            icon: objCategory.icon,
            bg: objCategory.bg,
            color: objCategory.color,
            cost: (typeS == "expenses") ? -cost : cost,
            date: date,
            comment: comment,
            index: index,
            type: objCategory.type,
            account: objAccount.title,
            accountIndex: objAccount.index,
        }
    }

    function setOperationToList(arr, typeS) {
        noDataToggle(arr, document.querySelector(".no-data-list"), document.querySelector(".no-data-list").querySelector(".no-data__video"), [document.querySelector(".operation-list__header"), document.querySelector(".operation-list__body")])

        let blockToPaste = document.querySelector(`.operation-list__item`);

        blockToPaste.querySelectorAll(".operation-list__wrapper").forEach(block => {
            block.remove()
        })

        for (let i = 0;i < arr.length;i++) {
            let block = `<div class="operation-list__wrapper wrapper-operation" data-dat-wrapper="all${arr[i].date}">
            <p class="wrapper-operation__date">${arr[i].date}</p>
            <div class="wrapper-operation__wrapper-content" data-dat="all${arr[i].date}"></div>
            </div>`;

            let itemCategory = `<div class="operation operation_${arr[i].type} expand-operation expand-operation_${arr[i].type}" data-index="${arr[i].index}">
            <header class="operation__head">
                <div class="operation__icon ${arr[i].icon}" style="background-color: ${arr[i].bg}"></div>
                <div class="operation__name">
                    <h4 class="operation__title">${arr[i].title}</h4>
                </div>
                <div class="operation__info">
                    <div class="operation__cost operation__cost_${arr[i].type}">
                        <p class="operation__total"><span class="operation__total-sign"></span> <span class="operation__total-num">${Math.abs(arr[i].cost)}</span> <span class="operation__totla-currency">BYN</span></p>
                        <span class="operation__arrow operation__arrow_${arr[i].type}"></span>
                    </div>
                    <div class="operation__button-list">
                        <button class="operation__button operation__button_change"></button>
                        <button class="operation__button operation__button_delete"></button>
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

                if (arr.length < 6) {
                    return
                } 
                else {
                    blockToPaste.querySelectorAll(".operation").forEach((operation, index) => {
                        if (index > 4) operation.remove()
                    })
                    blockToPaste.querySelectorAll(".wrapper-operation").forEach((block) => {
                        if (block.querySelector(".wrapper-operation__wrapper-content").children.length == 0) {
                            block.remove()
                        }
                    })
                }
            }
        }
    }

    switchButton.addEventListener("click", function() {
        if (switchButton.querySelector(".switch-operations__input").checked == false) {
            changeChart(sortByDate(operationsExpensesByCurrentDate, "decrease"))
        } else {
            changeChart(sortByDate(operationsIncomeByCurrentDate, "decrease"))
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

    function sortByDate(arr, typeOfSorting) {
        if (typeOfSorting == "decrease") {
            return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
        } 
        else if (typeOfSorting == "increase") {
            return arr.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
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
            initChart(arr[i].chartId, arr[i].operations)
        }
    }
    
    function initChart(chartId, data) {
        var root = am5.Root.new(chartId);
        root.setThemes([am5themes_Animated.new(root)]);
    
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            paddingLeft: 0
        }));
    
        var xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 30,  
        });
        var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
            baseInterval: {
                timeUnit: "day",
                count: 0
            },
            visible: false,
            renderer: xRenderer,
        }));
        xAxis.get("renderer").grid.template.set("forceHidden", true);
    
        var yRenderer = am5xy.AxisRendererY.new(root, {});
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            strictMinMax: true,
            renderer: yRenderer,
            visible: false,
        }));
        yAxis.get("renderer").grid.template.set("forceHidden", true);
    
        var series = chart.series.push(am5xy.LineSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "cost",
            valueXField: "date",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY}"
              }),
            stroke: "rgb(255,255,255)",
        }));
        series.fills.template.setAll({
            visible: true,
            fillOpacity: 0.3,
        });
        series.set("fill", "rgba(255,255,255, 0.3)");
    
        if (!data || data.length <= 1) {
            data = []
            yAxis.set("min", 0)
        }
    
        xAxis.data.setAll(changeDate(getPreviousDateArr(fillEmptyObj(data), 12)));
        series.data.setAll(changeDate(getPreviousDateArr(fillEmptyObj(data), 12)));
        series.appear(1000);
        chart.appear(1000, 100);
        chartsArr.push({root, xRenderer, yRenderer, xAxis, yAxis, series, data, chart});
    }

    function fillEmptyObj(operations) {
        let newArr = getPreviousDays(24).map(item => {
            for (let obj of operations) {
                if (obj.date == item.date) {
                    item.cost += obj.cost
                }
            }
            return item
        })
    
        let data = [...newArr].reverse();
    
        function fillEmptyCosts(costs) {
            let nextNonZeroCost = 0;
          
            for (let i = 0; i < costs.length; i++) {
                if (costs[i].cost === 0) {
                    costs[i].cost = nextNonZeroCost;
                } 
                else {
                    if (costs[i - 1]) costs[i].cost = data[i - 1].cost + costs[i].cost
                    nextNonZeroCost = costs[i].cost;
                }
            }
          
            return costs;
        }
    
        function getPreviousDays(months) {
            const dates = [];
            const today = new Date();
            for (let i = 0; i < months; i++) {
                const newDate = new Date(today.getTime());
                newDate.setMonth(today.getMonth() - i);
                const daysInMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
                for (let j = 0; j < daysInMonth; j++) {
                    let day;
                    if (newDate.getMonth() == new Date().getMonth()) {
                        if (j > new Date().getDate()) break;
                        day = new Date(newDate.getFullYear(), newDate.getMonth(), j + 1);
                        
                    } else {
                        day = new Date(newDate.getFullYear(), newDate.getMonth(), j + 1);
                    }
                    const dayName = new Date(day).toLocaleString('ru', { month: 'numeric', day: 'numeric', year: 'numeric'});
                    dates.push(dayName.split(".").reverse().join("-"));
                }
            }
            return sortByDate(dates.map((date) => { return { cost: 0, date: date }}), "decrease");
        }
    
        return fillEmptyCosts(data)
    }
    
    function changeDate(arr) {
        for (let obj of arr) {
            obj.date = Date.parse(obj.date)
        }
        return arr;
    }
    
    function getPreviousDateArr(arr, months) {
        const month = new Date(arr[arr.length - 1].date).getMonth() - months
        const date = new Date(new Date(arr[arr.length - 1].date).getFullYear(), month, new Date(arr[arr.length - 1].date).getDate()).toLocaleString("ru", {year: "numeric", month: "numeric", day:"numeric"}).split(".").reverse().join("-");
    
        return arr.filter(obj => new Date(obj.date) >= new Date(date));
    }

    function setOperationsToAccounts(operationsAll, accounts) {
        for (let account of accounts) {
            let filterOperationsAll = operationsAll.filter(obj => obj.account == account.title)
            account.operations = filterOperationsAll;
            account.cost = sumCosts(filterOperationsAll)
        }
        return accounts;
    }

    function transformAllOperationsToObjectsForXYChart(arr) {
        const mergedExpenses = {};
    
      for (const expense of arr) {
        const date = expense.date;
        const cost = expense.cost;
    
        if (mergedExpenses[date]) {
          mergedExpenses[date] += cost;
        } else {
          mergedExpenses[date] = cost;
        }
      }
    
      return Object.keys(mergedExpenses).map(date => {
        return {
          date,
          cost: mergedExpenses[date]
        };
      });
    }

    function sumCosts(arr) {
        let sum = 0;
        for  (let obj of arr) {
            sum += obj.cost;
        }
        return sum;
    }

    // создание категории

    changeColor(icons, inpBg, inpColor, wrapperInpBg, wrapperInpColor);

    function setValueToObject(obj, index, inpTitle, inpBg, inpColor, typeS, icon) {
        obj.index = index;
        obj.title = inpTitle.value;
        obj.bg = inpBg.value;
        obj.color = inpColor.value;
        obj.cost = 0;
        obj.type = typeS;
        obj.icon = icon
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

    function changeColor(icons, inpBg, inpColor, wrapperInpBg, wrapperInpColor) {

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
        container: '.main-date__input-wrapper',
        isVisibleMY: false,
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
            changeMainDate(operationsIncomeByCurrentDate, categoriesIncomeByCurrentDate, operationsIncome, categoriesIncome, chartIncomePie, "income", "Income");
            changeMainDate(operationsExpensesByCurrentDate, categoriesExpensesByCurrentDate, operationsExpenses, categoriesExpenses, chartExpensesPie, "expenses", "Expenses");       
        }
    }
    if (parseFloat(window.innerWidth) <= 650) {
        mainDatePickerSettings.container = '.air-datepicker-global-container'
        mainDatePickerSettings.isMobile = true
        mainDatePickerSettings.autoClose = false
    }
    let mainDatePicker = new AirDatepicker('#main-picker', mainDatePickerSettings)

    let overblockDatePicker = document.querySelector(".overblock-date-picker")
    let dateButton = document.querySelector(".main-date");
    dateButton.addEventListener("click", function() {
        mainDatePickerSettings.isVisibleMY = true;
        overblockDatePicker.classList.add("overblock-date-picker_open");
        if (mainDatePicker) mainDatePicker.show();
    })
    overblockDatePicker.addEventListener("click", function() {
        overblockDatePicker.classList.remove("overblock-date-picker_open");
        if (mainDatePickerSettings.isVisibleMY) {
            mainDatePicker.hide();
            mainDatePickerSettings.isVisibleMY = false;
        }
    })


    function changeMainDate(operationsByCurrentDate, categoriesByCurrentDate, operations, categories, chartPie, typeS, typeXL) {
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

        setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), typeS);
        changeChart(sortByDate(operationsByCurrentDate, "decrease"), chart, series, xAxis);

        console.log(operationsExpensesByCurrentDate, allOperationsByCurrentDate)
        setDataToProgressBar(progressBarExpenses, operationsExpensesByCurrentDate, allOperationsByCurrentDate);
        setDataToProgressBar(progressBarIncome, operationsIncomeByCurrentDate, allOperationsByCurrentDate);

        if (operationsByCurrentDate == operationsIncomeByCurrentDate) {
            switchChart.classList.add("switch-chart_act");
            switchChart.querySelector(".switch-chart__input").checked = true;
            titleChart.textContent = "График доходов";
        } else {
            switchChart.classList.remove("switch-chart_act");
            switchChart.querySelector(".switch-chart__input").checked = false;
            titleChart.textContent = "График расходов";
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

    window.addEventListener("click", (event) => deleteOperation(event, "expenses", "Expenses", operationsExpenses, operationsExpensesByCurrentDate, categoriesExpenses, categoriesExpensesByCurrentDate, chartExpensesPie))
    window.addEventListener("click", (event) => deleteOperation(event, "income", "Income", operationsIncome, operationsIncomeByCurrentDate, categoriesIncome, categoriesIncomeByCurrentDate, chartIncomePie))

    function deleteOperation(event, typeS, typeXL, operations, operationsByCurrentDate, categories, categoriesByCurrentDate, chartPie) {
        if (event.target.closest(`.expand-operation_${typeS} .operation__button_delete`)) {
            let deleteBtn = event.target.closest(`.expand-operation_${typeS} .operation__button_delete`);
            let operation = deleteBtn.closest(".expand-operation");
   
            sortOperations(operation, operations);
            sortOperations(operation, operationsByCurrentDate);

            categories = Object.assign(categories, updateOperation(categories, operations));
            categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateOperation(categoriesByCurrentDate, operationsByCurrentDate));

            allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);

            addToFirestore(operations, `operations${typeXL}`);
            addToFirestore(operationsByCurrentDate, `operations${typeXL}ByDate`);
            addToFirestore(categories, `operations${typeXL}`);
            addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`);
    
            setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), typeS);

            chart(categoriesByCurrentDate, chartPie);
            changeCostsOfCategories(categoriesByCurrentDate, typeS);

            changeChart(sortByDate(allOperationsByCurrentDate, "decrease"), chart, series, xAxis);

            accountArr = setOperationsToAccounts(operationsExpenses.concat(operationsIncome), accountArr);
            setAccountsToList(accountArr, "swiper-accounts-operations")
            swiperAcoounts.update()
            addToFirestore(accountArr, `accounts`);

            setDataToProgressBar(progressBarExpenses, operationsExpensesByCurrentDate, allOperationsByCurrentDate);
            setDataToProgressBar(progressBarIncome, operationsIncomeByCurrentDate, allOperationsByCurrentDate);
        }
    }

    function sortOperations(operation, operations) {
        let temp = operations.filter(item => item.index != operation.dataset.index);
        operations.forEach(item => operations.pop())
        operations = Object.assign(operations, temp);
    }

    // изменение операций

    window.addEventListener("click", (event) => addOperationToPopupChangeOperation(event, "expenses", popupOperation, operationsExpensesByCurrentDate))
    window.addEventListener("click", (event) => addOperationToPopupChangeOperation(event, "income", popupOperation, operationsIncomeByCurrentDate))
  
    window.addEventListener("click", function(event) {
        if (event.target.closest(`.popup-operation__button_change-expenses`)) {
            changeOperations(event, popupOperation, "expenses", "Expenses", operationsExpenses, operationsExpensesByCurrentDate, categoriesExpenses, categoriesExpensesByCurrentDate, chartExpensesPie)
        }
        if (event.target.closest(`.popup-operation__button_change-income`)) {
            changeOperations(event, popupOperation, "income", "Income", operationsIncome, operationsIncomeByCurrentDate, categoriesIncome, categoriesIncomeByCurrentDate, chartIncomePie)
        }
    })

    overblock.addEventListener("click", function() {
        popupOperation.classList.remove("popup-operation_open");
        document.querySelector(".popup-operation__button").classList.remove("popup-operation__button_change-expenses")
        document.querySelector(".popup-operation__button").classList.remove("popup-operation__button_change-income")
        overblock.classList.remove("overblock_open");

        let account = document.querySelector(`.account-choose_act`);
        account.classList.remove("account-choose_act");
    })

    function addOperationToPopupChangeOperation(event, typeS, popup, operationsByCurrentDate) {
        if (event.target.closest(`.expand-operation_${typeS} .operation__button_change`)) {
            let button = event.target.closest(`.expand-operation_${typeS} .operation__button_change`);
            let operation = button.closest(".expand-operation");  
            operation.classList.add("expand-operation_act");
            
            let findObjOperation = findObjectByHtmlIndex(operation, operationsByCurrentDate);
            setDataFromInput(findObjOperation);
            addCategoryToPopup(findObjOperation, typeS, `popup-operation`);

            let activeAccount = document.querySelector(`[data-index="${findObjOperation.accountIndex}"]`);
            activeAccount.classList.add("account-choose_act")
           
            popup.classList.add("popup-operation_open");
            overblock.classList.add("overblock_open");

            popup.querySelector(".popup-operation__button").classList.add(`popup-operation__button_change-${typeS}`);
        }
    }

    function changeOperations(event, popup, typeS, typeXL, operations, operationsByCurrentDate, categories, categoriesByCurrentDate, chartPie) {

        let operation = document.querySelector(".expand-operation_act");
        let account = document.querySelector(`.account-choose_act`);
            
        let findObjAccount = findObjectByHtmlIndex(account, accountArr);
        let findObjOperation = findObjectByHtmlIndex(operation, operationsByCurrentDate);
        let inpCost = document.querySelector(`.popup-operation .input-cost__input`);
        let inpComm = document.querySelector(`.popup-operation .textarrea__input`);
        let inpDate = document.querySelector(`.popup-operation .input-date__input`);
        findObjOperation.cost = +inpCost.value;
        findObjOperation.comment = inpComm.value;
        findObjOperation.date = inpDate.value;
        findObjOperation.account = findObjAccount.title;
        findObjOperation.accountIndex = findObjAccount.index;

        for (let obj of operationsByCurrentDate) {
            if (findObjOperation.index == obj.index) {
                obj.cost = findObjOperation.cost;
                obj.comment = findObjOperation.comment;
                obj.date = findObjOperation.date;
                obj.account = findObjOperation.account;
                obj.accountIndex = findObjOperation.accountIndex;
            }
        }
        for (let obj of operations) {
            if (findObjOperation.index == obj.index) {
                obj.cost = findObjOperation.cost;
                obj.comment = findObjOperation.comment;
                obj.date = findObjOperation.date;
                obj.account = findObjOperation.account;
                obj.accountIndex = findObjOperation.accountIndex;
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
        setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), typeS)
        changeChart(sortByDate(allOperationsByCurrentDate, "decrease"), chart, series, xAxis);

        accountArr = setOperationsToAccounts(operationsExpenses.concat(operationsIncome), accountArr);

        setAccountsToList(accountArr, "swiper-accounts-operations")
        swiperAcoounts.update()
        addToFirestore(accountArr, `accounts`);

        setDataToProgressBar(progressBarExpenses, operationsExpensesByCurrentDate, allOperationsByCurrentDate);
        setDataToProgressBar(progressBarIncome, operationsIncomeByCurrentDate, allOperationsByCurrentDate);

        operation.classList.remove("expand-operation_act");
        account.classList.remove("account-choose_act");
        popupOperation.classList.remove("popup-operation_open");
        document.querySelector(".popup-operation__button").classList.remove("popup-operation__button_change-expenses")
        document.querySelector(".popup-operation__button").classList.remove("popup-operation__button_change-income")
        overblock.classList.remove("overblock_open");
    }

    function setDataFromInput(modifiedObj) {
        let inpCost = document.querySelector(`.popup-operation .input-cost__input`);
        let inpComm = document.querySelector(`.popup-operation .textarrea__input`);
        let inpDate = document.querySelector(`.popup-operation .input-date__input`);

        inpCost.value = modifiedObj.cost;
        inpComm.value = modifiedObj.comment;
        inpDate.value = modifiedObj.date;
    }

    // изменение графика

    switchChart.addEventListener("click", () => {
        if (switchChart.classList.contains("switch-chart_act")) {
            switchChart.classList.remove("switch-chart_act");
            changeChart(sortByDate(operationsExpensesByCurrentDate, "decrease"), chart, series, xAxis);
            titleChart.textContent = "График расходов";
        } else {
            switchChart.classList.add("switch-chart_act");
            changeChart(sortByDate(operationsIncomeByCurrentDate, "decrease"), chart, series, xAxis);
            titleChart.textContent = "График доходов";
        }
    })

    // прогрессбар

    function setDataToProgressBar(progressBar, operations, allOperations) {
        let progressBarBg = progressBar.querySelector(".progress-bar__bg");
        let progressBarPercent = progressBar.querySelector(".progress-bar__total");
        let progressBarBgLastOperation = progressBar.querySelector(".progress-bar__bg-last-operation");

        if (operations.length == 0) {
            progressBarBg.style.width = 0;
            progressBarBgLastOperation.style.width = 0;
            progressBarPercent.textContent = `0%`;
            progressBarPercent.style.color = "black"
            progressBarPercent.style.left = `calc(100% - ${progressBarPercent.offsetWidth + 5}px)`
            return;
        }

        let totalSum = allOperations.reduce((sum, obj) => sum + Math.abs(obj.cost), 0);
        let sum = operations.reduce((sum, obj) => sum + Math.abs(obj.cost), 0);
        let lastCost = Math.abs(sortByDate(operations, "decrease")[0].cost);

        let generalPercent = Math.round(sum * 100 / totalSum);
        let lastCostPercent = Math.round(lastCost * 100 / totalSum);

        if (operations.length == 1) {
            progressBarBg.style.width = `${generalPercent}%`;
            progressBarBgLastOperation.style.width = 0;
            progressBarPercent.textContent = `${generalPercent}%`;
            progressBarPercent.style.left = `calc(${generalPercent}% - ${progressBarPercent.offsetWidth + 5}px)`;
            progressBarPercent.style.color = "white"
            if (parseInt(progressBarBg.style.width) * 0.01 * +progressBar.offsetWidth < 35) {
                progressBarPercent.style.color = "black"
                progressBarPercent.style.left = `calc(100% - ${progressBarPercent.offsetWidth + 5}px)`
            }
            return;
        }

        progressBarBg.style.width = `${generalPercent - lastCostPercent}%`;
        progressBarBgLastOperation.style.width = `${generalPercent}%`;
        progressBarPercent.textContent = `${generalPercent}%`;
        progressBarPercent.style.left = `calc(${generalPercent - lastCostPercent}% - ${progressBarPercent.offsetWidth + 5}px)`;
        progressBarPercent.style.color = "white"
        if (parseInt(progressBarBg.style.width) * 0.01 * +progressBar.offsetWidth < 35) {
            progressBarPercent.style.color = "black"
            progressBarPercent.style.left = `calc(100% - ${progressBarPercent.offsetWidth + 5}px)`
        }
    }

    // переключение попапов с созданием операций

    let switchPopupButtons = document.querySelectorAll(".popup-category__tab-button");
    let buttonPopup = document.querySelector(".popup-category .button")
    switchPopupButtons.forEach(button => {
        button.addEventListener("click", function() {
            let dataTab = button.dataset.tab;
            let currentTab = document.getElementById(dataTab);
            let activeTab = document.querySelector(".popup-category__tab_act");
            let activeButton = document.querySelector(".popup-category__tab-button_act");

            if (activeTab && activeTab != currentTab) {
                activeTab.classList.remove("popup-category__tab_act");
                activeButton.classList.remove("popup-category__tab-button_act");
            }

            currentTab.classList.add("popup-category__tab_act");
            button.classList.add("popup-category__tab-button_act");

            if (currentTab.classList.contains("popup-category__tab_create")) {
                buttonPopup.classList.remove("popup-category-done__button");
                buttonPopup.classList.add("popup-category__button")
                setProgress(0);
                circleNum.textContent = "02";
            } else {
                buttonPopup.classList.add("popup-category-done__button");
                buttonPopup.classList.remove("popup-category__button")
                setProgress(50);
                circleNum.textContent = "01";
            }
        })
    })
}

export default addCategoryExpenses;