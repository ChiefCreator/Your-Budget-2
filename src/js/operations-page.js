import expandOperation from "./modules/expand-operation";
import tabletMenu from "./modules/tabletMenu";

import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import toggleFilter from './modules/toggle-filter';
import noDataToggle from "./modules/no-data";
import getDataFromFirestore from './modules/functions/getDataFromFirestore';
import addToFirestore from './modules/functions/addToFirestore';
import sortByDate from './modules/functions/sortByDate';
import updateCategoryCost from './modules/functions/updateCategoryCost';
import setOperationToList from './modules/functions/setOperationToList';
import rangeValue from './modules/functions/rangeValue';
import getDaysOfMonth from './modules/functions/getDaysOfMonth';
import getMaxCost from './modules/functions/getMaxCost';
import setCategoriesToFilter from "./modules/functions/setCategoriesToFilter";
import initChartBarOperations from './modules/initChartBarOperations';

// expenses переменные
let operationsExpenses = [];
let categoriesExpensesByCurrentDate = [];
let operationsExpensesByCurrentDate = [];
let categoriesExpenses = [];
// income переменные 
let operationsIncome = [];
let categoriesIncomeByCurrentDate = [];
let operationsIncomeByCurrentDate = [];
let categoriesIncome = [];
// general variables 
let allOperationsByCurrentDate = [];
let allCategoriesByCurrentDate = [];
let objChartBarOperations = {};
// general html-elements
let inputFromCost = document.querySelector("[data-range='price-from']");
let inputToCost = document.querySelector("[data-range='price-to']");
let inputFromDate = document.querySelector("[data-range='date-from']");
let inputToDate = document.querySelector("[data-range='date-to']");
initChartBarOperations(objChartBarOperations);
rangeValue(inputFromCost,inputToCost,".range__input_cost", 0);
rangeValue(inputFromDate,inputToDate,".range__input_date", 1);
// date
let dateText = document.querySelector(".main-date__value");
let currentDate = new Date().getFullYear() + "-" + ("0" + (+(new Date()).getMonth() + 1)).slice(-2);
if (!localStorage.getItem("currentDate")) {
    localStorage.setItem("currentDate", currentDate); 
}
dateText.textContent = transformDate(localStorage.getItem("currentDate"))

// get data
let userEmail = localStorage.getItem("email").replace(".", "*");
Promise.all([getDataFromFirestore("categoriesExpenses", userEmail), getDataFromFirestore("categoriesExpensesByDate", userEmail),getDataFromFirestore("categoriesIncome", userEmail), getDataFromFirestore("categoriesIncomeByDate", userEmail),  getDataFromFirestore("operationsExpenses", userEmail), getDataFromFirestore("operationsExpensesByDate", userEmail), getDataFromFirestore("operationsIncome", userEmail), getDataFromFirestore("operationsIncomeByDate", userEmail)])
        .then(response => {
            return Promise.all([response[0].json(), response[1].json(), response[2].json(), response[3].json(), response[4].json(), response[5].json(),response[6].json(), response[7].json()]);
        })
        .then(data => {
            categoriesExpenses = data[0] ? data[0] : [];
            categoriesExpensesByCurrentDate = data[1] ? data[1] : [];
            categoriesIncome = data[2] ? data[2] : [];
            categoriesIncomeByCurrentDate = data[3] ? data[3] : [];

            operationsExpenses = data[4] ? data[4] : [];
            operationsExpensesByCurrentDate = (data[5] != null) ? data[5] : [];
            operationsIncome = data[6] ? data[6] : [];
            operationsIncomeByCurrentDate = (data[7] != null) ? data[7] : [];
            
            allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);
            allCategoriesByCurrentDate = categoriesExpensesByCurrentDate.concat(categoriesIncomeByCurrentDate);

            setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), "list-all-operations", false, () => noDataToggle(allOperationsByCurrentDate, document.querySelector(".no-data-operations-all"), document.querySelector(".no-data-operations-all").querySelector(".no-data__video"), [document.querySelector(".page-operation__header")]));
            setCategoriesToFilter(allCategoriesByCurrentDate);

            var data = transformAllOperationsToObjectsForChartBar(sortByDate(allOperationsByCurrentDate, "increase"));
            noDataToggle(data, document.querySelector(".no-data-chart-operations-all"), document.querySelector(".no-data-chart-operations-all").querySelector(".no-data__video"), [document.querySelector(".operations-chart-bar__hide-logo"), document.querySelector("#chartExpensesAndIncomeBar")])
            createSeries(allCategoriesByCurrentDate, data)
            objChartBarOperations.chart.appear(1000, 100);

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
        })

function makeSeries(data, name, fieldName, bg, chart, root, xAxis, yAxis) {
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
        makeSeries(data, obj.title, obj.title, obj.bg, objChartBarOperations.chart, objChartBarOperations.root, objChartBarOperations.xAxis, objChartBarOperations.yAxis);
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
    container: ".main-date__input-wrapper",
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

function changeMainDate() {

    if (operationsExpensesByCurrentDate == null || operationsIncomeByCurrentDate == null) return;

    operationsExpensesByCurrentDate = sortArrayByCurrentDate(operationsExpenses);
    operationsIncomeByCurrentDate = sortArrayByCurrentDate(operationsIncome);

    allOperationsByCurrentDate = operationsExpensesByCurrentDate.concat(operationsIncomeByCurrentDate);
    allCategoriesByCurrentDate = updateCategoryCost(categoriesExpenses.concat(categoriesIncome), allOperationsByCurrentDate);

    categoriesExpensesByCurrentDate = updateCategoryCost(categoriesExpenses, operationsExpensesByCurrentDate);
    categoriesIncomeByCurrentDate = updateCategoryCost(categoriesIncome, operationsIncomeByCurrentDate);

    addToFirestore(operationsExpensesByCurrentDate, `operationsExpensesByDate`, userEmail)
    addToFirestore(operationsIncomeByCurrentDate, `operationsIncomeByDate`, userEmail)

    addToFirestore(categoriesExpensesByCurrentDate, `categoriesExpensesByDate`, userEmail)
    addToFirestore(categoriesIncomeByCurrentDate, `categoriesIncomeByDate`, userEmail)

    setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), "list-all-operations", false, () => noDataToggle(allOperationsByCurrentDate, document.querySelector(".no-data-operations-all"), document.querySelector(".no-data-operations-all").querySelector(".no-data__video"), [document.querySelector(".page-operation__header")])); 
    
    objChartBarOperations.chart.series.clear();
    var data = transformAllOperationsToObjectsForChartBar(sortByDate(allOperationsByCurrentDate, "increase"));
    createSeries(allCategoriesByCurrentDate, data);
    objChartBarOperations.chart.appear(1000, 100);
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

// фильтр
toggleFilter();

// открытие фильтра и графика
let overblock = document.querySelector(".overblock");
let chartButtonPopup = document.querySelector(".page-operation__button_chart")
let filterButtonPopup = document.querySelector(".page-operation__button_filter")
let chartPopup = document.querySelector(".operations-chart")
let filterPopup = document.querySelector(".operations-sorting")

chartButtonPopup.addEventListener("click", function() {
    chartPopup.classList.add("operations-chart_open")
    overblock.classList.add("overblock_open");
})
filterButtonPopup.addEventListener("click", function() {
    filterPopup.classList.add("operations-sorting_open")
    overblock.classList.add("overblock_open");
})
overblock.addEventListener("click", function() {
    overblock.classList.remove("overblock_open");
    filterPopup.classList.remove("operations-sorting_open")
    chartPopup.classList.remove("operations-chart_open")
})

// отчистка данных фильтра
const resetButton = document.querySelector(".reset-filter");
resetButton.addEventListener("click", () => resetFilter())
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

    setOperationToList(sortByDate(allOperationsByCurrentDate, "decrease"), "list-all-operations", false, () => noDataToggle(allOperationsByCurrentDate, document.querySelector(".no-data-operations-all"), document.querySelector(".no-data-operations-all").querySelector(".no-data__video"), [document.querySelector(".page-operation__header")]));

    objChartBarOperations.chart.series.clear();
    var data = transformAllOperationsToObjectsForChartBar(sortByDate(allOperationsByCurrentDate, "increase"));
    noDataToggle(data, document.querySelector(".no-data-chart-operations-all"), document.querySelector(".no-data-chart-operations-all").querySelector(".no-data__video"), [document.querySelector(".operations-chart-bar__hide-logo"), document.querySelector("#chartExpensesAndIncomeBar")])
    createSeries(allCategoriesByCurrentDate, data);
    objChartBarOperations.chart.appear(1000, 100);

    function resetInput(input) {
        return input.value = "";
    }
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
    checkboxes.forEach(checkbox => { if (checkbox.checked) arrTitlesOfCheckboxes.push(checkbox.dataset.title)});

    let filteredAllOperationsByCurrentDate = [];
    let filteredAllCategoriesByCurrentDate = [];

    // все три фильтра включены
    if (inputFromCostValue != "" && inputToCostValue != "" && inputFromDateValue != "" && inputToDateValue != "" && isChecked(checkboxes) > 0) {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue) && (item.date >= inputFromDateValue && item.date <= inputToDateValue) && arrTitlesOfCheckboxes.includes(item.title));
        filteredAllCategoriesByCurrentDate = updateCategoryCost(allCategoriesByCurrentDate, allOperationsByCurrentDate.filter(item => item.date >= inputFromDateValue && item.date <= inputToDateValue)).filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue) && arrTitlesOfCheckboxes.includes(item.title));
    }
    // два определенных фильтра включены
    else if (inputFromCostValue != "" && inputToCostValue != "" && inputFromDateValue != "" && inputToDateValue != "") {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue) && (item.date >= inputFromDateValue && item.date <= inputToDateValue));
        filteredAllCategoriesByCurrentDate = updateCategoryCost(allCategoriesByCurrentDate, allOperationsByCurrentDate.filter(item => item.date >= inputFromDateValue && item.date <= inputToDateValue)).filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue));
    }
    else if (inputFromCostValue != "" && inputToCostValue != "" && isChecked(checkboxes) > 0) {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue) && arrTitlesOfCheckboxes.includes(item.title));
        filteredAllCategoriesByCurrentDate = allCategoriesByCurrentDate.filter(item => (Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue) && arrTitlesOfCheckboxes.includes(item.title));
    }
    else if (inputFromDateValue != "" && inputToDateValue != "" && isChecked(checkboxes) > 0) {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => (item.date >= inputFromDateValue && item.date <= inputToDateValue) && arrTitlesOfCheckboxes.includes(item.title));
        filteredAllCategoriesByCurrentDate = updateCategoryCost(allCategoriesByCurrentDate, allOperationsByCurrentDate.filter(item => item.date >= inputFromDateValue && item.date <= inputToDateValue)).filter(item => (arrTitlesOfCheckboxes.includes(item.title)));
    }
    // фильтры включены по-отдельности
    else if (inputFromCostValue != "" && inputToCostValue != "") {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue);
        filteredAllCategoriesByCurrentDate = allCategoriesByCurrentDate.filter(item => Math.abs(item.cost) >= inputFromCostValue && Math.abs(item.cost) <= inputToCostValue);
    }
    else if (inputFromDateValue != "" && inputToDateValue != "") {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => item.date >= inputFromDateValue && item.date <= inputToDateValue);
        filteredAllCategoriesByCurrentDate = updateCategoryCost(allCategoriesByCurrentDate, allOperationsByCurrentDate.filter(item => item.date >= inputFromDateValue && item.date <= inputToDateValue));
    }
    else if (isChecked(checkboxes) > 0) {
        filteredAllOperationsByCurrentDate = allOperationsByCurrentDate.filter(item => arrTitlesOfCheckboxes.includes(item.title));
        filteredAllCategoriesByCurrentDate = allCategoriesByCurrentDate.filter(item => arrTitlesOfCheckboxes.includes(item.title));
    }

    setOperationToList(sortByDate(filteredAllOperationsByCurrentDate, "decrease"), "list-all-operations", false, () => noDataToggle(allOperationsByCurrentDate, document.querySelector(".no-data-operations-all"), document.querySelector(".no-data-operations-all").querySelector(".no-data__video"), [document.querySelector(".page-operation__header")]));

    objChartBarOperations.chart.series.clear();
    var data = transformAllOperationsToObjectsForChartBar(sortByDate(filteredAllOperationsByCurrentDate, "increase"));
    createSeries(filteredAllCategoriesByCurrentDate, data);
    noDataToggle(data, document.querySelector(".no-data-chart-operations-all"), document.querySelector(".no-data-chart-operations-all").querySelector(".no-data__video"), [document.querySelector(".operations-chart-bar__hide-logo"), document.querySelector("#chartExpensesAndIncomeBar")])
    objChartBarOperations.chart.appear(1000, 100);

    function isChecked(checkboxes) {
        let amount = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) amount++;
        })
        return amount;
    }

    overblock.classList.remove("overblock_open");
    filterPopup.classList.remove("operations-sorting_open")
})

expandOperation();
tabletMenu()