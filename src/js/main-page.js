import categoriesSlide from "./modules/categories-slide";
import addCategoryExpenses from "./modules/addCategoryExpenses";
import addCategoryIncome from "./modules/addCategoryIncome";
import addOperationincome from "./modules/addOperationIncome";
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
addOperationincome(chartIncomePie);
airDatepicker();
expandOperation();
// addMoreOperationsIncome();




// const ctxExpensesAndIncome = document.getElementById('chartBar');
// const chartExpensesAndIncome = new Chart(ctxExpensesAndIncome, {
//     type: 'bar',
//     data: {
//         labels: ["May", "September", "December", "January","May", "September", "December", "January","May", "September", "December", "January","May", "September", "December", "January","May", "September", "December", "January","May", "September", "December", "January","May", "September", "December", "January"],
//         datasets: [
//             {
//                 type: 'bar',
//                 label: 'Dataset 1',
//                 backgroundColor: ["red", "blue"],
//                 data: [100, 300, 450, 200, 100, 300, 450, 200,100, 300, 450, 200,],
//             },
//         ]
//     },
//     options: {
//       plugins: {
//         title: {
//           text: 'Chart.js Combo Time Scale',
//           display: false
//         },
//         legend: {
//             display: false
//         },
//       },
//       scales: {
//         x: {
//             ticks: {
//                 stepSize: 2
//             }
//         },
//     },
//     },
// });