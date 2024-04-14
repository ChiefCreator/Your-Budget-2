import showError from "./showError";
import showSuccess from "./showSuccess";
import firebaseConfig from "./firebaseConfig";
import validationForm from "./validationForm";

function signUp() {
    let formSignUp = document.querySelector(".form_singUp");

    formSignUp.addEventListener("submit", function(event) {
        event.preventDefault();
    
        let email = this.querySelector(".form-input-container__input_email").value;
        let password = this.querySelector(".form-input-container__input_password").value;
        
        let error = validationForm(formSignUp);
        if (error == 0) {
            submitButton("before");
            signUpOnSubmit(email, password)
                .catch(() => submitButton("after", false))
        }
    })

    async function signUpOnSubmit(email, password) {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true,
            })
        });
        const userData = await response.json();
        console.log(userData)
        if (userData.error && userData.error.errors[0].message == "EMAIL_EXISTS") {
            submitButton("after", false)
            showError("Ошибка, аккаунт уже существует")
            throw new Error("Ошибка, аккаунт уже существует");
        } 
        else if (userData.error && userData.error.errors[0].message == "WEAK_PASSWORD : Password should be at least 6 characters") {
            submitButton("after", true)
            showError("Пароль должен содержать минимум 6 символов")
        }
        else {
            submitButton("after", true)
            showSuccess("Аккаунт создан")
        }

        return response;
    }
    
    function submitButton(state, isSuccess) {
        let subBtn = document.querySelector(".button-submit_signUp")
        if (state == "before") {
            subBtn.classList.add("button-submit_onclick")
        } else {
            if (isSuccess == true) {
                subBtn.classList.remove("button-submit_onclick")
                subBtn.classList.add("button-submit_validate-success")
                setTimeout(function() {
                    subBtn.classList.remove("button-submit_validate-success")
                }, 2000)
            } else {
                subBtn.classList.remove("button-submit_onclick")
                subBtn.classList.add("button-submit_validate-error")
                setTimeout(function() {
                    subBtn.classList.remove("button-submit_validate-error")
                }, 2000)
            }
        }
    }
}

export default signUp;