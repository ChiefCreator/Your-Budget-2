import { slice } from "@amcharts/amcharts5/.internal/core/util/Array";

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

let trendArr = []

let dateText = document.querySelector(".main-date__value");
let currentDate = new Date().getFullYear() + "-" + ("0" + (+(new Date()).getMonth() + 1)).slice(-2);
if (!localStorage.getItem("currentDate")) {
    localStorage.setItem("currentDate", currentDate); 
}
dateText.textContent = transformDate(localStorage.getItem("currentDate"))

let userEmail = localStorage.getItem("email").replace(".", "*");

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
    fill: "green"
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
            
            allOperations = operationsExpenses.concat(operationsIncome);
            allCategories = categoriesExpenses.concat(categoriesIncome);

            updateChart(absCostInArr(operationsExpenses), xAxis, series, chart);
            changeTrend();
        })

function updateChart(arr, xAxis, series, chart) {
    var data = transformAllOperationsToObjectsForChartBar(transformOperationsSortedByMounth(sortByDate(arr, "increase")));
    trendArr = setBg(uniteArrOfOperationsAndArrOfMounths(getPreviousMounths(), data));
    xAxis.data.setAll(trendArr);
    series.data.setAll(trendArr);

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
    let wholePercentDifference = getPercentDifference(sortedTrendArr)
    let monthPercentDifference = getAveragePercentDifference(sortedTrendArr)

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
    function getPercentDifference(arr) {
        if (arr[0].cost < 0) {
            return Math.abs(Math.floor(((arr[arr.length - 1].cost - arr[0].cost) / arr[0].cost) * 100)) + "%";
        }
        return Math.floor(((arr[arr.length - 1].cost - arr[0].cost) / arr[0].cost) * 100) + "%";
    }
    function getAveragePercentDifference(arr) {
        if (arr[0].cost < 0) {
            let difference = ((arr[arr.length - 1].cost - arr[0].cost) / arr[0].cost) * 100;
            return Math.abs(Math.floor(difference / arr.length)) + "%";
        }
        let difference = ((arr[arr.length - 1].cost - arr[0].cost) / arr[0].cost) * 100;
        return Math.floor(difference / arr.length) + "%";
    }

    function setValueToHtml(value, teg) {
        if (value == "Infinity%" || value == "-Infinity%") {
            teg.textContent = "Н/д";
            teg.style.color = "black";
        } else {
            if (value.includes("-")) teg.style.color = "red"
            if (!value.includes("-")) teg.style.color = "#31a51f"
            teg.textContent = value
        }
    }
}
