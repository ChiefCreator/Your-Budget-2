import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

function airDatepicker() {
    let dateOperationExpenses = new AirDatepicker('#date-operation-expenses', {
        inline: false,
        position:'right top',
        container: '.popup-operation-datepicker',
        dateFormat: 'yyyy-MM-dd',
    })

    let dateOperationIncome = new AirDatepicker('#date-operation-income', {
        inline: false,
        position:'right top',
        container: '.popup-operation-datepicker_income',
        dateFormat: 'yyyy-MM-dd',
    })
}

export default airDatepicker;