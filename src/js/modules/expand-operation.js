function expandOperation() {
    window.addEventListener("click", function(e) {
        if (e.target.closest(".expand-operation")) {
            let operation = e.target.closest(".expand-operation");
            if (e.target.closest(".item-category__head")) {
                operation.querySelector(".item-category__footer").classList.toggle("item-category__footer_act");
                operation.querySelector(".item-category__head").classList.toggle("item-category__head_act");
            }
        }
    })
}

export default expandOperation;