import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import Chart from 'chart.js/auto';

// добавление нового счета

let accountObject = {};
let accountArr = [];

let chartsArr = [];
let chartDynamicOfAccounts = {};
let chartPieObject = {};

let btnAddAccount = document.querySelector(".add-accounts");
let popupAddAccount = document.querySelector(".popup-accounts-done");
let overblock = document.querySelector(".overblock");

const chartBalance = new Chart(document.getElementById('balance-chart'), {
    type: 'doughnut',
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
const swiperAcoounts = new Swiper('.swiper-accounts', {
    speed: 600,
    spaceBetween: 15,
    slidesPerView: 2,
    loop: true,
    navigation: {
        nextEl: '.swiper-buttons-accounts .swiper-buttons__button_next',
        prevEl: '.swiper-buttons-accounts .swiper-buttons__button_prev',
    },
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

let userEmail = localStorage.getItem("email").replace(".", "*");

Promise.all([getDataFromFirestore("accounts")])
        .then(response => {
            return Promise.all([response[0].json()]);
        })
        .then(data => {
            accountArr = (data[0] != null) ? data[0] : [];
            pieChart();
            changePieChart(setBgTemplateField(accountArr), chartPieObject.series1, chartPieObject.series2, chartPieObject.legend, chartPieObject.label);
            setAccountsToList(accountArr);
       
            initXYChartWithManyLines();
        })

// инициализация готовых счетов
initChart("chartCashDone", [])
initChart("chartCardDone", [])
initChart("chartSavingsDone", [])
initChart("chartCreditDone", [])
initChart("chartDebtDone", [])
// инициализация счетов
// initChart("chartCash")
// initChart("chartCard")
// initChart("chartCredit")
function initChart(chartId, data) {
    if (!data || data.length <= 1) {
        data = [
            { cost: 500, date: '2023-01-28' },
            { cost: 0, date: '2024-05-27' },
            { cost: 90, date: '2023-05-26' },
            { cost: 0, date: '2024-05-25' },
            { cost: 350, date: '2023-08-24' },
            { cost: 0, date: '2024-05-23' },
            { cost: -100, date: '2024-01-01' },
            { cost: 0, date: '2024-05-21' },
            { cost: -60, date: '2024-03-20' },
            { cost: 0, date: '2024-05-19' },
            { cost: 0, date: '2024-05-18' },
            { cost: -20, date: '2024-05-17' },
            { cost: 0, date: '2024-05-16' },
            { cost: 0, date: '2024-05-15' },
            { cost: 0, date: '2024-05-14' },
            { cost: 0, date: '2024-05-13' },
            { cost: 2000, date: '2024-05-12' },
            { cost: 0, date: '2024-05-11' },
            { cost: 0, date: '2024-05-10' },
            { cost: -50, date: '2024-05-09' },
            { cost: 300, date: '2024-05-08' },
        ];
    }

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
        renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 80,
            minorGridEnabled: true,
            pan: "zoom"
          }),
        //   tooltip: am5.Tooltip.new(root, {})
    }));
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, {
            pan: "zoom"
        }),
    }));

    for (let i = 0; i < accountArr.length; i++) {
        if (!accountArr[i].operations) continue;
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

btnAddAccount.addEventListener("click", function() {
    popupAddAccount.classList.add("popup-accounts-done_open");
    overblock.classList.add("overblock_open");
})
overblock.addEventListener("click", function() {
    popupAddAccount.classList.remove("popup-accounts-done_open");
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
        <div class="account" style="background-color: ${accountObject.bg};" data-index="${accountObject.index}">
            <header class="account__header">
                <span class="account__icon account__${accountObject.icon}" style="background-color: ${accountObject.iconBg};"></span>
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

    function parser(itemCategory) {
        var parser = new DOMParser();
        let teg = parser.parseFromString(itemCategory, 'text/html');
        let item = teg.querySelector(".swiper-slide");
        return item;
    }
    blockToPaste.append(parser(itemCategory))
    initChart(accountObject.chartId, accountObject.operations)
}

function setAccountsToList(arr) {
    let blockToPaste = document.querySelector(`.swiper-accounts .swiper-wrapper`);

    blockToPaste.querySelectorAll(".swiper-slide").forEach(block => {
        block.remove()
    })

    for (let i = 0; i < arr.length; i++) {
        let itemCategory = `<div class="swiper-slide">
        <div class="account" style="background-color: ${arr[i].bg};" data-index="${arr[i].index}">
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
    root.setThemes([am5themes_Animated.new(root)]);
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
    var label = root.tooltipContainer.children.push(am5.Label.new(root, {
        x: am5.percent(28.5),
        y: am5.p50,
        centerX: am5.p50,
        centerY: am5.p50,
        fill: am5.color(0x000000),
        fontSize: 30
    }));

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