import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

function categoriesSlide() {
    let switchBtn = document.querySelector(".slide-button");
    let sliderCategory = document.querySelector(".slider-categories");
    let expensesTab = document.querySelector(".categories__tab_expenses");
    let incomeTab = document.querySelector(".categories__tab_income");

    const swiper = new Swiper('.swiper', {
        speed: 600,
        spaceBetween: 0,
        effect: 'flip',
        loop:true,
        navigation: {
            nextEl: '.slide-button',
          },

        on: {
            slideChangeTransitionStart: function (swiper) {
                document.querySelectorAll(".swiper-slide").forEach(slide => slide.classList.remove("swiper-slide_active"));

                let currentSlide = swiper.slides[swiper.activeIndex];
                currentSlide.classList.add("swiper-slide_active");

                switchCategory()   
            },
        },
    });

    function switchCategory() {
        switchBtn.classList.toggle("slide-button_active");
        sliderCategory.classList.toggle("slider-categories_active");

        expensesTab.classList.toggle("categories__tab_active");
        incomeTab.classList.toggle("categories__tab_active");
    }
}

export default categoriesSlide;