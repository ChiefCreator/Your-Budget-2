function expandOperation() {
    window.addEventListener("click", function(e) {
        if (e.target.closest(".expand-operation")) {
            let operation = e.target.closest(".expand-operation");
            let activeOperation = document.querySelector(".expand-operation_open");

            if (activeOperation && activeOperation != operation) {
                activeOperation.classList.remove("expand-operation_open")
            }
            operation.classList.toggle("expand-operation_open")
        }
        else {
            document.querySelectorAll(".expand-operation").forEach(item => item.classList.remove("expand-operation_open"))
        }
    })
}

export default expandOperation;