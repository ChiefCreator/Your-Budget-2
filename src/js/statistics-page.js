import { slice } from "@amcharts/amcharts5/.internal/core/util/Array";
import noDataToggle from "./modules/no-data";

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
let allOperations = [];
let allCategories = [];

let trendArr = [];
let balanceArr = [];

let dateText = document.querySelector(".main-date__value");
let currentDate = new Date().getFullYear() + "-" + ("0" + (+(new Date()).getMonth() + 1)).slice(-2);
if (!localStorage.getItem("currentDate")) {
    localStorage.setItem("currentDate", currentDate); 
}
dateText.textContent = transformDate(localStorage.getItem("currentDate"))

let userEmail = localStorage.getItem("email").replace(".", "*");

let movableDate = document.querySelector(".balance-dynamics-chart__date-wrapper");
movableDate.textContent = new Date().toLocaleString("ru", {year: "numeric", month: "numeric", day:"numeric"}).split(".").reverse().join("-");

// инициализация графика
var root = am5.Root.new("trend-chart"); 
root.setThemes([
    am5themes_Animated.new(root)
]);
var chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX: true,
    paddingLeft: 0,
    layout: root.verticalLayout
}));
var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    behavior: "none"
}));
cursor.lineY.set("visible", false);
chart.zoomOutButton.set("forceHidden", true);
var xRenderer = am5xy.AxisRendererX.new(root, {
    pan: "zoom",
    minGridDistance: 10,
})
var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.1,
    categoryField: "date",
    start: 0.5,
    minZoomCount: 1,
    maxZoomCount: 6,
    renderer: xRenderer,
}));
xAxis.get("renderer").labels.template.setAll({
    oversizedBehavior: "wrap",
    textAlign: "center",
});
  xRenderer.labels.template.setAll({
    fontSize: "0.8em"
});
var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
    }),
}));
var series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "месяцы",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField: "cost",
    categoryXField: "date",
    fill: "rgb(0,128,0)"
}));
series.columns.template.setAll({
    tooltipText: "{categoryX}: {valueY}",
    width: am5.percent(90),
    tooltipY: 0,
    strokeOpacity: 0,
});
series.columns.template.setAll({
    templateField: "bg"
});
series.bullets.push(function () {
    return am5.Bullet.new(root, {
      locationY: 1,
      sprite: am5.Label.new(root, {
        text: "{valueY}",
        templateField: "bulletLocation",
        fill: "black",
        centerX: am5.percent(50),
        populateText: true
      })
    });
});

let balanceChartObj = {}
balanceChart();
function balanceChart() {
    var root = am5.Root.new("balance-dynamics-chart");
    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0
    }));
    chart.zoomOutButton.set("forceHidden", true);

    var xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 250,  
    });
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        baseInterval: {
            timeUnit: "day",
            count: 0
        },
        renderer: xRenderer,
    }));

    var yRenderer = am5xy.AxisRendererY.new(root, {});
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: yRenderer
    }));

    var series = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "cost",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}"
          }),
        stroke: "rgb(0,128,0)",
    }));
    series.fills.template.setAll({
        visible: true,
        fillOpacity: 0.3,
    });
    series.set("fill", "rgba(0,128,0, 0.3)");

    var range0DataItem = yAxis.makeDataItem({
        value: 0,
        endValue: -10000000
    });
    yAxis.createAxisRange(range0DataItem);

    var seriesRangeDataItem = yAxis.makeDataItem({ value: 0, endValue: -100000 });
    var seriesRange = series.createAxisRange(seriesRangeDataItem);
    seriesRange.fills.template.setAll({
        visible: true,
        opacity: 0.3
    });
    seriesRange.fills.template.set("fill", "rgba(255, 0, 0, 0.6)");
    seriesRange.strokes.template.set("stroke", "rgba(255, 0, 0, 1)");

    var rangeDate = new Date();
    am5.time.add(rangeDate, "day", Math.round(series.dataItems.length / 2));
    var rangeTime1 = rangeDate.getTime()
    console.log(rangeTime1)
    
    var range1 = xAxis.createAxisRange(xAxis.makeDataItem({}));
    range1.set("value", rangeTime1);
    range1.get("grid").setAll({
      strokeOpacity: 1,
      stroke: "rgb(195, 195, 208)",
      strokeWidth: 2,
    });

    var resizeButton1 = am5.Button.new(root, {
        height: 6,
        width: 18,
        themeTags: ["resize", "horizontal"],
    });
    resizeButton1.get("background").setAll({
        cornerRadiusTL: am5.p100,
        cornerRadiusTR: am5.p100,
        cornerRadiusBR: am5.p100,
        cornerRadiusBL: am5.p100,
        fill: "rgb(195, 195, 208)",
        fillOpacity: 1,
        stroke: "rgb(195, 195, 208)",
    });
    resizeButton1.get("background").states.create("down", {}).setAll({
        fill: "rgb(195, 195, 208)",
        fillOpacity: 1
    });
    resizeButton1.adapters.add("y", function () {
      return 0;
    });
    resizeButton1.adapters.add("x", function (x) {
      return Math.max(0, Math.min(chart.plotContainer.width(), x));
    });

    resizeButton1.events.on("dragged", function () {
        var x = resizeButton1.x();
        var position = xAxis.toAxisPosition(x / chart.plotContainer.width());
        var value = xAxis.positionToValue(position);

        range1.set("value", value);

        let currentDate = new Date(value).toLocaleString("ru", {year: 'numeric', month: 'numeric', day: 'numeric'}).split(".").reverse().join("-");
        let currentCost = getPreviousDateArr(fillEmptyObj(allOperations), 12).find(obj => obj.date == currentDate).cost;
        let startCost = sortByDate(getPreviousDateArr(fillEmptyObj(allOperations), 12), "increase")[0].cost;
        let startDate = sortByDate(getPreviousDateArr(fillEmptyObj(allOperations), 12), "increase")[0].date;
        let dateDifference = Math.floor((new Date(currentDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
        console.log(startDate, currentDate)
        document.querySelector(".balance-dynamics-chart__total-num").textContent = currentCost;
        document.querySelector(".balance-dynamics-chart__percent").textContent = getPercentDifferenceBetweenNums(startCost, currentCost);
        document.querySelector(".balance-dynamics-chart__percent-name").textContent = matchNumWithWord(dateDifference);

        movableDate.textContent = currentDate;
        movableDate.style.left = x + 10 + "px"

    });

    range1.set("bullet", am5xy.AxisBullet.new(root, {location:0, sprite: resizeButton1}));

    balanceChartObj.chart = chart;
    balanceChartObj.series = series;
    balanceChartObj.xAxis = xAxis;
    balanceChartObj.yAxis = yAxis;
    balanceChartObj.resizeButton1 = resizeButton1;
    balanceChartObj.range1 = range1
}

Promise.all([getDataFromFirestore("categoriesExpenses"), getDataFromFirestore("categoriesExpensesByDate"),getDataFromFirestore("categoriesIncome"), getDataFromFirestore("categoriesIncomeByDate"),  getDataFromFirestore("operationsExpenses"), getDataFromFirestore("operationsExpensesByDate"), getDataFromFirestore("operationsIncome"), getDataFromFirestore("operationsIncomeByDate")])
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

            updateChart(absCostInArr(operationsExpenses), xAxis, series, chart);
            changeTrend();

            balanceArr = getPreviousDateArr(fillEmptyObj(allOperations), 12)
            let currentDate = sortByDate(balanceArr, "decrease")[0].date;
            let currentCost = balanceArr.find(obj => obj.date == currentDate).cost;
            let startCost = sortByDate(balanceArr, "increase")[0].cost;
            let startDate = sortByDate(balanceArr, "increase")[0].date;
            let dateDifference = Math.floor((new Date(currentDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
            
            document.querySelector(".balance-dynamics-chart__total-num").textContent = currentCost;
            document.querySelector(".balance-dynamics-chart__percent").textContent = getPercentDifferenceBetweenNums(startCost, currentCost);
            document.querySelector(".balance-dynamics-chart__percent-name").textContent = matchNumWithWord(dateDifference)
            
            balanceChartObj.xAxis.data.setAll(changeDate(getPreviousDateArr(fillEmptyObj(allOperations), 12)));
            balanceChartObj.series.data.setAll(changeDate(getPreviousDateArr(fillEmptyObj(allOperations), 12)));
            balanceChartObj.series.appear(1000);
            balanceChartObj.chart.appear(1000, 100);
        })

function updateChart(arr, xAxis, series, chart) {
    var data = transformAllOperationsToObjectsForChartBar(transformOperationsSortedByMounth(sortByDate(arr, "increase")));
    trendArr = setBg(uniteArrOfOperationsAndArrOfMounths(getPreviousMounths(), data));
    xAxis.data.setAll(trendArr);
    series.data.setAll(trendArr);
    console.log(data, trendArr)

    series.appear();
    chart.appear(1000, 100);
}

function getDataFromFirestore(collection) {
    const firestoreUrl = `https://database-fc7b1-default-rtdb.europe-west1.firebasedatabase.app/users/${userEmail}/${collection}.json`;

    return fetch(firestoreUrl)
}

function sortByDate(arr, typeOfSorting) {
    if (typeOfSorting == "decrease") {
        return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    } 
    else if (typeOfSorting == "increase") {
        return arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
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

function getPreviousMounths() {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
      
    let previousMonths = [];
    for (let i = 0; i < 12; i++) {
        let month = currentMonth - i;
        let year = currentYear;
        if (month < 0) {
            month += 12;
            year -= 1;
        }
        const monthName = new Date(year, month, 1).toLocaleString('ru', { month: 'long' });
        previousMonths.push(`${monthName}, ${year}`);
    }

    return previousMonths.map((date) => {
        return { cost: 0, date: date };
    });
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

function absCostInArr(arr) {
    let newArr = []
    for (let obj of arr) {
        newArr.push({...obj, cost: Math.abs(obj.cost)})
    }

    return newArr;
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
                    updateChart(absCostInArr(operationsExpenses), xAxis, series, chart)
                } else if (dropdownInput.value == "income") {
                    updateChart(operationsIncome, xAxis, series, chart)
                } else if (dropdownInput.value == "netIncome") {
                    updateChart(allOperations, xAxis, series, chart)
                }
            }

            changeTrend()

            if (item.closest(".select-time-balance")) {
                let currentDate = sortByDate(getPreviousDateArr(fillEmptyObj(allOperations), +dropdownInput.value), "decrease")[0].date;
                let currentCost = getPreviousDateArr(fillEmptyObj(allOperations), +dropdownInput.value).find(obj => obj.date == currentDate).cost;
                let startCost = sortByDate(getPreviousDateArr(fillEmptyObj(allOperations), +dropdownInput.value), "increase")[0].cost;
                let startDate = sortByDate(getPreviousDateArr(fillEmptyObj(allOperations), +dropdownInput.value), "increase")[0].date;
                let dateDifference = Math.floor((new Date(currentDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
                
                document.querySelector(".balance-dynamics-chart__total-num").textContent = currentCost;
                document.querySelector(".balance-dynamics-chart__percent").textContent = getPercentDifferenceBetweenNums(startCost, currentCost);
                document.querySelector(".balance-dynamics-chart__percent-name").textContent = matchNumWithWord(dateDifference)

                balanceChartObj.range1.set("value", new Date(currentDate).getTime());

                movableDate.textContent = currentDate;
                movableDate.style.left = "calc(100% - 110px)"

                balanceChartObj.resizeButton1.events.on("dragged", function () {
                    var x = balanceChartObj.resizeButton1.x();
                    var position = balanceChartObj.xAxis.toAxisPosition(x / balanceChartObj.chart.plotContainer.width());
                    var value = balanceChartObj.xAxis.positionToValue(position);
            
                    balanceChartObj.range1.set("value", value);
            
                    let currentDate = new Date(value).toLocaleString("ru", {year: 'numeric', month: 'numeric', day: 'numeric'}).split(".").reverse().join("-");
                    let currentCost = getPreviousDateArr(fillEmptyObj(allOperations), +dropdownInput.value).find(obj => obj.date == currentDate).cost;
                    let startCost = sortByDate(getPreviousDateArr(fillEmptyObj(allOperations), +dropdownInput.value), "increase")[0].cost;
                    let startDate = sortByDate(getPreviousDateArr(fillEmptyObj(allOperations), +dropdownInput.value), "increase")[0].date;
                    let dateDifference = Math.floor((new Date(currentDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
                    
                    document.querySelector(".balance-dynamics-chart__total-num").textContent = currentCost;
                    document.querySelector(".balance-dynamics-chart__percent").textContent = getPercentDifferenceBetweenNums(startCost, currentCost);
                    document.querySelector(".balance-dynamics-chart__percent-name").textContent = matchNumWithWord(dateDifference)

                    movableDate.textContent = currentDate;
                    movableDate.style.left = x + 10 + "px"
                });

                balanceChartObj.xAxis.data.setAll(changeDate(getPreviousDateArr(fillEmptyObj(allOperations), +dropdownInput.value)));
                balanceChartObj.series.data.setAll(changeDate(getPreviousDateArr(fillEmptyObj(allOperations), +dropdownInput.value)));
                balanceChartObj.range1.set("value", new Date().getTime());
                balanceChartObj.series.appear(1000);
                balanceChartObj.chart.appear(1000, 100);
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

function getPreviousDateArr(arr, months) {
    const month = new Date(arr[arr.length - 1].date).getMonth() - months
    const date = new Date(new Date(arr[arr.length - 1].date).getFullYear(), month, new Date(arr[arr.length - 1].date).getDate()).toLocaleString("ru", {year: "numeric", month: "numeric", day:"numeric"}).split(".").reverse().join("-");

    return arr.filter(obj => new Date(obj.date) >= new Date(date));
}