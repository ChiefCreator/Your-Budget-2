import Chart from 'chart.js/auto';
const ctxExpensesAndIncome = document.getElementById('chartBar');
const chartExpensesAndIncome = new Chart(ctxExpensesAndIncome, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [
            {
                type: 'bar',
                label: 'Dataset 1',
                backgroundColor: [],
                data: [],
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

function changeChart(arr) {

    operationToChart(arr)

    function operationToChart(arr) {
        let objDateKey = createObjDateKey(arr.reverse())
        
        let titles = [];
        for (let date in objDateKey) {
            objDateKey[date].forEach(item => {
                if (!titles.includes(item.title)) {
                    titles.push(item.title);
                }
            });
        }
        
        let costArray = {};
        titles.forEach(title => {
            costArray[title] = [];
            
            for (let key in objDateKey) {
                let totalCost = objDateKey[key].reduce((acc, curr) => curr.title === title ? acc + curr.cost : acc, 0);

                costArray[title].push(totalCost);
            }
        });

        let OperationSumCosts = []
        for (let value of Object.values(costArray)) {
            OperationSumCosts.push(value)
        }

        let bgArray = [];
        for (let date in objDateKey) {
            objDateKey[date].forEach(item => {
                if (!bgArray.includes(item.bg)) {
                    bgArray.push(item.bg);
                }
            })
        }

        let arrDate = []
        for (let key of Object.keys(objDateKey)) {
            arrDate.push(key);
        }

        chartExpensesAndIncome.data.datasets= []
        chartExpensesAndIncome.update();

        chartExpensesAndIncome.data.labels = arrDate
        for (let i = 0;i < OperationSumCosts.length;i++) {
            if (!chartExpensesAndIncome.data.datasets[i]) {
                chartExpensesAndIncome.data.datasets.push({type: 'bar',
                label: 'Dataset 1',
                backgroundColor: [],
                data: [],})
            }

            chartExpensesAndIncome.data.datasets[i].data = OperationSumCosts[i];
            chartExpensesAndIncome.data.datasets[i].backgroundColor = bgArray[i];
        }
        chartExpensesAndIncome.update();

        console.log(titles, costArray, OperationSumCosts, bgArray, arrDate)
    }

    function createObjDateKey(arr) {
        let newObjDate = {};
        arr.forEach(item => {
            if (!newObjDate[item.date]) {
                newObjDate[item.date] = [item];
            } else {
                newObjDate[item.date].push(item);
            }
        });

        return newObjDate;
    }
}

export default changeChart;