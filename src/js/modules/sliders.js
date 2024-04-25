import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

function sliders() {
    const swiperIconsExpenses = new Swiper('.swiper_icons-expenses', {
        speed: 600,
        spaceBetween: 0,
        pagination: {
            el: '.pagination_icons-expenses',
            type: 'bullets',
            clickable: true,
        },
        parallax:true,
    });
    
    // const swiperIconsIncome = new Swiper('.swiper_icons-income', {
    //     speed: 600,
    //     spaceBetween: 0,
    //     pagination: {
    //         el: '.pagination_icons-income',
    //         type: 'bullets',
    //         clickable: true,
    //     },
    // });
}

export default sliders;