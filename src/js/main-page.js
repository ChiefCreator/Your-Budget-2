import categoriesSlide from "./modules/categories-slide";
import addCategoryExpenses from "./modules/addCategoryExpenses";
import addCategoryIncome from "./modules/addCategoryIncome";
import addOperationExpenses from "./modules/addOperationExpenses";
import addOperationincome from "./modules/addOperationIncome";
import expandOperation from "./modules/expand-operation";
import addMoreOperations from "./modules/moreOperationsExpenses";
import addMoreOperationsIncome from "./modules/moreOperationIncome";
import airDatepicker from "./modules/airDatepicker";
import Chart from 'chart.js/auto';

categoriesSlide();
addCategoryExpenses();
addCategoryIncome();
addOperationExpenses();
addOperationincome();
airDatepicker();
expandOperation();
addMoreOperations();
addMoreOperationsIncome();



const ctxExpensesAndIncome = document.getElementById('chartBar');
const chartExpensesAndIncome = new Chart(ctxExpensesAndIncome, {
    type: 'bar',
    data: {
        labels: ["May", "September", "December", "January","May", "September", "December", "January","May", "September", "December", "January","May", "September", "December", "January","May", "September", "December", "January","May", "September", "December", "January","May", "September", "December", "January"],
        datasets: [
            {
                type: 'bar',
                label: 'Dataset 1',
                backgroundColor: ["red", "blue"],
                data: [100, 300, 450, 200, 100, 300, 450, 200,100, 300, 450, 200,],
            },
        ]
    },
    options: {
      plugins: {
        title: {
          text: 'Chart.js Combo Time Scale',
          display: false
        },
        legend: {
            display: false
        },
      },
      scales: {
        x: {
            ticks: {
                stepSize: 2
            }
        },
    },
    },
});