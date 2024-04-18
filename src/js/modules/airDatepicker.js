import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

function airDatepicker() {
    let dateOperationExpenses = new AirDatepicker('#date-operation-expenses', {
        inline: false,
        position:'right top',
        container: '.popup-operation-datepicker'
    })

    let dateOperationIncome = new AirDatepicker('#date-operation-income', {
        inline: false,
        position:'right top',
        container: '.popup-operation-datepicker_income'
    })
}

export default airDatepicker;