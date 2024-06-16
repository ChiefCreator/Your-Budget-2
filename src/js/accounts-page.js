import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import Chart from 'chart.js/auto';
import noDataToggle from "./modules/no-data";
import { mergeIf } from 'chart.js/helpers';
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

// добавление нового счета

let accountObject = {};
let accountArr = [];

let chartsArr = [];
let chartDynamicOfAccounts = {};
let chartPieObject = {};
let chartBarObject = {}

let btnAddAccount = document.querySelector(".account-add");
let popupAddAccount = document.querySelector(".popup-accounts");
let overblock = document.querySelector(".overblock");

let accountExample = document.querySelector(".account-example");
let accountExampleTitle = accountExample.querySelector(".account__title");
let accountExampleType = accountExample.querySelector(".account__type")
let accountExampleIcon = accountExample.querySelector(".account__icon");
let inpTitle = popupAddAccount.querySelector(".popup-accounts__input");
let inpType = popupAddAccount.querySelector(".select__input-hidden");
let inpBg = popupAddAccount.querySelector(".input-color__input_bg");
let wrapperInpBg = inpBg.parentElement;
let inpColor = popupAddAccount.querySelector(".input-color__input_color");
let wrapperInpColor = inpColor.parentElement;
let icons = popupAddAccount.querySelectorAll(".popup-accounts__icon");

const swiperAcoounts = new Swiper('.swiper-accounts', {
    speed: 600,
    spaceBetween: 15,
    slidesPerView: 1,
    loop: true,
    navigation: {
        nextEl: '.swiper-buttons-accounts .swiper-buttons__button_next',
        prevEl: '.swiper-buttons-accounts .swiper-buttons__button_prev',
    },
    breakpoints: {
        1050: {
            slidesPerView: 1,
        },
        900: {
            slidesPerView: 2,
        },
        450: {
            slidesPerView: 1.2,
        },
    }
})
const swiperAcoountsDone = new Swiper('.swiper_accounts-done', {
    speed: 600,
    spaceBetween: 0,
    pagination: {
        el: '.pagination_done-accounts',
        type: 'bullets',
        clickable: true,
    },
})
const swiperIcons = new Swiper('.swiper_icons', {
    speed: 600,
    spaceBetween: 0,
    pagination: {
        el: '.pagination_icons',
        type: 'bullets',
        clickable: true,
    },
})

// expenses переменные
let categoriesExpenses = [];
let operationsExpenses = [];
let operationsExpensesByCurrentDate = [];
let categoriesExpensesByCurrentDate = [];
// income переменные 
let categoriesIncome = [];
let operationsIncome = [];
let operationsIncomeByCurrentDate = [];
let categoriesIncomeByCurrentDate = [];

let userEmail = localStorage.getItem("email").replace(".", "*");

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
        addToFirestore(accountArr, "accounts");

        pieChart();
        changePieChart(setBgTemplateField(accountArr), chartPieObject.series1, chartPieObject.series2, chartPieObject.legend, chartPieObject.label);
        setAccountsToList(accountArr);
        initXYChartWithManyLines();

        // инициализация готовых счетов
        initChart("chartCashDone", [])
        initChart("chartCardDone", [])
        initChart("chartSavingsDone", [])
        initChart("chartCreditDone", [])
        initChart("chartDebtDone", [])
        initChart("chartExample", [])

        initAccountChartBar();
    })
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

function fillEmptyObjForBar(operations) {
    let newArr = getPreviousDays(24).map(item => {
        for (let obj of operations) {
            if (obj.date == item.date) {
                item.cost += obj.cost
            }
        }
        return item
    })

    let data = [...newArr].reverse();

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

    return data;
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

function initXYChartWithManyLines() {
    var root = am5.Root.new("accounts-dynamic-chart");
    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: false
    }));

    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none"
      }));
      cursor.lineY.set("visible", false);

    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        baseInterval: {
            timeUnit: "day",
            count: 1
        },
        maxDeviation: 1,
        visible: false,
        renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 200,
            minorGridEnabled: true,
          }),
        strictMinMax: true,
    }));
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        strictMinMax: true,
        renderer: am5xy.AxisRendererY.new(root, {
        }),
    }));

    for (let i = 0; i < accountArr.length; i++) {
        if (!accountArr[i].operations) accountArr[i].operations = []
        makeSeries(sortByDate(accountArr[i].operations, "increase"), accountArr[i].title, accountArr[i].bg, accountArr[i].iconBg, root, xAxis, yAxis, chart, 12)
    }  
    chart.appear(1000, 100);

    chartDynamicOfAccounts = {root, xAxis, yAxis, chart};
}
function makeSeries(data, name, bg, iconBg, root, xAxis, yAxis, chart, monthAmount) {
    var series = chart.series.push(am5xy.LineSeries.new(root, {
      name: name,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "cost",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "{valueY}"
      }),
      stroke: bg,
    }));

    series.strokes.template.setAll({
        strokeWidth: 3,
    });

    xAxis.data.setAll(changeDate(getPreviousDateArr(fillEmptyObj(data), monthAmount)));
    series.data.setAll(changeDate(getPreviousDateArr(fillEmptyObj(data), monthAmount)));
    series.appear();
}

function sortByDate(arr, typeOfSorting) {
    if (typeOfSorting == "decrease") {
        return arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    } 
    else if (typeOfSorting == "increase") {
        return arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
}

window.addEventListener("click", function(e){
    if (e.target.closest(".account-add")) {
        popupAddAccount.classList.add("popup-accounts_open");
        overblock.classList.add("overblock_open");
    }
})
overblock.addEventListener("click", function() {
    popupAddAccount.classList.remove("popup-accounts_open");
    overblock.classList.remove("overblock_open");
})

window.addEventListener("click", (event) => addAccount(event, accountObject, accountArr));

function addAccount(event, accountObject, accountArr) {
    let account = event.target.closest(`.account-choose`);

    if (event.target.closest(`.account-choose`)) {
        chooseCategory(account, accountObject);
    }
    if (event.target.closest(`.popup-accounts-done__button`)) {
        accountArr.push(Object.assign({}, accountObject));
        setAccountToList(accountObject);
        swiperAcoounts.update();
        addToFirestore(accountArr, "accounts");
        changePieChart(setBgTemplateField(accountArr), chartPieObject.series1, chartPieObject.series2, chartPieObject.legend, chartPieObject.label);
    }
    if (event.target.closest(".popup-accounts__button")) {
        setValueToObject(accountObject, setIndex(inpType.value), inpTitle, inpBg, inpColor, inpType, document.querySelector(".popup-accounts__icon.act").dataset.categoryIcon);

        accountArr.push(Object.assign({}, accountObject));
        setAccountToList(accountObject);
        swiperAcoounts.update();
        addToFirestore(accountArr, "accounts");
        changePieChart(setBgTemplateField(accountArr), chartPieObject.series1, chartPieObject.series2, chartPieObject.legend, chartPieObject.label);
    }
}

function chooseCategory(category, accountObject) {
    let actCategory = document.querySelector(`.account-choose_act`);

    if (actCategory && actCategory != category) {
        actCategory.classList.remove(`account-choose_act`);
    }
    category.classList.toggle(`account-choose_act`);
        
    accountObject.type = JSON.parse(category.dataset.accountsDone).type
    accountObject.title = JSON.parse(category.dataset.accountsDone).title
    accountObject.cost = JSON.parse(category.dataset.accountsDone).cost
    accountObject.index = setIndex(JSON.parse(category.dataset.accountsDone).type)
    accountObject.icon = JSON.parse(category.dataset.accountsDone).icon
    accountObject.bg = JSON.parse(category.dataset.accountsDone).bg
    accountObject.color = JSON.parse(category.dataset.accountsDone).color
    accountObject.iconBg = JSON.parse(category.dataset.accountsDone).iconBg
    accountObject.chartId = JSON.parse(category.dataset.accountsDone).chartId
    accountObject.operations = []
}

function setValueToObject(obj, index, inpTitle, inpBg, inpColor, type, icon) {
    obj.index = index;
    obj.title = inpTitle.value;
    obj.iconBg = inpBg.value;
    obj.bg = inpColor.value;
    obj.cost = 0;
    obj.type = type.value;
    obj.icon = icon
    obj.operations = [];
    obj.chartId = `chart${index}`.split(" ").join("");
    return obj;
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

function setAccountToList(accountObject) {
    let blockToPaste = document.querySelector(`.swiper-accounts .swiper-wrapper`);

    let itemCategory = `<div class="swiper-slide">
        <div class="account account-expand" style="background-color: ${accountObject.bg};" data-index="${accountObject.index}">
            <header class="account__header">
                <span class="account__icon ${accountObject.icon}" style="background-color: ${accountObject.iconBg};"></span>
                <div class="account__names">
                    <h3 class="account__title">${accountObject.title}</h3>
                    <p class="account__type">${accountObject.type}</p>
                </div>
            </header>
            <div class="account__body">
                <div class="account__content">
                    <p class="account__total"><span class="account__num">${accountObject.cost}</span> <span class="account__currency">BYN</span></p>
                </div>
                <div class="account__chart">
                    <div class="account__chart-item" id="${accountObject.chartId}"></div>
                </div>
            </div>
            </div>
        </div>`;

    blockToPaste.append(parser(itemCategory))
    initChart(accountObject.chartId, accountObject.operations)

    function parser(itemCategory) {
        var parser = new DOMParser();
        let teg = parser.parseFromString(itemCategory, 'text/html');
        let item = teg.querySelector(".swiper-slide");
        return item;
    }
}

function setAccountsToList(arr) {
    let blockToPaste = document.querySelector(`.swiper-accounts .swiper-wrapper`);

    blockToPaste.querySelectorAll(".swiper-slide").forEach(block => {
        block.remove()
    })

    for (let i = 0; i < arr.length; i++) {
        let itemCategory = `<div class="swiper-slide">
        <div class="account account-expand" style="background-color: ${arr[i].bg};" data-index="${arr[i].index}">
            <header class="account__header">
                <span class="account__icon ${arr[i].icon}" style="background-color: ${arr[i].iconBg};"></span>
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

        blockToPaste.append(parser(itemCategory))
        initChart(arr[i].chartId, arr[i].operations)
    }

    let addAccount = `<div class="swiper-slide">
        <div class="account-add">
            <header class="account-add__header">
                <p class="account-add__name">Добавить счет</p>
            </header>
            <div class="account-add__body">
                <span class="account-add__icon"></span>
            </div>
        </div>
    </div>`
    function parser(itemCategory) {
        var parser = new DOMParser();
        let teg = parser.parseFromString(itemCategory, 'text/html');
        let item = teg.querySelector(".swiper-slide");
        return item;
    }
    blockToPaste.append(parser(addAccount))
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

function changeBalance(arr) {
    return arr.reduce((acc, obj) => {return  acc + obj.cost}, 0)
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

            if (item.closest(".select-period")) {
                chartDynamicOfAccounts.chart.series.clear()
                for (let i = 0; i < accountArr.length; i++) {
                    if (!accountArr[i].operations) continue;
                    makeSeries(sortByDate(accountArr[i].operations, "increase"), accountArr[i].title, accountArr[i].bg, accountArr[i].iconBg, chartDynamicOfAccounts.root, chartDynamicOfAccounts.xAxis, chartDynamicOfAccounts.yAxis, chartDynamicOfAccounts.chart, +dropdownInput.value)
                }  
                chartDynamicOfAccounts.chart.appear(1000, 100);
            }
            if (item.closest(".select-account-period")) {
                let currentAccount = document.querySelector(".account_active");
                let currentAccountArr = findObjectByHtmlIndex(currentAccount, accountArr)
      
                if (currentAccountArr.operations) {
                    setDataToAccountChartBar(currentAccountArr.operations, +dropdownInput.value);
                }
            }
            if (item.closest(".select-period")) {
                accountExampleType.textContent = dropdownInput.value;
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

// pie chart

function pieChart() {
    var root = am5.Root.new("chartdiv");
    const responsive = am5themes_Responsive.new(root);
    responsive.addRule({
        relevant: function(width, height) {
            return width < 450;
        },
        applying: function() {
            chart.set("layout", root.verticalLayout);
            legend.setAll({
                y: null,
                centerY: null,
                x: am5.p50,
                centerX: am5.p50
            });
            label.set("fontSize", "clamp(1.875rem, 0.781rem + 5vw, 2.5rem)")
        },
        removing: function() {
            chart.set("layout", root.horizontalLayout);
            legend.setAll({
                y: am5.p50,
                centerY: am5.p50,
                x: null,
                centerX: null
            });
            label.set("fontSize", "clamp(0.813rem, -1.156rem + 9vw, 2.5rem)")
        }
    });
    root.setThemes([
        am5themes_Animated.new(root), responsive
    ]);
    var chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.horizontalLayout,
        radius: am5.percent(90),
        innerRadius: am5.percent(50)
    }));
    
    var series1 = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: "cost",
      categoryField: "title",
    }));
    series1.slices.template.setAll({
        templateField: "bg",
        stroke: "white",
        strokeWidth: 2
    });
    series1.slices.template.set("toggleKey", "none");
    series1.slices.template.set("tooltipText", "");
    series1.ticks.template.set("forceHidden", true);
    series1.labels.template.set("forceHidden", true);

    var series2 = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "cost",
        categoryField: "title",
    }));
    series2.slices.template.setAll({
        templateField: "bg",
        stroke: "white",
        strokeWidth: 2
    });
    series2.slices.template.set("toggleKey", "none");
    series2.slices.template.set("tooltipText", "");
    series2.ticks.template.set("forceHidden", true);
    series2.labels.template.set("forceHidden", true);
    series2.ticks.template.set("visible", false);

    var legend = chart.children.push(am5.Legend.new(root, {
        centerY: am5.percent(50),
        y: am5.percent(50),
        layout: root.verticalLayout
    }));
    var label = series1.children.push(am5.Label.new(root, {
        text: "${valueSum.formatNumber('#,###.')}",
        fontSize: "clamp(0.813rem, -1.156rem + 9vw, 2.5rem)",
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        populateText: true,
        oversizedBehavior: "fit"
      }));
    series1.onPrivate("width", function(width) {
        label.set("maxWidth", width * 0.7);
      });
      series1.onPrivate("valueSum", function() {
        label.text.markDirtyText();
      });

    chartPieObject = {root, chart, series1, series2, legend, label}
};

function setBgTemplateField(arr) {
    let newArr = []
    for (let obj of arr) {
        newArr.push({...obj, bg: {fill: obj.bg}})
    }

    return newArr;
}

function changePieChart(data, series1, series2, legend, label) {
    noDataToggle(data, document.querySelector(".no-data-chart-balance"), document.querySelector(".no-data-chart-balance").querySelector(".no-data__video"), [document.querySelector(".balance__hide-logo"), document.querySelector("#chartdiv"), document.querySelector(".balance__header")], changeBalance(accountArr))

    let dataPlus = data.filter(obj => obj.cost >= 0);
    let dataMinus = data.filter(obj => obj.cost < 0);

    series1.data.setAll(dataPlus);
    series2.data.setAll(dataMinus);

    let seriesArr = series1.dataItems.concat(series2.dataItems);

    series2.appear(1000, 100);
    series1.appear(1000, 100);

    legend.itemContainers.template.events.on("click", function(ev) {
        let cost = 0;
        for (let i = 0; i < seriesArr.length; i++) {
            setTimeout(function(){
                if (seriesArr[i]._settings.visible) {
                    cost += seriesArr[i].dataContext.cost
                    label.set("text", cost);
                }
            },0)
        }
    });

    legend.data.setAll(seriesArr);
    label.set("text", changeBalance(accountArr));
}

// operations list

function setOperationsToList(arr) {
    // noDataToggle(arr, document.querySelector(".no-data-operations-all"), document.querySelector(".no-data-operations-all").querySelector(".no-data__video"), [document.querySelector(".list-all-operations")])

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

// account chart bar

function initAccountChartBar() {
    var root = am5.Root.new("account-chart"); 
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
        minGridDistance: 50,
    })
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 1,
        categoryField: "date",
        strictMinMax: true,
        renderer: xRenderer,
    }));
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.1
        }),
        strictMinMax: true,
    }));
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "месяцы",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "cost",
        categoryXField: "date",
    }));
    series.columns.template.setAll({
        tooltipText: "{categoryX}: {valueY}",
        width: am5.percent(80),
        tooltipY: 0,
        strokeOpacity: 0,
    });
    series.columns.template.setAll({
        templateField: "bg"
    });

    chartBarObject = {root, xRenderer, xAxis, yAxis, series, chart};
}

function setDataToAccountChartBar(arr, monthAmount) {
    let data = setBg(getPreviousDateArr(fillEmptyObjForBar(arr), monthAmount))
    chartBarObject.xAxis.data.setAll(data);
    chartBarObject.series.data.setAll(data);
    chartBarObject.series.appear(1000);
    chartBarObject.chart.appear(1000, 100);
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

// клик по счетам

let accountStatisticsPopup = document.querySelector(".account-statistics-popup");
window.addEventListener("click", function(event) {
    let account = event.target.closest(".account-expand")
    if (event.target.closest(".account-expand")) {
        account.classList.add("account-expand_active");
        accountStatisticsPopup.classList.add("account-statistics-popup_open");
        let currentAccountArr = findObjectByHtmlIndex(account, accountArr)
      
        if (currentAccountArr.operations) {
            setOperationsToList(sortByDate(currentAccountArr.operations, "decrease"));
            setDataToAccountChartBar(currentAccountArr.operations, 1);
        }

        overblock.classList.add("overblock_open");
    }
})

overblock.addEventListener("click", function() {
    document.querySelector(".select-account-period").querySelector(".select__button-title").textContent = "1 месяц";
    document.querySelector(".account-expand_active").classList.remove("account-expand_active");
    overblock.classList.remove("overblock_open");
    accountStatisticsPopup.classList.remove("account-statistics-popup_open");
})

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

// создание счета

changeColor(icons, inpBg, inpColor, wrapperInpBg, wrapperInpColor, accountExample, accountExampleIcon);

function changeColor(icons, inpBg, inpColor, wrapperInpBg, wrapperInpColor, account, accountIcon) {

    icons.forEach(icon => {
        icon.style.backgroundColor = inpBg.value;
        icon.style.color = inpColor.value; 

        wrapperInpBg.style.backgroundColor = inpBg.value;
        wrapperInpColor.style.backgroundColor = inpColor.value; 
    })

    window.addEventListener("click", function(event) {
        let icon = event.target.closest(".popup-accounts__icon");

        if (event.target.closest(".popup-accounts__icon")) {
            document.querySelectorAll(".popup-accounts__icon").forEach(icon => {
                icon.style.backgroundColor = "#A2A6B4";
                icon.style.color = "white"; 
                icon.classList.remove("act");
                accountExampleIcon.class = "account__icon";
            })

            accountExampleIcon.setAttribute("class", `account__icon ${icon.dataset.categoryIcon}`);
            icon.classList.add("act");
            icon.style.backgroundColor = changeColor(inpBg, inpColor, icon)[0]; 
            account.style.backgroundColor = changeColor(inpBg, inpColor, icon)[1]; 
            accountIcon.style.backgroundColor = changeColor(inpBg, inpColor, icon)[0]; 
        } else if (!event.target.closest(".popup-accounts__block-wrapper") && !event.target.closest(".popup-accounts__icon")) {
            document.querySelectorAll(".popup-accounts__icon").forEach(icon => {
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
        })
        return [bg, color]
    }

    wrapperInpColor.style.border = `2px solid ${inpColor.value}`;
    wrapperInpBg.style.border = `2px solid ${inpBg.value}`;

    function changeBgOFInputs() {
        inpBg.addEventListener("input", function() {
            wrapperInpBg.style.backgroundColor = inpBg.value;
            accountIcon.style.backgroundColor = inpBg.value;

            if (inpBg.value == "#ffffff") {
                wrapperInpBg.style.border = `2px solid #eef0f4`;
            } else {
                wrapperInpBg.style.border = `2px solid ${inpBg.value}`;
            }
        })

        inpColor.addEventListener("input", function() {
            wrapperInpColor.style.backgroundColor = inpColor.value;
            account.style.backgroundColor = inpColor.value;
        
            if (inpColor.value == "#ffffff") {
                wrapperInpColor.style.border = `2px solid #eef0f4`;
            } else {
                wrapperInpColor.style.border = `2px solid ${inpColor.value}`;
            }
        
        })
    }
    changeBgOFInputs();
}

inpTitle.addEventListener("input", function() {
    accountExampleTitle.textContent = inpTitle.value;
})

 // переключение попапов с созданием счетоы

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

 let switchPopupButtons = document.querySelectorAll(".popup-accounts__tab-button");
 let buttonPopup = document.querySelector(".popup-accounts .button")
 switchPopupButtons.forEach(button => {
     button.addEventListener("click", function() {
         let dataTab = button.dataset.tab;
         let currentTab = document.getElementById(dataTab);
         let activeTab = document.querySelector(".popup-accounts__tab_act");
         let activeButton = document.querySelector(".popup-accounts__tab-button_act");

         if (activeTab && activeTab != currentTab) {
             activeTab.classList.remove("popup-accounts__tab_act");
             activeButton.classList.remove("popup-accounts__tab-button_act");
         }

         currentTab.classList.add("popup-accounts__tab_act");
         button.classList.add("popup-accounts__tab-button_act");

         if (currentTab.classList.contains("popup-accounts__tab_create")) {
             buttonPopup.classList.remove("popup-accounts-done__button");
             buttonPopup.classList.add("popup-accounts__button")
             setProgress(0);
             circleNum.textContent = "02";
         } else {
             buttonPopup.classList.add("popup-accounts-done__button");
             buttonPopup.classList.remove("popup-accounts__button")
             setProgress(50);
             circleNum.textContent = "01";
         }
     })
})

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

        addToFirestore(operationsByCurrentDate, `operations${typeXL}ByDate`)
        addToFirestore(categoriesByCurrentDate, `categories${typeXL}ByDate`)
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