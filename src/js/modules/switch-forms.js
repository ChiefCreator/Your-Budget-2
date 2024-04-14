import Chart from 'chart.js/auto';
function switchForms() {
    const ctx = document.getElementById('myChart');
    let registrationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', "Июль"],
            datasets: [{
                data: [3, 5, 20, 23, 14, 16, 30],
                backgroundColor: ['#133054', "rgb(212, 212, 220)", "rgb(162, 162, 201)", "rgb(66, 66, 138)"],
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
            formSignUp.classList.remove("form_act");
            formSignIn.classList.add("form_act");
        
            title.textContent = "Войти";

            registrationChart.data.datasets[0].data = [6, 10, 16, 12, 18, 25, 30];
            registrationChart.update();
        } else {
            formSignUp.classList.add("form_act");
            formSignIn.classList.remove("form_act");

            title.textContent = "Зарегистрироваться";

            registrationChart.data.datasets[0].data = [3, 5, 20, 23, 14, 16, 30];
            registrationChart.update();
        }
    })
}

export default switchForms;