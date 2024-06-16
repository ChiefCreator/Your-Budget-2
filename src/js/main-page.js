import categoriesSlide from "./modules/categories-slide";
import expandOperation from "./modules/expand-operation";
import inputTextarrea from "./modules/inputTextarrea";
import airDatepicker from "./modules/airDatepicker";
import sliders from "./modules/sliders";
import tabletMenu from "./modules/tabletMenu";
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import changeChart from "./modules/changeChartExpensesAndIncome";
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import getDataFromFirestore from "./modules/functions/getDataFromFirestore";
import addToFirestore from './modules/functions/addToFirestore';
import setItemToList from "./modules/functions/setItemToList";
import setItemToListFromDatabase from './modules/functions/setItemToListFromDatabase';
import changeCostsOfCategories from './modules/functions/changeCostsOfCategories';
import chooseCategory from './modules/functions/chooseCategory';
import chartExpensesPie from './modules/functions/chartExpensesPie';
import chartIncomePie from './modules/functions/chartIncomePie';
import setDataToChartPieCategories from "./modules/functions/setDataToChartPieCategories";
import setProgressOfCircleProgressBar from "./modules/functions/setProgressOfCircleProgressBar";
import addCategoryToPopup from './modules/functions/addCategoryToPopup';
import setOperationToList from './modules/functions/setOperationToList';
import setOperationsToAccounts from "./modules/functions/setOperationsToAccounts";
import findObjectByHtmlIndex from './modules/functions/findObjectByHtmlIndex';
import updateCategoryCost from './modules/functions/updateCategoryCost';
import setAccountsToList from './modules/functions/setAccountsToList';
import sortByDate from './modules/functions/sortByDate';
import objOperation from './modules/functions/objOperation';
import changeColor from './modules/changeColor';
import initXYChartOperations from './modules/initXYChartOperations';
import setIndex from "./modules/functions/setIndex";
import noDataToggle from "./modules/no-data";

// expenses переменные
let categoryExpenses = {};
let categoriesExpenses = [];
let operationsExpenses = [];
let operationsExpensesByCurrentDate = [];
let categoriesExpensesByCurrentDate = [];
// income переменные 
let categoryIncome = {};
let categoriesIncome = [];
let operationsIncome = [];
let operationsIncomeByCurrentDate = [];
let categoriesIncomeByCurrentDate = [];
// general variables 
let allOperationsByCurrentDate = [];
let allCategoriesByCurrentDate = [];
let accountArr = [];
let chartsArr = [];
let index = 0;
let objXYChartOperations = {};
// html-элементы для категорий
let popupCategory = document.querySelector(".popup-category");
let inpTitle = popupCategory.querySelector(".popup-category__input");
let inpBg = popupCategory.querySelector(".input-color__input_bg");
let wrapperInpBg = inpBg.parentElement;
let inpColor = popupCategory.querySelector(".input-color__input_color");
let wrapperInpColor = inpColor.parentElement;
let icons = popupCategory.querySelectorAll(".popup-category__icon");
let btnAddCategoriesExpenses = document.querySelector(".add-expenses");
let btnAddCategoriesIncome = document.querySelector(".add-income");
// html-элементы для операций
let popupOperation = document.querySelector(".popup-operation");
let btnCreateOperationPopup = popupOperation.querySelector(".popup-operation__button");
let inputCost = popupOperation.querySelector(".input-cost__input");
let inputDate = popupOperation.querySelector(".input-date__input");
let textarreaComment = popupOperation.querySelector(".textarrea__input");
let closeBtnPopupOperation = popupOperation.querySelector(".popup-operation__close");
// sliders
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
const swiperTools = new Swiper('.swiper-statistics-slider', {
    speed: 600,
    spaceBetween: 15,
    slidesPerView: 1.5,
    loop: true,
    navigation: {
        nextEl: '.swiper-buttons-statistics .swiper-buttons__button_next',
        prevEl: '.swiper-buttons-statistics .swiper-buttons__button_prev',
    },
    breakpoints: {
        1355: {
            slidesPerView: 3,
        },
        460: {
            slidesPerView: 2,
        },
    }
})
// general html-elements
let switchChart = document.querySelector(".switch-chart");
let titleChart = document.querySelector(".operation-chart__title");
let overblock = document.querySelector(".overblock");
let switchButton = document.querySelector(".switch-operations");
let userEmail = localStorage.getItem("email").replace(".", "*");
let progressBarExpenses = document.querySelector(".progress-bar_expenses");
let progressBarIncome = document.querySelector(".progress-bar_income");
let circleNum = document.querySelector(".progress-ring-wrapper__num");
let circle = document.querySelector(".progress-ring__circle");
let radius = circle.r.baseVal.value;
let circumference = 2 * Math.PI * radius;      
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;
initXYChartOperations(objXYChartOperations);
// date
let dateText = document.querySelector(".main-date__value");
let currentDate = new Date().getFullYear() + "-" + ("0" + (+(new Date()).getMonth() + 1)).slice(-2);
if (!localStorage.getItem("currentDate")) {
    localStorage.setItem("currentDate", currentDate); 
}
dateText.textContent = transformDate(localStorage.getItem("currentDate"));

// get data
Promise.all([getDataFromFirestore("categoriesExpenses", userEmail), getDataFromFirestore("categoriesExpensesByDate", userEmail),getDataFromFirestore("categoriesIncome", userEmail), getDataFromFirestore("categoriesIncomeByDate", userEmail),  getDataFromFirestore("operationsExpenses", userEmail), getDataFromFirestore("operationsExpensesByDate", userEmail), getDataFromFirestore("operationsIncome", userEmail), getDataFromFirestore("operationsIncomeByDate", userEmail), getDataFromFirestore("accounts", userEmail)])
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
        setDataToChartPieCategories(categoriesExpensesByCurrentDate, chartExpensesPie);
        changeCostsOfCategories(categoriesExpensesByCurrentDate, "expenses");

        setItemToListFromDatabase(categoriesIncomeByCurrentDate, "income");
        setDataToChartPieCategories(categoriesIncomeByCurrentDate, chartIncomePie);
        changeCostsOfCategories(categoriesIncomeByCurrentDate, "income");

        setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), "list-operations", true, () => noDataToggle(allOperationsByCurrentDate, document.querySelector(".no-data-list"), document.querySelector(".no-data-list").querySelector(".no-data__video"), [document.querySelector(".operation-list__header"), document.querySelector(".operation-list__body")]));
        changeChart(sortByDate(operationsExpensesByCurrentDate, "decrease"), objXYChartOperations.chart, objXYChartOperations.series, objXYChartOperations.xAxis);

        setAccountsToList(accountArr, "swiper-accounts-operations", chartsArr, "account-choose", false)

        setDataToProgressBar(progressBarExpenses, operationsExpensesByCurrentDate, allOperationsByCurrentDate);
        setDataToProgressBar(progressBarIncome, operationsIncomeByCurrentDate, allOperationsByCurrentDate);
    })

// add and create categories
window.addEventListener("click", (event) => addCategory(event, categoryExpenses, categoriesExpenses, operationsExpenses, categoriesExpensesByCurrentDate, operationsExpensesByCurrentDate, chartExpensesPie, "expenses", "Expenses", "expensesCategory", popupCategory, inpTitle, inpBg, inpColor));
window.addEventListener("click", (event) => addCategory(event, categoryIncome, categoriesIncome, operationsIncome, categoriesIncomeByCurrentDate, operationsIncomeByCurrentDate, chartIncomePie, "income", "Income", "incomeCategory", popupCategory, inpTitle, inpBg, inpColor));
changeColor(icons, inpBg, inpColor, wrapperInpBg, wrapperInpColor);
togglePopup(btnAddCategoriesExpenses, popupCategory);
togglePopup(btnAddCategoriesIncome, popupCategory);

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
        categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateCategoryCost(categories, operationsByCurrentDate));

        addToFirestore(categories, `categories${typeXL}`, userEmail);
        addToFirestore(updateCategoryCost(categoriesByCurrentDate, operationsByCurrentDate), `categories${typeXL}ByDate`, userEmail);

        setItemToList(objCategory, typeS);
        setDataToChartPieCategories(categoriesByCurrentDate, chartPie);
        changeCostsOfCategories(categoriesByCurrentDate, typeS);

        resetPopupCategory();
    }

    if (event.target.closest(`.popup-category_${typeS} .popup-category__button`)) {
        setValueToObject(objCategory, setIndex(indexName), inpTitle, inpBg, inpColor, typeS, document.querySelector(".popup-category__icon.act").dataset.categoryIcon);

        if (validation(objCategory)) {
            index++;

            categories.push(Object.assign({}, objCategory))
            categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateCategoryCost(categories, operationsByCurrentDate));

            addToFirestore(categories, `categories${typeXL}`, userEmail);
            addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`, userEmail);

            setItemToList(objCategory, typeS);
            setDataToChartPieCategories(categoriesByCurrentDate, chartPie);

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

    setProgressOfCircleProgressBar(circle, circumference, 50);
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

// create operations
window.addEventListener("click", (event) => addCategoryToPopupOperation(event, "expenses", popupOperation, categoriesExpensesByCurrentDate, btnCreateOperationPopup));
window.addEventListener("click", (event) => addCategoryToPopupOperation(event, "income", popupOperation, categoriesIncomeByCurrentDate, btnCreateOperationPopup))
window.addEventListener("click", (event) => chooseAccount(event))
window.addEventListener("click", function(event) {
    if (event.target.closest(`.popup-operation__button_expenses`)) {
        createOperation(inputCost, inputDate, textarreaComment, "expenses", "Expenses", operationsExpenses, operationsExpensesByCurrentDate, categoriesExpenses, categoriesExpensesByCurrentDate, chartExpensesPie, accountArr)
    }
    if (event.target.closest(`.popup-operation__button_income`)) {
        createOperation(inputCost, inputDate, textarreaComment, "income", "Income", operationsIncome, operationsIncomeByCurrentDate, categoriesIncome, categoriesIncomeByCurrentDate, chartIncomePie, accountArr)
    }
})
switchButton.addEventListener("click", function() {
    if (switchButton.querySelector(".switch-operations__input").checked == false) {
        changeChart(sortByDate(operationsExpensesByCurrentDate, "decrease"))
    } else {
        changeChart(sortByDate(operationsIncomeByCurrentDate, "decrease"))
    }
})
overblock.addEventListener("click", function() {
    closePopup(popupOperation, inputCost);
    btnCreateOperationPopup.classList.remove(`popup-operation__button_expenses`)
    btnCreateOperationPopup.classList.remove(`popup-operation__button_income`)
})
closeBtnPopupOperation.addEventListener("click", function() {
    closePopup(popupOperation, inputCost);
})

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
    operationsByCurrentDate.length = 0;
    operationsByCurrentDate = Object.assign(operationsByCurrentDate, sortArrayByCurrentDate(operations));

    categories = Object.assign(categories, updateCategoryCost(categories, operations));
    categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateCategoryCost(categoriesByCurrentDate, operationsByCurrentDate));

    allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);

    addToFirestore(categories, `categories${typeXL}`, userEmail);
    addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`, userEmail);

    setDataToChartPieCategories(categoriesByCurrentDate, chartPie);
    changeCostsOfCategories(categoriesByCurrentDate, typeS);

    addToFirestore(operations, `operations${typeXL}`, userEmail);
    addToFirestore(operationsByCurrentDate, `operations${typeXL}ByDate`, userEmail);

    setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), "list-operations", true);
    changeChart(sortByDate(operationsByCurrentDate, "decrease"), objXYChartOperations.chart, objXYChartOperations.series, objXYChartOperations.xAxis);

    accountArr = setOperationsToAccounts(operationsExpenses.concat(operationsIncome), accountArr);
    setAccountsToList(accountArr, "swiper-accounts-operations", chartsArr, "account-choose", false)
    swiperAcoounts.update()
    addToFirestore(accountArr, `accounts`, userEmail);

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
function addPopup(popup) {
    popup.classList.add("popup-operation_open");
    overblock.classList.add("overblock_open");
}
function closePopup(popup, inputCost) {
    popup.classList.remove("popup-operation_open");
    overblock.classList.remove("overblock_open");

    inputCost.value = "";
}

// airDatePicker
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

toggleOverblockMainDatePicker()

function toggleOverblockMainDatePicker() {
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
}
function changeMainDate(operationsByCurrentDate, categoriesByCurrentDate, operations, categories, chartPie, typeS, typeXL) {
    operationsByCurrentDate.length = 0;
    operationsByCurrentDate = Object.assign(operationsByCurrentDate, sortArrayByCurrentDate(operations))
    categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateCategoryCost(categories, operationsByCurrentDate))
    allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);

    addToFirestore(operationsByCurrentDate, `operations${typeXL}ByDate`, userEmail)
    addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`,userEmail)
    setDataToChartPieCategories(categoriesByCurrentDate, chartPie);
    changeCostsOfCategories(categoriesByCurrentDate, typeS)

    setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), "list-operations", true,() => noDataToggle(allOperationsByCurrentDate, document.querySelector(".no-data-list"), document.querySelector(".no-data-list").querySelector(".no-data__video"), [document.querySelector(".operation-list__header"), document.querySelector(".operation-list__body")]));
    changeChart(sortByDate(operationsByCurrentDate, "decrease"), objXYChartOperations.chart, objXYChartOperations.series, objXYChartOperations.xAxis);

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

// delete operations
window.addEventListener("click", (event) => deleteOperation(event, "expenses", "Expenses", operationsExpenses, operationsExpensesByCurrentDate, categoriesExpenses, categoriesExpensesByCurrentDate, chartExpensesPie))
window.addEventListener("click", (event) => deleteOperation(event, "income", "Income", operationsIncome, operationsIncomeByCurrentDate, categoriesIncome, categoriesIncomeByCurrentDate, chartIncomePie))

function deleteOperation(event, typeS, typeXL, operations, operationsByCurrentDate, categories, categoriesByCurrentDate, chartPie) {
    if (event.target.closest(`.expand-operation_${typeS} .operation__button_delete`)) {
        let deleteBtn = event.target.closest(`.expand-operation_${typeS} .operation__button_delete`);
        let operation = deleteBtn.closest(".expand-operation");

        sortOperations(operation, operations);
        sortOperations(operation, operationsByCurrentDate);

        categories = Object.assign(categories, updateCategoryCost(categories, operations));
        categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateCategoryCost(categoriesByCurrentDate, operationsByCurrentDate));

        allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);

        addToFirestore(operations, `operations${typeXL}`, userEmail);
        addToFirestore(operationsByCurrentDate, `operations${typeXL}ByDate`, userEmail);
        addToFirestore(categories, `operations${typeXL}`, userEmail);
        addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`, userEmail);

        setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), "list-operations", true, () => noDataToggle(allOperationsByCurrentDate, document.querySelector(".no-data-list"), document.querySelector(".no-data-list").querySelector(".no-data__video"), [document.querySelector(".operation-list__header"), document.querySelector(".operation-list__body")]));

        setDataToChartPieCategories(categoriesByCurrentDate, chartPie);
        changeCostsOfCategories(categoriesByCurrentDate, typeS);

        changeChart(sortByDate(allOperationsByCurrentDate, "decrease"), objXYChartOperations.chart, objXYChartOperations.series, objXYChartOperations.xAxis);

        accountArr = setOperationsToAccounts(operationsExpenses.concat(operationsIncome), accountArr);
        setAccountsToList(accountArr, "swiper-accounts-operations", chartsArr)
        swiperAcoounts.update()
        addToFirestore(accountArr, `accounts`, userEmail);

        setDataToProgressBar(progressBarExpenses, operationsExpensesByCurrentDate, allOperationsByCurrentDate);
        setDataToProgressBar(progressBarIncome, operationsIncomeByCurrentDate, allOperationsByCurrentDate);

        function sortOperations(operation, operations) {
            let temp = operations.filter(item => item.index != operation.dataset.index);
            operations.forEach(item => operations.pop())
            operations = Object.assign(operations, temp);
        }
    }
}

// change operations
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

    function setDataFromInput(modifiedObj) {
        let inpCost = document.querySelector(`.popup-operation .input-cost__input`);
        let inpComm = document.querySelector(`.popup-operation .textarrea__input`);
        let inpDate = document.querySelector(`.popup-operation .input-date__input`);

        inpCost.value = modifiedObj.cost;
        inpComm.value = modifiedObj.comment;
        inpDate.value = modifiedObj.date;
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

    categories = Object.assign(categories, updateCategoryCost(categories, operations));
    categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateCategoryCost(categoriesByCurrentDate, operationsByCurrentDate));

    allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);

    addToFirestore(operations, `operations${typeXL}`)
    addToFirestore(operationsByCurrentDate, `operations${typeXL}ByDate`)
    addToFirestore(categories, `categories${typeXL}`)
    addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`)

    setDataToChartPieCategories(categoriesByCurrentDate, chartPie)
    changeCostsOfCategories(categoriesByCurrentDate, typeS)
    setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), "list-operations", true, () => noDataToggle(allOperationsByCurrentDate, document.querySelector(".no-data-list"), document.querySelector(".no-data-list").querySelector(".no-data__video"), [document.querySelector(".operation-list__header"), document.querySelector(".operation-list__body")]))
    changeChart(sortByDate(allOperationsByCurrentDate, "decrease"), objXYChartOperations.chart, objXYChartOperations.series, objXYChartOperations.xAxis);

    accountArr = setOperationsToAccounts(operationsExpenses.concat(operationsIncome), accountArr);

    setAccountsToList(accountArr, "swiper-accounts-operations", chartsArr)
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

// change chart
switchChart.addEventListener("click", () => {
    if (switchChart.classList.contains("switch-chart_act")) {
        switchChart.classList.remove("switch-chart_act");
        changeChart(sortByDate(operationsExpensesByCurrentDate, "decrease"), objXYChartOperations.chart, objXYChartOperations.series, objXYChartOperations.xAxis);
        titleChart.textContent = "График расходов";
    } else {
        switchChart.classList.add("switch-chart_act");
        changeChart(sortByDate(operationsIncomeByCurrentDate, "decrease"), objXYChartOperations.chart, objXYChartOperations.series, objXYChartOperations.xAxis);
        titleChart.textContent = "График доходов";
    }
})

// change progressbar
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
setProgressOfCircleProgressBar(circle, circumference, 50);
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
            setProgressOfCircleProgressBar(circle, circumference, 0)
            circleNum.textContent = "02";
        } else {
            buttonPopup.classList.add("popup-category-done__button");
            buttonPopup.classList.remove("popup-category__button")
            setProgressOfCircleProgressBar(circle, circumference, 50)
            circleNum.textContent = "01";
        }
    })
})

categoriesSlide();
airDatepicker();
expandOperation();
inputTextarrea();
sliders();
tabletMenu();