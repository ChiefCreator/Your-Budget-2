import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

function categoriesSlide() {
    let switchBtns = document.querySelectorAll(".switch-categories");
    let sliderCategory = document.querySelector(".slider-categories");
    let expensesTab = document.querySelector(".categories__tab_expenses");
    let incomeTab = document.querySelector(".categories__tab_income");
    let expensesTools = document.querySelector(".tools-categories_expenses");
    let incomeTools = document.querySelector(".tools-categories_income");

    const swiper = new Swiper('.slider-categories', {
        speed: 600,
        spaceBetween: 0,
        effect: 'flip',
        loop:true,
        delay: 5000,
        navigation: {
            nextEl: '.switch-categories',
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
        switchBtns.forEach(btn => {
            btn.classList.toggle("switch-categories_active");
        })
        sliderCategory.classList.toggle("slider-categories_active");
        expensesTab.classList.toggle("categories__tab_active");
        incomeTab.classList.toggle("categories__tab_active");
        // expensesTools.classList.toggle("tools-categories_active");
        // incomeTools.classList.toggle("tools-categories_active");
    }
}

export default categoriesSlide;