function setDataToChartPieCategories(arr, chart) {
    let titles = [];
    let bgArr = [];
    let costArr = [];

    arr.forEach(item => {
        titles.push(item.title);
        bgArr.push(item.bg);

        if (item.cost == 0) {
            costArr.push(1);
        } else {
            costArr.push(Math.abs(item.cost));
        }
    })

    chart.data.labels = titles;
    chart.data.datasets[0].data = costArr;
    chart.data.datasets[0].backgroundColor = bgArr;
    chart.update();
}

export default setDataToChartPieCategories;