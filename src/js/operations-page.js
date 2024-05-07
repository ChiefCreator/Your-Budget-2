import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import Chart from 'chart.js/auto';

let operationsExpenses = [];
let categoriesExpensesByCurrentDate = [];
let operationsExpensesByCurrentDate = [];
let categoriesExpenses = [];

let operationsIncome = [];
let categoriesIncomeByCurrentDate = [];
let operationsIncomeByCurrentDate = [];
let categoriesIncome = [];

let allOperationsByCurrentDate = [];
let allCategoriesByCurrentDate = [];

const chartExpensesAndIncomePie = new Chart(document.getElementById('chartExpensesAndIncomePie'), {
    type: 'polarArea',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            borderWidth: 1,
        }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            },
        }
    },
});

let userEmail = localStorage.getItem("email").replace(".", "*");
Promise.all([getDataFromFirestore("categoriesExpenses"), getDataFromFirestore("categoriesExpensesByDate"),getDataFromFirestore("categoriesIncome"), getDataFromFirestore("categoriesIncomeByDate"),  getDataFromFirestore("operationsExpenses"), getDataFromFirestore("operationsExpensesByDate"), getDataFromFirestore("operationsIncome"), getDataFromFirestore("operationsIncomeByDate")])
        .then(response => {
            return Promise.all([response[0].json(), response[1].json(), response[2].json(), response[3].json(), response[4].json(), response[5].json(),response[6].json(), response[7].json()]);
        })
        .then(data => {
            categoriesExpenses = data[0];
            categoriesExpensesByCurrentDate = data[1];
            categoriesIncome = data[2];
            categoriesIncomeByCurrentDate = data[3];

            operationsExpenses = data[4];
            operationsExpensesByCurrentDate = (data[5] != null) ? data[5] : [];
            operationsIncome = data[6];
            operationsIncomeByCurrentDate = (data[7] != null) ? data[7] : [];
            
            allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);
            allCategoriesByCurrentDate = categoriesExpensesByCurrentDate.concat(categoriesIncomeByCurrentDate);

            setOperationsToList(allOperationsByCurrentDate);
            chart(allCategoriesByCurrentDate, chartExpensesAndIncomePie);
            console.log(allOperationsByCurrentDate)
            setCategoriesToFilter(allOperationsByCurrentDate)
        })

function getDataFromFirestore(collection) {
    const firestoreUrl = `https://database-fc7b1-default-rtdb.europe-west1.firebasedatabase.app/users/${userEmail}/${collection}.json`;

    return fetch(firestoreUrl)
}

function setOperationsToList(arr) {
    let blockToPaste = document.querySelector(`.list-all-operations`);

    blockToPaste.querySelectorAll(".list-all-operation__wrapper").forEach(block => {
        block.remove()
    })

    for (let i = 0;i < arr.length;i++) {
        let block = `<div class="list-all-operation__wrapper" data-dat-wrapper="all${arr[i].date}">
        <p class="list-all-operation__date">${arr[i].date}</p>
        <div class="list-all-operation__wrapper-content" data-dat="all${arr[i].date}"></div>
        </div>`;

        let itemCategory = "";
        if (arr[i].comment) {
            itemCategory = `<div class="list-category__item item-category expand-operation" data-index="${arr[i].index}">
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
            itemCategory = `<div class="list-category__item item-category expand-operation" data-index="${arr[i].index}">
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
            let item = teg.querySelector(".list-all-operation__wrapper");
            return item;
        }

      
        blockToPaste.append(parserBlockToPaste(block));
        document.querySelector(`[data-dat="all${arr[i].date}"]`).prepend(parser(itemCategory));

        if (document.querySelectorAll(`[data-dat="all${arr[i].date}"]`).length > 1) {
            document.querySelectorAll(`[data-dat-wrapper="all${arr[i].date}"]`)[document.querySelectorAll(`[data-dat-wrapper="all${arr[i].date}"]`).length - 1].remove()
        }
    }
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
        changeMainDate()
    },
}
let mainDatePicker = new AirDatepicker('#main-picker', mainDatePickerSettings)


function changeMainDate() {

    if (operationsExpensesByCurrentDate == null || operationsIncomeByCurrentDate == null) return;

    operationsExpensesByCurrentDate = sortArrayByCurrentDate(operationsExpenses);
    operationsIncomeByCurrentDate = sortArrayByCurrentDate(operationsIncome);

    allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);
    allCategoriesByCurrentDate = updateOperation(categoriesExpenses.concat(categoriesIncome), allOperationsByCurrentDate);

    categoriesExpensesByCurrentDate = updateOperation(categoriesExpenses, operationsExpensesByCurrentDate);
    categoriesIncomeByCurrentDate = updateOperation(categoriesIncome, operationsIncomeByCurrentDate);

    addToFirestore(operationsExpensesByCurrentDate, `operationsExpensesByDate`)
    addToFirestore(operationsIncomeByCurrentDate, `operationsIncomeByDate`)

    addToFirestore(categoriesExpensesByCurrentDate, `categoriesExpensesByDate`)
    addToFirestore(categoriesIncomeByCurrentDate, `categoriesIncomeByDate`)

    setOperationsToList(allOperationsByCurrentDate);
    chart(allOperationsByCurrentDate, chartExpensesAndIncomePie);
    chart(allCategoriesByCurrentDate, chartExpensesAndIncomePie);            
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
    .catch(error => {
      console.error('Error adding category:', error);
    });
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

// фильтр

import toggleFilter from './modules/toggle-filter';
toggleFilter();

let inputFromCost = document.querySelector("[data-range='price-from']");
let inputToCost = document.querySelector("[data-range='price-to']");

let inputFromDate = document.querySelector("[data-range='date-from']");
let inputToDate = document.querySelector("[data-range='date-to']");

$(".range__input_cost").ionRangeSlider({
    type: "double",
    min: 0,
    max: 20000,
    from: 0,
    to: 5000,
    drag_interval: true,
    onChange: function (data) {
        let dataFrom = data.from;
        let dataTo = data.to;

        inputFromCost.value = dataFrom;
        inputToCost.value = dataTo;
    },
});
$(".range__input_date").ionRangeSlider({
    type: "double",
    values: getDatesFromCurrentMounth(),
    from: 0,
    to: 15,
    drag_interval: true,
    onChange: function (data) {
        let dataFrom = data.from_value;
        let dataTo = data.to_value;

        inputFromDate.value = dataFrom;
        inputToDate.value = dataTo;
    },
});
function rangeValue(inputFrom, inputTo, rangeTeg){
    var instance = $(rangeTeg).data("ionRangeSlider");
    inputFrom.addEventListener("input", function() {
        var valFrom = inputFrom.value
        instance.update({from: valFrom});
    })
    inputTo.addEventListener("input", function() {
        var valTo = inputTo.value
        instance.update({to: valTo});
    })
}
rangeValue(inputFromCost,inputToCost,".range__input_cost");
rangeValue(inputFromDate,inputToDate,".range__input_date");

function getDatesFromCurrentMounth() {
    const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 2);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const dates = [];

    for (let i = firstDay; i <= lastDay; i.setDate(i.getDate() + 1)) {
      const formattedDate = i.toISOString().slice(0, 10);
      dates.push(formattedDate);
    }

    return dates;
}

// получение данных фильтра

let applyFilter = document.querySelector(".apply-filter");
applyFilter.addEventListener("click", function() {
    let inputFromCostValue = inputFromCost.value;
    let inputToCostValue = inputToCost.value;
    let inputFromDateValue = inputFromDate.value;
    let inputToDateValue = inputToDate.value;

    let arrTitlesOfCheckboxes = [];
    let checkboxes = document.querySelectorAll(".input-check__inp");
    checkboxes.forEach(checkbox => { if (checkbox.checked) arrTitlesOfCheckboxes.push(checkbox.dataset.title)})

    // все три фильтра включены
    if (inputFromCostValue != "" && inputToCostValue != "" && inputFromDateValue != "" && inputToDateValue != "" && isChecked(checkboxes) > 0) {
        let filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (item.cost >= inputFromCostValue && item.cost <= inputToCostValue) && (item.date >= inputFromDateValue && item.date <= inputToDateValue) && arrTitlesOfCheckboxes.includes(item.title));
        setOperationsToList(filteredAllOperationsByCurrentDate)
    }
    // два определенных фильтра включены
    else if (inputFromCostValue != "" && inputToCostValue != "" && inputFromDateValue != "" && inputToDateValue != "") {
        let filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (item.cost >= inputFromCostValue && item.cost <= inputToCostValue) && (item.date >= inputFromDateValue && item.date <= inputToDateValue));
        setOperationsToList(filteredAllOperationsByCurrentDate)
    }
    else if (inputFromCostValue != "" && inputToCostValue != "" && isChecked(checkboxes) > 0) {
        let filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (item.cost >= inputFromCostValue && item.cost <= inputToCostValue) && arrTitlesOfCheckboxes.includes(item.title));
        setOperationsToList(filteredAllOperationsByCurrentDate)
    }
    else if (inputFromDateValue != "" && inputToDateValue != "" && isChecked(checkboxes) > 0) {
        let filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (item.date >= inputFromDateValue && item.date <= inputToDateValue) && arrTitlesOfCheckboxes.includes(item.title));
        setOperationsToList(filteredAllOperationsByCurrentDate)
    }
    // фильтры включены по-отдельности
    else if (inputFromCostValue != "" && inputToCostValue != "") {
        let filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => item.cost >= inputFromCostValue && item.cost <= inputToCostValue);
        setOperationsToList(filteredAllOperationsByCurrentDate)
    }
    else if (inputFromDateValue != "" && inputToDateValue != "") {
        let filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => item.date >= inputFromDateValue && item.date <= inputToDateValue);
        setOperationsToList(filteredAllOperationsByCurrentDate)
    }
    else if (isChecked(checkboxes) > 0) {
        let filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => arrTitlesOfCheckboxes.includes(item.title));
        setOperationsToList(filteredAllOperationsByCurrentDate)
    }

    function isChecked(checkboxes) {
        let amount = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) amount++;
        })
        return amount;
    }
})

// загрузка категорий в фильтр

function setCategoriesToFilter(arr) {
    let blockToPaste = document.querySelector(`.category-sorting`);

    blockToPaste.querySelectorAll(".input-check").forEach(block => {
        block.remove()
    })

    for (let i = 0;i < arr.length;i++) {
        let itemCategory = `<div class="input-check">
        <div class="input-check__wrapper-inp">
            <input class="input-check__inp" type="checkbox" id="input-check__${arr[i].title}" data-title="${arr[i].title}">
            <span class="input-check__wrapper-inp-bg"></span>
        </div>
        <label class="input-check__label" for="input-check__${arr[i].title}">${arr[i].title}</label>
        </div>`;
                    
        function parser(itemCategory) {
            var parser = new DOMParser();
            let teg = parser.parseFromString(itemCategory, 'text/html');
            let item = teg.querySelector(".input-check");
            return item;
        }
        blockToPaste.append(parser(itemCategory))
    }
}