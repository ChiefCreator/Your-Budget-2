import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

function airDatepicker() {
    function formatDate(date) {
        const year = date.getFullYear();

        let month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }

        let day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }

        return `${year}-${month}-${day}`;
    }
    document.querySelector(".input-date__input").value = formatDate(new Date());
    document.querySelector(".input-date__input_income").value = formatDate(new Date());
    document.querySelector(".popup-change-operation_expenses .input-date__input").value = formatDate(new Date());
    document.querySelector(".popup-change-operation_income .input-date__input").value = formatDate(new Date());

    let dateOperationExpenses = new AirDatepicker('#date-operation-expenses', {
        inline: false,
        position:'left top',
        container: '.popup-operation-datepicker',
        dateFormat: 'yyyy-MM-dd',
        onSelect: ({date, formattedDate, datepicker}) => {
            if (formattedDate) {
                document.querySelector(".input-date__input").value = formattedDate
                return;
            }
            document.querySelector(".input-date__input").value = "";
        },
    })

    let dateOperationIncome = new AirDatepicker('#date-operation-income', {
        inline: false,
        position:'left top',
        container: '.popup-operation-datepicker-income',
        dateFormat: 'yyyy-MM-dd',
        onSelect: ({date, formattedDate, datepicker}) => {
            if (formattedDate) {
                document.querySelector(".input-date__input_income").value = formattedDate
                return;
            }
            document.querySelector(".input-date__input_income").value = "";
        },
    })

    let dateOperationExpensesChange = new AirDatepicker('#date-operation-change-expenses', {
        inline: false,
        position:'left top',
        container: '.popup-operation-datepicker-change-expenses',
        dateFormat: 'yyyy-MM-dd',
        onSelect: ({date, formattedDate, datepicker}) => {
            if (formattedDate) {
                document.querySelector(".popup-change-operation_expenses .input-date__input").value = formattedDate
                return;
            }
            document.querySelector(".popup-change-operation_expenses .input-date__input").value = "";
        },
    })

    let dateOperationIncomeChange = new AirDatepicker('#date-operation-change-income', {
        inline: false,
        position:'left top',
        container: '.popup-operation-datepicker-change-income',
        dateFormat: 'yyyy-MM-dd',
        onSelect: ({date, formattedDate, datepicker}) => {
            if (formattedDate) {
                document.querySelector(".popup-change-operation_income .input-date__input").value = formattedDate
                return;
            }
            document.querySelector(".popup-change-operation_income .input-date__input").value = "";
        },
    })
}

export default airDatepicker;