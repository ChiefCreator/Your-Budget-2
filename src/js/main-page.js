import categoriesSlide from "./modules/categories-slide";
import addCategoryExpenses from "./modules/addCategoryExpenses";
import expandOperation from "./modules/expand-operation";
import inputTextarrea from "./modules/inputTextarrea";
import airDatepicker from "./modules/airDatepicker";
import Chart from 'chart.js/auto';
import sliders from "./modules/sliders";

const chartExpensesPie = new Chart(document.getElementById('chartExpensesPie'), {
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
const chartIncomePie = new Chart(document.getElementById('chartIncomePie'), {
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

    var root = am5.Root.new("chartdiv");
    
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft: 0
    }));
    
    chart.get("colors").set("colors", [
        am5.color(133054),
    ]);
      
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none"
    }));
    cursor.lineY.set("visible", false);
    
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
    
    var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "cost",
        categoryXField: "date",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueX} {valueY}"
        })
    }));
    
    series.fills.template.setAll({
        visible: true,
        fillOpacity: 0.3,
        fill: "#133054"
    });
    
    series.bullets.push(function () {
        return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Circle.new(root, {
                radius: 2,
                fill: "#133054"
            })
        });
    });
    
    chart.appear(1000, 100);

categoriesSlide();
addCategoryExpenses(chartExpensesPie, chartIncomePie, chart, series, xAxis);
airDatepicker();
expandOperation();
inputTextarrea();
sliders();


// statistics slider
import Swiper from 'swiper/bundle';
const swiper = new Swiper('.swiper-statistics-slider', {
    speed: 600,
    spaceBetween: 15,
    slidesPerView:3,
    loop: true,
    navigation: {
        nextEl: '.swiper-statistics__button_next',
        prevEl: '.swiper-statistics__button_prev',
      },
})