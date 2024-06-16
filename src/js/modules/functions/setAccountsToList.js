import getPreviousDateArr from "./getPreviousDateArr";
import sortByDate from './sortByDate';

function setAccountsToList(arr, blockToPasteClassName, chartsArr, accountClassName, isAddAccount) {
    let blockToPaste = document.querySelector(`.${blockToPasteClassName} .swiper-wrapper`);

    blockToPaste.querySelectorAll(".swiper-slide").forEach(block => {
        block.remove()
    })

    for (let i = 0; i < arr.length; i++) {
        let itemCategory = `<div class="swiper-slide">
        <div class="account ${accountClassName}" style="background-color: ${arr[i].bg};" data-index="${arr[i].index}">
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

    if (isAddAccount) {
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
    
    function changeDate(arr) {
        for (let obj of arr) {
            obj.date = Date.parse(obj.date)
        }
        return arr;
    }
}

export default setAccountsToList;