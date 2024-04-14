function showError(title = "Ошибка") {
    let error = document.querySelector(".popup-error");
    error.querySelector(".popup-error__text").textContent = title;

    error.classList.add("popup-error_act");
    setTimeout(function(){
        error.classList.remove("popup-error_act");
    }, 2000)
}

export default showError;