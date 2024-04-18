import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

function airDatepicker() {
    let dateOperationExpenses = new AirDatepicker('#date-operation-expenses', {
        inline: false,
        position:'right top',
        container: '.popup-operation-datepicker'
    })
}

export default airDatepicker;