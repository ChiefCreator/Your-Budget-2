function toggleFilter() {
    let buttonSpollers = document.querySelectorAll(".button-spoller");
    buttonSpollers.forEach(button => {
        button.addEventListener("click", function() {
            let spoller = this.nextElementSibling;
            spoller.classList.toggle("spoller_active");
        })
    })
}

export default toggleFilter;