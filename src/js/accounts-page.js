import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import Chart from 'chart.js/auto';

// добавление нового счета

let accountObject = {};
let accountArr = [];
let chartsArr = [];

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
            setAccountsToList(accountArr);
            chart(accountArr, chartBalance);
            changeBalance(accountArr);
            console.log(accountArr)
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
    if (!data || data.length <= 1) data = [{date: "1",cost: 1,}, {date: "2",cost: 4,}, {  date: "3",  cost: 3,}, {    date: "4",    cost: 7,}, {    date: "5",    cost: 2,}, {    date: "6",    cost: 9,}, {    date: "7",    cost: 14,}, {    date: "8",    cost: 10,}, {    date: "9",    cost: 17,}, {    date: "10",    cost: 13,}];

    var root = am5.Root.new(chartId);   
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      paddingLeft: 0
    }));
    chart.get("colors").set("colors", [
        am5.color(15723498),
    ]);

    var xRenderer = am5xy.AxisRendererX.new(root, {
        minGridDistance: 30,
        minorGridEnabled: true,
    });
    var yRenderer = am5xy.AxisRendererY.new(root, {
        minGridDistance: 30,
        minorGridEnabled: true,
    });
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 1,
        categoryField: "date",
        renderer: xRenderer,
        visible: false,
    }));
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: yRenderer,
        visible: false,
    }));
    xRenderer.grid.template.setAll({
        visible: false
    })
    yRenderer.grid.template.setAll({
        visible: false
    })

    var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "cost",
        categoryXField: "date",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueX} {valueY}"
        }),
        stroke: "white",
    }));
    series.fills.template.setAll({
        visible: true,
        fillOpacity: 0.2,
        fill: "#FFFFFF"
    });
    series.bullets.push(function () {
        return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Circle.new(root, {
                radius: 2,
                fill: "white"
            })
        });
    });

    operationToChart(sortByDate(data, "increase"), chart, series, xAxis)
    chart.appear(1000, 100);
    chartsArr.push({root, xRenderer, yRenderer, xAxis, yAxis, series, data, chart});

    function operationToChart(arr, chart, series, xAxis) {
        let uniteArr = arr.reduce((acc, obj) => {
            const key = obj.date;
            if (!acc[key]) acc[key] = {date: key, cost: 0};
            acc[key].cost += obj.cost;
            return acc;
        }, {})

        const resultArray = Object.values(uniteArr);

        for (let obj of resultArray) {
            for (let key of Object.keys(obj)) {
                if (obj[key] != obj.cost && obj[key] != obj.date) {
                    delete obj[key]
                }
            }
        }
        xAxis.data.setAll(resultArray);
        series.data.setAll(resultArray);
        
        series.appear(1000);
    }
}

function initXYChartWithManyLines() {
    var root = am5.Root.new("accounts-general-chart");
    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX:true
    }));
    chart.get("colors").set("step", 3);

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 1,
        categoryField: "date",
        renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 80,
            minorGridEnabled: true,
            pan: "zoom"
          }),
        tooltip: am5.Tooltip.new(root, {})
    }));
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, {
            pan: "zoom"
        })
    }));

    var data = [];
    for (let i = 0; i < accountArr.length; i++) {
        if (!accountArr[i].operations) continue;
        var dataPart = transformAllOperationsToObjectsForXYChart(sortByDate(accountArr[i].operations, "increase"));
        data = data.concat(dataPart)
    }   
    for (let i = 0; i < accountArr.length; i++) {
        if (!accountArr[i].operations) continue;
        makeSeries(sortByDate(data, "increase"), accountArr[i].title, accountArr[i].title, accountArr[i].bg, accountArr[i].iconBg, root, xAxis, yAxis, chart)
    }  
    chart.appear(1000, 100);
}
function makeSeries(data, name, fieldName, bg, iconBg, root, xAxis, yAxis, chart) {
    var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
      name: name,
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: fieldName,
      categoryXField: "date",
      fill: bg,
      stroke: bg,
    }));

    series.fills.template.setAll({
        visible: true,
        fillOpacity: 0.2,
    });

    series.strokes.template.setAll({
        strokeWidth: 3,
      });

    series.set("fill", am5.color(bg));
    
    series.bullets.push(function () {
        return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Circle.new(root, {
                radius: 3,
                fill: iconBg
            })
        });
    });
  
    xAxis.data.setAll(data);
    series.data.setAll(data);
    series.appear();
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
      [arr[0].account]: mergedExpenses[date]
    };
  });
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

        chart(accountArr, chartBalance);
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

function changeBalance(arr) {
    let balance = document.querySelector(".balance__total-num");
    let cost = arr.reduce((acc, obj) => {return  acc + obj.cost}, 0)
    balance.textContent = cost;
}