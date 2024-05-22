import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import toggleFilter from './toggle-filter';

function functionalOnOperationsPage(chart, root, xAxis, yAxis) {

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

let inputFromCost = document.querySelector("[data-range='price-from']");
let inputToCost = document.querySelector("[data-range='price-to']");
let inputFromDate = document.querySelector("[data-range='date-from']");
let inputToDate = document.querySelector("[data-range='date-to']");

let dateText = document.querySelector(".main-date__value");
let currentDate = new Date().getFullYear() + "-" + ("0" + (+(new Date()).getMonth() + 1)).slice(-2);
if (!localStorage.getItem("currentDate")) {
    localStorage.setItem("currentDate", currentDate); 
}
dateText.textContent = transformDate(localStorage.getItem("currentDate"))

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

            setOperationsToList(sortByDate(allOperationsByCurrentDate, "decrease"));
            setCategoriesToFilter(allCategoriesByCurrentDate);

            var data = transformAllOperationsToObjectsForChartBar(sortByDate(allOperationsByCurrentDate, "increase"));
            createSeries(allCategoriesByCurrentDate, data)
            chart.appear(1000, 100);

            $(".range__input_cost").ionRangeSlider({
                type: "double",
                min: 0,
                max: getMaxCost(allOperationsByCurrentDate),
                from: 0,
                to: getMaxCost(allOperationsByCurrentDate) / 2,
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
                values: getDaysOfMonth(localStorage.getItem("currentDate").slice(0,4), localStorage.getItem("currentDate").slice(5, 7)),
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
            rangeValue(inputFromCost,inputToCost,".range__input_cost", 0);
            rangeValue(inputFromDate,inputToDate,".range__input_date", 1);
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
            let item = teg.querySelector(".expand-operation");
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

function sortByDate(arr, typeOfSorting) {
    if (typeOfSorting == "decrease") {
        return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    } 
    else if (typeOfSorting == "increase") {
        return arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
}

function makeSeries(data, name, fieldName, bg, root, xAxis, yAxis) {
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: "date",
        fill: bg
    }));
  
    series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}: {valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0,
    });
  
    console.log(data)
    xAxis.data.setAll(data);
    series.data.setAll(data);
    series.appear();
}
function transformAllOperationsToObjectsForChartBar(arr) {
    const result = arr.reduce((acc, curr) => {
        const key = curr.date;
        if (!acc[key]) {
            acc[key] = {};
        }
        if (acc[key][curr.title]) {
            acc[key][curr.title] += curr.cost;
        } else {
            acc[key][curr.title] = curr.cost;
        }
        acc[key].date = curr.date;
        return acc;
    }, {});

    return Object.values(result);
}
function createSeries(arr, data) {
    for (let obj of arr) {
        makeSeries(data, obj.title, obj.title, obj.bg, root, xAxis, yAxis);
    }
}

// календарь

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

        resetFilter()
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

    setOperationsToList(sortByDate(allOperationsByCurrentDate, "decrease"));  
    
    chart.series.clear();
    var data = transformAllOperationsToObjectsForChartBar(sortByDate(allOperationsByCurrentDate, "increase"));
    createSeries(allCategoriesByCurrentDate, data);
    chart.appear(1000, 100);
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

// фильтр
toggleFilter();

function rangeValue(inputFrom, inputTo, rangeTeg, num){
    var instance = $(rangeTeg).data("ionRangeSlider");
    inputFrom.addEventListener("input", function() {
        var valFrom = inputFrom.value
        instance.update({from: valFrom - num});
    })
    inputTo.addEventListener("input", function() {
        var valTo = inputTo.value
        instance.update({to: valTo - num});
    })
}

function getDaysOfMonth(year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const day = i.toString().padStart(2, '0');
      const formattedMonth = (month).toString().padStart(2, '0');
  
      dates.push(`${year}-${formattedMonth}-${day}`);
    }
  
    return dates;
}

function getMaxCost(arr) {
    return Math.max(...arr.reduce((acc, obj) => {
        acc.push(Math.abs(obj.cost))
        return acc;
    }, []))
}

// отчистка данных фильтра

function resetFilter() {
    resetInput(inputFromCost);
    resetInput(inputToCost);
    resetInput(inputFromDate);
    resetInput(inputToDate);

    $(".range__input_cost").data("ionRangeSlider").update({
        max: getMaxCost(allOperationsByCurrentDate),
        from: 0,
        to: getMaxCost(allOperationsByCurrentDate) / 2,
        min: 0,
    });
    $(".range__input_date").data("ionRangeSlider").update({
        from: 0,
        to: 15,
        values: getDaysOfMonth(localStorage.getItem("currentDate").slice(0,4), localStorage.getItem("currentDate").slice(5, 7))
    })

    let checkboxes = document.querySelectorAll(".input-check__inp");
    checkboxes.forEach(checkbox => { if (checkbox.checked) checkbox.checked = false});

    setOperationsToList(sortByDate(allOperationsByCurrentDate, "decrease"));

    chart.series.clear();
    var data = transformAllOperationsToObjectsForChartBar(sortByDate(allOperationsByCurrentDate, "increase"));
    createSeries(allCategoriesByCurrentDate, data);
    chart.appear(1000, 100);

    function resetInput(input) {
        return input.value = "";
    }
}

const resetButton = document.querySelector(".reset-filter");
resetButton.addEventListener("click", function() {
    resetFilter()
})

// получение данных фильтра

let applyFilter = document.querySelector(".apply-filter");
applyFilter.addEventListener("click", function() {
    let inputFromCostValue = inputFromCost.value;
    let inputToCostValue = inputToCost.value;
    let inputFromDateValue = inputFromDate.value;
    let inputToDateValue = inputToDate.value;

    let arrTitlesOfCheckboxes = [];
    let checkboxes = document.querySelectorAll(".input-check__inp");
    checkboxes.forEach(checkbox => { if (checkbox.checked) arrTitlesOfCheckboxes.push(checkbox.dataset.title)});

    let filteredAllOperationsByCurrentDate = [];
    let filteredAllCategoriesByCurrentDate = [];

    // все три фильтра включены
    if (inputFromCostValue != "" && inputToCostValue != "" && inputFromDateValue != "" && inputToDateValue != "" && isChecked(checkboxes) > 0) {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue) && (item.date >= inputFromDateValue && item.date <= inputToDateValue) && arrTitlesOfCheckboxes.includes(item.title));
        filteredAllCategoriesByCurrentDate = updateOperation(allCategoriesByCurrentDate, allOperationsByCurrentDate.filter(item => item.date >= inputFromDateValue && item.date <= inputToDateValue)).filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue) && arrTitlesOfCheckboxes.includes(item.title));
    }
    // два определенных фильтра включены
    else if (inputFromCostValue != "" && inputToCostValue != "" && inputFromDateValue != "" && inputToDateValue != "") {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue) && (item.date >= inputFromDateValue && item.date <= inputToDateValue));
        filteredAllCategoriesByCurrentDate = updateOperation(allCategoriesByCurrentDate, allOperationsByCurrentDate.filter(item => item.date >= inputFromDateValue && item.date <= inputToDateValue)).filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue));
    }
    else if (inputFromCostValue != "" && inputToCostValue != "" && isChecked(checkboxes) > 0) {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue) && arrTitlesOfCheckboxes.includes(item.title));
        filteredAllCategoriesByCurrentDate = allCategoriesByCurrentDate.filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue) && arrTitlesOfCheckboxes.includes(item.title));
    }
    else if (inputFromDateValue != "" && inputToDateValue != "" && isChecked(checkboxes) > 0) {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (item.date >= inputFromDateValue && item.date <= inputToDateValue) && arrTitlesOfCheckboxes.includes(item.title));
        filteredAllCategoriesByCurrentDate = updateOperation(allCategoriesByCurrentDate, allOperationsByCurrentDate.filter(item => item.date >= inputFromDateValue && item.date <= inputToDateValue)).filter(item => (arrTitlesOfCheckboxes.includes(item.title)));
    }
    // фильтры включены по-отдельности
    else if (inputFromCostValue != "" && inputToCostValue != "") {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue);
        filteredAllCategoriesByCurrentDate = allCategoriesByCurrentDate.filter(item => Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue);
    }
    else if (inputFromDateValue != "" && inputToDateValue != "") {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => item.date >= inputFromDateValue && item.date <= inputToDateValue);
        filteredAllCategoriesByCurrentDate = updateOperation(allCategoriesByCurrentDate, allOperationsByCurrentDate.filter(item => item.date >= inputFromDateValue && item.date <= inputToDateValue));
    }
    else if (isChecked(checkboxes) > 0) {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => arrTitlesOfCheckboxes.includes(item.title));
        filteredAllCategoriesByCurrentDate = allCategoriesByCurrentDate.filter(item => arrTitlesOfCheckboxes.includes(item.title));
    }

    setOperationsToList(sortByDate(filteredAllOperationsByCurrentDate, "decrease"));

    chart.series.clear();
    var data = transformAllOperationsToObjectsForChartBar(sortByDate(filteredAllOperationsByCurrentDate, "increase"));
    createSeries(filteredAllCategoriesByCurrentDate, data);
    chart.appear(1000, 100);

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
}

export default functionalOnOperationsPage;