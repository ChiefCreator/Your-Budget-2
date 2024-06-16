import Chart from 'chart.js/auto';

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

export default chartIncomePie;