function validationForm(form) {
    let emailInput = form.querySelector(".form-input-container__input_email");
    let passwordInput = form.querySelector(".form-input-container__input_password");
    let nameInput = form.querySelector(".form-input-container-double__input");
    let surnameInput = form.querySelector(".form-input-container-double__input_surname");
    let checkbox = form.querySelector(".form-input-container-checkbox__input");

    let error = 0;

    if (emailInput) {
        if (!checkEmailAndGmail(emailInput.value)) {
            addInputError(emailInput);
            error++;

            emailInput.addEventListener("input", function() {
                if (checkEmailAndGmail(emailInput.value)) {
                    removeInputError(emailInput)
                } else {
                    addInputError(emailInput)
                }
            })
        }
    }

    if (passwordInput && passwordInput.value.trim() == "") {
        addInputError(passwordInput);
        error++;

        passwordInput.addEventListener("input", function() {
            if (passwordInput.value.trim() != "") {
                removeInputError(passwordInput)
            } else {
                addInputError(passwordInput)
            }
        })
    }

    if (nameInput && nameInput.value.trim() == "") {
        addInputError(nameInput);
        error++;

        nameInput.addEventListener("input", function() {
            if (nameInput.value.trim() != "") {
                removeInputError(nameInput)
            } else {
                addInputError(nameInput)
            }
        })
    }

    if (surnameInput && surnameInput.value.trim() == "") {
        addInputError(surnameInput);
        error++;

        surnameInput.addEventListener("input", function() {
            if (surnameInput.value.trim() != "") {
                removeInputError(surnameInput)
            } else {
                addInputError(surnameInput)
            }
        })
    }

    if (checkbox && checkbox.checked == false) {
        console.log(checkbox)
        addInputError(checkbox);
        error++;

        checkbox.addEventListener("input", function() {
            if (checkbox.checked != false) {
                removeInputError(checkbox)
            } else {
                addInputError(checkbox)
            }
        })
    }
    
    return error;

    function addInputError(input) {
        if (input.type == "checkbox") {
            input.parentElement.classList.add("form-input-container-checkbox__input-wrapper_act");
        } else {
            input.parentElement.querySelector('.form-error').classList.add("form-error_act");
        }
    }
    function removeInputError(input) {
        if (input.type == "checkbox") {
            input.parentElement.classList.remove("form-input-container-checkbox__input-wrapper_act");
        } else {
            input.parentElement.querySelector('.form-error').classList.remove("form-error_act");
        }
    }
    function checkEmailAndGmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if (!emailPattern.test(email)) {
            return false;
        }
    
        return true;
    }
}

export default validationForm;