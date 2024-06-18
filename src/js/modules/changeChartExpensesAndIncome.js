import noDataToggle from "./no-data";

function changeChart(arr, chart, series, xAxis, noDataToggle) {

        if (noDataToggle) noDataToggle();
        let uniteArr = arr.reduce((acc, obj) => {
            const key = obj.date;
            if (!acc[key]) acc[key] = {date: key, cost: 0};
            acc[key].cost += Math.abs(obj.cost);
            return acc;
        }, {})

        const resultArray = Object.values(uniteArr);

        for (let obj of resultArray.reverse()) {
            for (let key of Object.keys(obj)) {
                if (obj[key] != obj.cost && obj[key] != obj.date) {
                    delete obj[key]
                }
            }
        }
      
        xAxis.data.setAll(resultArray);
        series.data.setAll(resultArray);
        
        series.appear(1000);
}

export default changeChart;