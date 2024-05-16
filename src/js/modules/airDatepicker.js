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

    let dateOperationExpenses = new AirDatepicker('#date-operation', {
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
}

export default airDatepicker;