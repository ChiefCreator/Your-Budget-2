import Chart from 'chart.js/auto';

const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', "Июль"],
      datasets: [{
        data: [3, 5, 20, 23, 14, 16, 30],
        backgroundColor: ['rgb(2, 255, 183)', "rgb(219, 92, 2)", "rgb(225, 54, 105)", "rgb(168, 225, 54)"],
      }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            }
          }
    }
  });

let formSignUp = document.querySelector(".form_singUp");
let swithButton = document.querySelector(".switch__input");
let formSignIn = document.querySelector(".form_singIn");
let title = document.querySelector(".double-form__title");

swithButton.addEventListener("click", function() {
    let currentForm = document.querySelector(".form_act");

    if (currentForm == formSignUp) {
        formSignUp.classList.remove("form_act")
        formSignIn.classList.add("form_act")

        title.textContent = "Войти"
    } else {
        formSignUp.classList.add("form_act")
        formSignIn.classList.remove("form_act")
        title.textContent = "Зарегистрироваться"
    }
})