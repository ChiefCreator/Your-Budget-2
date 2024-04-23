import categoriesSlide from "./modules/categories-slide";
import addCategoryExpenses from "./modules/addCategoryExpenses";
import addCategoryIncome from "./modules/addCategoryIncome";
import expandOperation from "./modules/expand-operation";
import airDatepicker from "./modules/airDatepicker";
import Chart from 'chart.js/auto';

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

categoriesSlide();
addCategoryExpenses(chartExpensesPie);
addCategoryIncome(chartIncomePie);
airDatepicker();
expandOperation();