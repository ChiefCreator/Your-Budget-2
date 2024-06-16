function initXYChartOperations(obj) {
    var root = am5.Root.new("chartdiv");
    root.setThemes([am5themes_Animated.new(root)]);
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      paddingLeft: 0
    }));
    chart.get("colors").set("colors", [am5.color(133054)]);
      
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {behavior: "none"}));
    cursor.lineY.set("visible", false);
    
    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 1,
        categoryField: "date",
        renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 80,
            minorGridEnabled: true,
            pan: "zoom"
        }),
    }));
    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, {}),
    }));

    let tooltip = am5.Tooltip.new(root, {
        getFillFromSprite: false,
        labelText: "{categoryX}: {valueY}",
        getFillFromSprite: false,
    });
    tooltip.get("background").setAll({
        fill: am5.color("#133054"),
        fillOpacity: 1,
        stroke: am5.color("#133054"),
        strokeOpacity: 0
    });

    chart.zoomOutButton.set("forceHidden", true);
    
    var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "cost",
        categoryXField: "date",
        tooltip: tooltip,
        stroke: "#0912cc"
    }));
    series.fills.template.setAll({
        visible: true,
        fillOpacity: 0.3,
    });
    series.set("fill", am5.color("#0912cc"));
    series.bullets.push(function () {
        return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Circle.new(root, {
                radius: 2,
                fill: "#0912cc"
            })
        });
    });
    
    obj.chart = chart;
    obj.series = series;
    obj.xAxis = xAxis;
    
    chart.appear(1000, 100);
}

export default initXYChartOperations;