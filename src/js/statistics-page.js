import { slice } from "@amcharts/amcharts5/.internal/core/util/Array";
import noDataToggle from "./modules/no-data";
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import initTrendChart from "./modules/initTrendChart";
import initbalanceDynamicChart from "./modules/initBalanceDynamicChart";
import sortByDate from "./modules/functions/sortByDate";
import addToFirestore from "./modules/functions/addToFirestore";
import getDataFromFirestore from "./modules/functions/getDataFromFirestore";
import getPreviousMounths from "./modules/functions/getPreviousMounths";
import getPreviousDateArr from "./modules/functions/getPreviousDateArr";
import absCostInArr from "./modules/functions/absCostInArr";

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
let allOperations = [];
let allCategories = [];
let trendArr = [];
let balanceArr = [];
let trendChartObj = {};
let balanceChartObj = {};
initTrendChart(trendChartObj);
initbalanceDynamicChart(balanceChartObj);
// html-элементы для операций
let userEmail = localStorage.getItem("email").replace(".", "*");
let movableDate = document.querySelector(".balance-dynamics-chart__date-wrapper");
movableDate.textContent = new Date().toLocaleString("ru", {year: "numeric", month: "numeric", day:"numeric"}).split(".").reverse().join("-");
// date
let dateText = document.querySelector(".main-date__value");
let currentDate = new Date().getFullYear() + "-" + ("0" + (+(new Date()).getMonth() + 1)).slice(-2);
if (!localStorage.getItem("currentDate")) {
    localStorage.setItem("currentDate", currentDate); 
}
dateText.textContent = transformDate(localStorage.getItem("currentDate"))

// get data
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
            
            allOperations = (operationsExpenses && operationsIncome) ? operationsExpenses.concat(operationsIncome) : [];
            allCategories = (categoriesExpenses && categoriesIncome) ? categoriesExpenses.concat(categoriesIncome) : [];

            updateChart(absCostInArr(operationsExpenses), trendChartObj.xAxis, trendChartObj.series, trendChartObj.chart);
            changeTrend();

            balanceArr = sortByDate(getPreviousDateArr(fillEmptyObj(allOperations), 12), "increase");
            balanceChartObj.resizeButton1.events.on("dragged", function () {
                var x = balanceChartObj.resizeButton1.x();
                var position = balanceChartObj.xAxis.toAxisPosition(x / balanceChartObj.chart.plotContainer.width());
                var value = balanceChartObj.xAxis.positionToValue(position);
            
                balanceChartObj.range1.set("value", value);
            
                let currentDate = new Date(value).toLocaleString("ru", {year: 'numeric', month: 'numeric', day: 'numeric'}).split(".").reverse().join("-");
                let currentCost = balanceArr.find(obj => obj.date == currentDate).cost;
                let startCost = balanceArr[0].cost;
                let startDate = balanceArr[0].date;
                let dateDifference = Math.floor((new Date(currentDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
            
                document.querySelector(".balance-dynamics-chart__total-num").textContent = currentCost;
                document.querySelector(".balance-dynamics-chart__percent").textContent = getPercentDifferenceBetweenNums(startCost, currentCost);
                document.querySelector(".balance-dynamics-chart__percent-name").textContent = matchNumWithWord(dateDifference);
            
                movableDate.textContent = currentDate;
                movableDate.style.left = x + 10 + "px"
            });
            updateBalanceChart(allOperations, balanceChartObj.xAxis, balanceChartObj.series, balanceChartObj.chart, 12);
        })

function updateChart(arr, xAxis, series, chart) {
    var data = transformAllOperationsToObjectsForChartBar(transformOperationsSortedByMounth(sortByDate(arr, "increase")));
    trendArr = setBg(uniteArrOfOperationsAndArrOfMounths(getPreviousMounths(), data));
    xAxis.data.setAll(trendArr);
    series.data.setAll(trendArr);

    series.appear();
    chart.appear(1000, 100);
}
function updateBalanceChart(arr, xAxis, series, chart, monthAmount) {
    balanceArr = getPreviousDateArr(fillEmptyObj(arr), monthAmount)

    xAxis.data.setAll(changeDate(getPreviousDateArr(fillEmptyObj(arr), monthAmount)));
    series.data.setAll(changeDate(getPreviousDateArr(fillEmptyObj(arr), monthAmount)));
    series.appear(1000);
    chart.appear(1000, 100);

    let currentDate = sortByDate(balanceArr, "decrease")[0].date;
    let currentCost = balanceArr.find(obj => obj.date == currentDate).cost;
    let startCost = sortByDate(balanceArr, "increase")[0].cost;
    let startDate = sortByDate(balanceArr, "increase")[0].date;
    let dateDifference = Math.floor((new Date(currentDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
            
    document.querySelector(".balance-dynamics-chart__total-num").textContent = currentCost;
    document.querySelector(".balance-dynamics-chart__percent").textContent = getPercentDifferenceBetweenNums(startCost, currentCost);
    document.querySelector(".balance-dynamics-chart__percent-name").textContent = matchNumWithWord(dateDifference)
}
function transformAllOperationsToObjectsForChartBar(arr) {
    const result = arr.reduce((acc, curr) => {
        const key = curr.date;
        if (!acc[key]) {
            acc[key] = {};
        }
        if (acc[key].cost) {
            acc[key].cost += curr.cost;
        } else {
            acc[key].cost = curr.cost;
        }
        acc[key].date = curr.date;
        return acc;
    }, {});

    return Object.values(result);
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
function transformOperationsSortedByMounth(arr) {
    const months = [
        "январь",
        "февраль",
        "март",
        "апрель",
        "май",
        "июнь",
        "июль",
        "август",
        "сентябрь",
        "октябрь",
        "ноябрь",
        "декабрь",
    ];

    const newTransactions = arr.map((transaction) => {
        const dateParts = transaction.date.split("-");
        const month = months[parseInt(dateParts[1]) - 1];
        const year = dateParts[0];
    
        return {
            ...transaction,
            date: `${month}, ${year}`,
        };
    });

    return newTransactions;
}
function uniteArrOfOperationsAndArrOfMounths(arr1, arr2) {
    const mergedArray = arr1.concat(arr2);

    const result = mergedArray.reduce((acc, obj) => {
        const existingIndex = acc.findIndex((item) => item.date === obj.date);
        if (existingIndex === -1) {
            acc.push(obj);
        } else {
            acc[existingIndex].cost += obj.cost;
        }
        return acc;
    }, []);

    return result.reverse();
}
function setBg(arr) {
    let newArr = []
    for (let obj of arr) {
        if (obj.cost >= 0) {
            newArr.push({...obj, bg: {fill: "#31a51f"}, bulletLocation: {centerY: am5.p100}})
        } else {
            newArr.push({...obj, bg: {fill: "red"}, bulletLocation: {centerY: am5.p0}})
        }
    }

    return newArr;
}

// select
document.querySelectorAll(".select").forEach(function(dropdownWrapper) {

    const dropdownButtom = dropdownWrapper.querySelector(".select__button")
    const dropdown = dropdownWrapper.querySelector(".select__dropdown")
    const dropdownList = dropdownWrapper.querySelector(".select__dropdown-list")
    const dropdownListItems =  dropdownWrapper.querySelectorAll(".select__dropdown-item")
    const dropdownInput = dropdownWrapper.querySelector(".select__input-hidden")
            
    dropdownButtom.addEventListener("click", function() {
        dropdownList.classList.toggle("select__dropdown-list_visible");
        dropdown.classList.toggle("select__dropdown_visible");
        this.classList.add("select__button_active");
    })
                
    dropdownListItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.stopPropagation()
            dropdownButtom.querySelector(".select__button-title").textContent = this.textContent;
            dropdownInput.value = this.dataset.value

            dropdownList.classList.remove("select__dropdown-list_visible");
            dropdown.classList.remove("select__dropdown_visible");

            if (item.closest(".select-trend")) {
                if (dropdownInput.value == "expenses") {
                    updateChart(absCostInArr(operationsExpenses), trendChartObj.xAxis, trendChartObj.series, trendChartObj.chart)
                } else if (dropdownInput.value == "income") {
                    updateChart(operationsIncome, trendChartObj.xAxis, trendChartObj.series, trendChartObj.chart)
                } else if (dropdownInput.value == "netIncome") {
                    updateChart(allOperations, trendChartObj.xAxis, trendChartObj.series, trendChartObj.chart)
                }
            }

            changeTrend()

            if (item.closest(".select-time-balance")) {
                let data = sortByDate(getPreviousDateArr(fillEmptyObj(allOperations), +dropdownInput.value), "increase")
                updateBalanceChart(allOperations, balanceChartObj.xAxis, balanceChartObj.series, balanceChartObj.chart, +dropdownInput.value);

                balanceChartObj.range1.set("value", new Date().getTime());

                movableDate.textContent = new Date().toLocaleString("ru", {year: 'numeric', month: 'numeric', day: 'numeric'}).split(".").reverse().join("-");;

                balanceChartObj.resizeButton1.events.on("dragged", function () {
                    var x = balanceChartObj.resizeButton1.x();
                    var position = balanceChartObj.xAxis.toAxisPosition(x / balanceChartObj.chart.plotContainer.width());
                    var value = balanceChartObj.xAxis.positionToValue(position);
            
                    balanceChartObj.range1.set("value", value);
            
                    let currentDate = new Date(value).toLocaleString("ru", {year: 'numeric', month: 'numeric', day: 'numeric'}).split(".").reverse().join("-");
                    let currentCost = data.find(obj => obj.date == currentDate) ? data.find(obj => obj.date == currentDate).cost : 0;
                    let startCost = data[0].cost;
                    let startDate = data[0].date;
                    let dateDifference = Math.floor((new Date(currentDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
                    
                    document.querySelector(".balance-dynamics-chart__total-num").textContent = currentCost;
                    document.querySelector(".balance-dynamics-chart__percent").textContent = getPercentDifferenceBetweenNums(startCost, currentCost);
                    document.querySelector(".balance-dynamics-chart__percent-name").textContent = matchNumWithWord(dateDifference)

                    movableDate.textContent = currentDate;
                    movableDate.style.left = x + 10 + "px"
                });
            }
        })
    })
                
    document.addEventListener("click", function(e) {
        if (e.target != dropdownButtom) {
            dropdownList.classList.remove("select__dropdown-list_visible");
            dropdown.classList.remove("select__dropdown_visible");
        }
    })
})
function changeTrend() {
    let amountMonth = document.querySelector(".select-time").querySelector(".select__input-hidden").value
    let sortedTrendArr = trendArr.slice(trendArr.length - +amountMonth)

    let averageCost = getAverageCost(sortedTrendArr)
    let wholePercentDifference = getPercentDifference(sortedTrendArr[0].cost, sortedTrendArr[sortedTrendArr.length - 1].cost)
    let monthPercentDifference = getAveragePercentDifference(sortedTrendArr[0].cost, sortedTrendArr[sortedTrendArr.length - 1].cost, sortedTrendArr)

    let averageTeg = document.querySelector(".trend-card__value_average");
    let wholePercentDifferenceTeg = document.querySelector(".trend-card__value_whole-difference");
    let monthPercentDifferenceTeg = document.querySelector(".trend-card__value_month-difference");

    setValueToHtml(averageCost, averageTeg)
    setValueToHtml(wholePercentDifference, wholePercentDifferenceTeg)
    setValueToHtml(monthPercentDifference, monthPercentDifferenceTeg)

    function getAverageCost(arr) {
        let sum = arr.reduce((sum, obj) => sum + obj.cost, 0);
        return `${Math.floor(sum / arr.length)}`;
    }
    function getPercentDifference(num1, num2) {
        if (num1 >= num2) return Math.floor(num1 / num2 * 100 - 100) + "%";
        if (num1 < num2) return Math.abs(Math.floor(num2 / num1 * 100 - 100)) + "%";
    }
    function getAveragePercentDifference(num1, num2, arr) {
        if (num1 >= num2) {
            return Math.floor((num1 / num2 * 100 - 100) / arr.length) + "%";
        }
        if (num1 < num2) {
            return Math.abs(Math.floor((num2 / num1 * 100 - 100) / arr.length)) + "%";
        }
    }

    function setValueToHtml(value, teg) {
        if (value == "Infinity%" || value == "-Infinity%" || value == "NaN%") {
            teg.textContent = "Н/д";
            teg.style.color = "black";
        } else {
            if (value == "0") teg.style.color = "black"
            else if (value.includes("-")) teg.style.color = "red"
            else if (!value.includes("-")) teg.style.color = "#31a51f"
            teg.textContent = value
        }
    }
}

// balance dynamics
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
                    // if (j > new Date().getDate()) break;
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
function getPercentDifferenceBetweenNums(num1, num2) {
    if (num1 == 0 || num2 == 0) return "Н/д";
    if (num1 >= num2 && num1 <= 0) return -Math.floor(num2 / num1 * 100 - 100) + "%";
    if (num1 >= num2) return Math.floor(num2 / num1 * 100 - 100) + "%";
    if (num1 < num2) return Math.abs(Math.floor(num2 / num1 * 100 - 100)) + "%";
}
function matchNumWithWord(num) {
    if (num == 1 || (num - 11) % 10 == 0 && num != 11) return `за ${num} день`;
    if (num == 2 || num == 3 || num == 4) return `за ${num} дня`;
    return `за ${num} дней`;
}

// choose type of statistics
let statisticsButtons = document.querySelectorAll(".statistics-types__item");
statisticsButtons.forEach(button => {
    button.addEventListener("click", function() {
        let buttonActive = document.querySelector(".statistics-types__item_act")
        if (buttonActive && buttonActive != button) {
            buttonActive.classList.remove("statistics-types__item_act");
        }
        button.classList.add("statistics-types__item_act");

        let dataTab = button.dataset.tab;
        let currentTab = document.getElementById(dataTab);

        let currentTabActive = document.querySelector(".statistics-tabs__tab_act")
        if (currentTabActive && currentTabActive != currentTab) {
            currentTabActive.classList.remove("statistics-tabs__tab_act");
        }
        currentTab.classList.add("statistics-tabs__tab_act");

        balanceChartObj.series.appear()
        balanceChartObj.chart.appear(1000, 100)
        trendChartObj.series.appear()
        trendChartObj.chart.appear(1000, 100)
    })
})

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
        changeMainDate(operationsIncomeByCurrentDate, categoriesIncomeByCurrentDate, operationsIncome, categoriesIncome, "income", "Income");
        changeMainDate(operationsExpensesByCurrentDate, categoriesExpensesByCurrentDate, operationsExpenses, categoriesExpenses, "expenses", "Expenses");       
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


function changeMainDate(operationsByCurrentDate, categoriesByCurrentDate, operations, categories, typeS, typeXL) {
    for (let i = 0;i < operationsByCurrentDate.length;i++) {
        for (let k = 0;k < operationsByCurrentDate.length;k++) {
            operationsByCurrentDate.pop()
        }
        operationsByCurrentDate.pop()
    }
    
    operationsByCurrentDate = Object.assign(operationsByCurrentDate, sortArrayByCurrentDate(operations))
    categoriesByCurrentDate = Object.assign(categoriesByCurrentDate, updateOperation(categories, operationsByCurrentDate))

    addToFirestore(operationsByCurrentDate, `operations${typeXL}ByDate`, userEmail)
    addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`, userEmail)
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