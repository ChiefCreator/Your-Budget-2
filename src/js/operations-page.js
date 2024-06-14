import functionalOnOperationsPage from "./modules/functionalOnOperationsPage";
import expandOperation from "./modules/expand-operation";
import toggleFilter from './modules/toggle-filter';
import tabletMenu from "./modules/tabletMenu";

// инициализация графика
var root = am5.Root.new("chartExpensesAndIncomeBar"); 
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
  cellStartLocation: 0.1,
  cellEndLocation: 0.9,
  minorGridEnabled: true,
  pan: "zoom"
})
var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "date",
  renderer: xRenderer,
}));
xRenderer.grid.template.setAll({
  location: 1
})
var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
  renderer: am5xy.AxisRendererY.new(root, {
    strokeOpacity: 0.1
  })
}));

// функции
functionalOnOperationsPage(chart, root, xAxis, yAxis);
expandOperation();
tabletMenu()