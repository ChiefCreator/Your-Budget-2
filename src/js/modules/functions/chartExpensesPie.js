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

export default chartExpensesPie;