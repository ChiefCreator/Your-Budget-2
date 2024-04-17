import showError from "./showError";
import showSuccess from "./showSuccess";
import firebaseConfig from "./firebaseConfig";
import validationForm from "./validationForm";

function signUp() {
    let formSignUp = document.querySelector(".form_singIn");

    formSignUp.addEventListener("submit", function(event) {
        event.preventDefault();
    
        let email = this.querySelector(".form-input-container__input_email").value;
        let password = this.querySelector(".form-input-container__input_password").value;
        
        let error = validationForm(formSignUp);
        if (error == 0) {
            submitButton("before");
            signUpOnSubmit(email, password)
                .then(data => setEmailToLocalStorage(data.email))
                .catch(() => submitButton("after", false))
        }
    })

    async function signUpOnSubmit(email, password) {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
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
        if (userData.error && userData.error.errors[0].message == "INVALID_LOGIN_CREDENTIALS") {
            submitButton("after", false)
            showError("Неправильный логин или пароль")
        } else {
            submitButton("after", true)
            showSuccess("Вы вошли в аккаунт")
            setTimeout(() => redirectToPage("http://localhost:8000/main-page.html"), 500);
        }

        return userData;
    }
    
    function submitButton(state, isSuccess) {
        let subBtn = document.querySelector(".button-submit_signIn")
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

    function redirectToPage(url) {
        window.location.href = url;
    }

    function setEmailToLocalStorage(email) {
        return localStorage.setItem("email", email);
    }
}

export default signUp;