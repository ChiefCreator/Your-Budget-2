import functionalOnOperationsPage from "./modules/functionalOnOperationsPage";
import expandOperation from "./modules/expand-operation";
import toggleFilter from './modules/toggle-filter';

// инициализация графика
var root = am5.Root.new("chartExpensesAndIncomeBar"); 
root.setThemes([
  am5themes_Animated.new(root)
]);
var chart = root.container.children.push(am5xy.XYChart.new(root, {
  panX: false,
  panY: false,
  paddingLeft: 0,
  wheelX: "panX",
  wheelY: "zoomX",
  layout: root.verticalLayout
}));
var xRenderer = am5xy.AxisRendererX.new(root, {
  cellStartLocation: 0.1,
  cellEndLocation: 0.9,
  minorGridEnabled: true
})
var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
  categoryField: "date",
  renderer: xRenderer,
  tooltip: am5.Tooltip.new(root, {})
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