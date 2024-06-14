import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

function airDatepicker() {
    let overblockDatePicker = document.querySelector(".overblock-date-picker");
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

    let dateOperationExpensesSettings = {
        inline: false,
        position:'left top',
        container: '.popup-operation-datepicker',
        dateFormat: 'yyyy-MM-dd',
        isVisibleMY: false,
        onSelect: ({date, formattedDate, datepicker}) => {
            if (formattedDate) {
                document.querySelector(".input-date__input").value = formattedDate
                return;
            }
            document.querySelector(".input-date__input").value = "";
        },
    }
    if (parseFloat(window.innerWidth) <= 650) {
        dateOperationExpensesSettings.container = '.air-datepicker-global-container'
        dateOperationExpensesSettings.isMobile = true
        dateOperationExpensesSettings.autoClose = true
    }
    let dateButton = document.querySelector(".popup-operation-datepicker");
    dateButton.addEventListener("click", function() {
        overblockDatePicker.classList.add("overblock-date-picker_open");
        dateOperationExpensesSettings.isVisibleMY = true;
        if (dateOperationExpenses) dateOperationExpenses.show();
    })
    overblockDatePicker.addEventListener("click", function() {
        overblockDatePicker.classList.remove("overblock-date-picker_open");
        if (dateOperationExpensesSettings.isVisibleMY) {
            dateOperationExpenses.hide();
            dateOperationExpensesSettings.isVisibleMY = false;
        }
    })

    let dateOperationExpenses = new AirDatepicker('#date-operation', dateOperationExpensesSettings)
}

export default airDatepicker;