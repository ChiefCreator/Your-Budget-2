import firebaseConfig from "./firebaseConfig";
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

function addCategoryIncome(chartIncomePie) {
    const swiper = new Swiper('.swiper_categories-income', {
        speed: 600,
        spaceBetween: 0,
        pagination: {
            el: '.pagination_done-income',
            type: 'bullets',
            clickable: true,
        },
    })

    let btnAdd = document.querySelector(".add-income");
    let popup = document.querySelector(".popup-category-done_income");

    let properties = {};
    let arrProperties = [];
    let index = 0;
    let userEmail = localStorage.getItem("email").replace(".", "*");

    getDataFromFirestore();
    togglePopup();

    window.addEventListener("click", function(e) {
        let category = e.target.closest(".done-income");

        if (e.target.closest(".done-income")) {
            chooseCategory(category)
        }
        if (e.target.closest(".popup-category-done_income .popup-category-done__button")) {
            arrProperties.push(properties);

            setItemToList(properties);
            addToFirestore(arrProperties);
            chart(arrProperties, chartIncomePie);
        }
    })

    function chooseCategory(category) {
        let actCategory = document.querySelector(".done-income_act");

        if (actCategory && actCategory != category) {
            actCategory.classList.remove("done-income_act");
        }
        category.classList.toggle("done-income_act");
        properties = JSON.parse(category.dataset.categoryDone);
        index++;
        properties.index = index;
    }

    function setItemToList(objCategory) {
        let blockToPaste = document.querySelector(".list-categories_income");
        let itemCategory = `<div class="list-categories__item item-category item-category_income" data-options='{"index": ${objCategory.index}, "title": "${objCategory.title}", "cost": ${objCategory.cost}, "icon": "${objCategory.icon}", "bg": "${objCategory.bg}", "color": "${objCategory.color}"}'>
        <div class="item-category__head">
            <div class="item-category__icon ${objCategory.icon}" style="background-color:${objCategory.bg}"></div>
            <div class="item-category__info">
                <p class="item-category__name">${objCategory.title}</p>
            </div>
            <div class="item-category__total">${objCategory.cost} BYN</div>
        </div>
            </div>`;

        function parser(itemCategory) {
            var parser = new DOMParser();
            let teg = parser.parseFromString(itemCategory, 'text/html');
            let item = teg.querySelector(".item-category");
            return item;
        }
        blockToPaste.append(parser(itemCategory))
    }

    function togglePopup() {
        let overblock = document.querySelector(".overblock");

        btnAdd.addEventListener("click", function() {
            popup.classList.add("popup-category-done_open");
            overblock.classList.add("overblock_open");
        })

        overblock.addEventListener("click", function() {
            popup.classList.remove("popup-category-done_open");
            overblock.classList.remove("overblock_open");
        })
    }

    function chart(arr, chart) {
        let titles = [];
        let bgArr = [];
        let costArr = [];

        arr.forEach(item => {
            titles.push(item.title);
            bgArr.push(item.bg);

            if (item.cost == 0) {
                costArr.push(1);
            } else {
                costArr.push(item.cost);
            }
        })

        chart.data.labels = titles;
        chart.data.datasets[0].data = costArr;
        chart.data.datasets[0].backgroundColor = bgArr;
        chart.update();
    }

    function addToFirestore(arr) {
        const firestoreUrl = `https://database-fc7b1-default-rtdb.europe-west1.firebasedatabase.app/users/${userEmail}/categoriesIncome.json`;

        fetch(firestoreUrl, {
            method: 'PUT',
            body: JSON.stringify(arr),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
          console.log('Category added:', data);
        })
        .catch(error => {
          console.error('Error adding category:', error);
        });
    }

    function getDataFromFirestore() {
        const firestoreUrl = `https://database-fc7b1-default-rtdb.europe-west1.firebasedatabase.app/users/${userEmail}/categoriesIncome.json`;
    
        fetch(firestoreUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data from Firestore');
                }
                return response.json();
            })
            .then(data => {
                if (Object.keys(data).length != 0) {
                    arrProperties = data;
                    setItemToListFromDatabase(arrProperties);
                    chart(arrProperties, chartIncomePie);
                    changeCostsOfCategories(arrProperties);
                }
            })
            .catch(error => {
                console.error('Error fetching data from Firestore:', error);
            });
    }

    function setItemToListFromDatabase(arr) {
        let blockToPaste = document.querySelector(".list-categories_income");
        for (let i = 0;i < arr.length;i++) {
            let itemCategory = `<div class="list-categories__item item-category item-category_income" data-options='{"index": ${arr[i].index}, "title": "${arr[i].title}", "cost": ${arr[i].cost}, "icon": "${arr[i].icon}", "bg": "${arr[i].bg}", "color": "${arr[i].color}"}'>
            <div class="item-category__head">
                <div class="item-category__icon ${arr[i].icon}" style="background-color:${arr[i].bg}"></div>
                <div class="item-category__info">
                    <p class="item-category__name">${arr[i].title}</p>
                </div>
                <div class="item-category__total">${arr[i].cost} BYN</div>
            </div>
                </div>`;
        function parser(itemCategory) {
            var parser = new DOMParser();
            let teg = parser.parseFromString(itemCategory, 'text/html');
            let item = teg.querySelector(".item-category");
            return item;
        }
        blockToPaste.append(parser(itemCategory))
        }
    }

    function changeCostsOfCategories(arr) {
        let total = 0;

        document.querySelectorAll(".list-categories_income .list-categories__item").forEach((category, i) => {
            if (arr[i]) {
                total += arr[i].cost;

                category.querySelector(".item-category__total").textContent = arr[i].cost + " BYN";
            }
        })
        document.querySelector(".slider-categories__item_income .slider-categories__total-num").textContent = total;
    }
}

export default addCategoryIncome;