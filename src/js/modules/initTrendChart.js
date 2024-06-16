import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";

function initTrendChart(obj) {
    var root = am5.Root.new("trend-chart"); 
    const responsive = am5themes_Responsive.new(root);
    responsive.addRule({
        relevant: function(width, height) {
            return width < 550;
        },
        applying: function() {
            xAxis.set("start", 0.75);
        },
        removing: function() {
            xAxis.set("start", 0.5);
        }
    });
    root.setThemes([
        am5themes_Animated.new(root), responsive
    ]);
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 0,
        layout: root.verticalLayout
    }));
    chart.responsive = {
        "enabled": true
      };
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

    obj.chart = chart;
    obj.series = series;
    obj.xAxis = xAxis;
    obj.yAxis = yAxis;
}

export default initTrendChart;