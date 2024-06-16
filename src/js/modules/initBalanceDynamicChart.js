function initbalanceDynamicChart(obj) {
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
    let xPos = 0;
    let movableDate = document.querySelector(".balance-dynamics-chart__date-wrapper");
    resizeButton1.adapters.add("x", function (x) {
        xPos = Math.max(0, Math.min(chart.plotContainer.width(), x))
        movableDate.style.left = xPos + "px";
        return xPos;
    });

    range1.set("bullet", am5xy.AxisBullet.new(root, {location:0, sprite: resizeButton1}));

    obj.chart = chart;
    obj.series = series;
    obj.xAxis = xAxis;
    obj.yAxis = yAxis;
    obj.resizeButton1 = resizeButton1;
    obj.range1 = range1;
}

export default initbalanceDynamicChart;