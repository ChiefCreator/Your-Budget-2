function showSuccess(title = "Успешно") {
    let success = document.querySelector(".popup-success");
    success.querySelector(".popup-success__text").textContent = title;

    success.classList.add("popup-success_act");
    setTimeout(function(){
        success.classList.remove("popup-success_act");
    }, 2000)
}

export default showSuccess;