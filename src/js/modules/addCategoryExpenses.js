import firebaseConfig from "./firebaseConfig";
import Chart from 'chart.js/auto';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

function addCategoryExpenses() {
    const chartExpensesPie = new Chart(document.getElementById('chartExpensesPie'), {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [],
                borderWidth: 1,
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                },
            }
        },
    });
    const swiper = new Swiper('.swiper_categories-expenses', {
        speed: 600,
        spaceBetween: 0,
        pagination: {
            el: '.pagination_done-expenses',
            type: 'bullets',
            clickable: true,
        },
    })

    let btnAdd = document.querySelector(".add-expenses");
    let popup = document.querySelector(".popup-category-done_expenses");

    let properties = {};
    let arrProperties = [];
    let index = 0;
    let collectionName = localStorage.getItem("email") + "CategoriesExpenses";

    getDataFromFirestore();
    togglePopup();

    window.addEventListener("click", function(e) {
        let category = e.target.closest(".done-expenses");

        if (e.target.closest(".done-expenses")) {
            chooseCategory(category)
        }
        if (e.target.closest(".popup-category-done_expenses .popup-category-done__button")) {
            arrProperties.push(properties);

            setItemToList(properties);
            addToFirestore(properties);
            chart(arrProperties, chartExpensesPie);
        }
    })

    function chooseCategory(category) {
        let actCategory = document.querySelector(".done-expenses_act");

        if (actCategory && actCategory != category) {
            actCategory.classList.remove("done-expenses_act");
        }
        category.classList.toggle("done-expenses_act");
        properties = JSON.parse(category.dataset.categoryDone);
        index++;
        properties.index = index;
    }

    function setItemToList(objCategory) {
        let blockToPaste = document.querySelector(".categories__list");
        let itemCategory = `<div class="list-categories__item item-category item-category_expenses" data-index="${objCategory.index}">
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

    function addToFirestore(obj) {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}?key=${firebaseConfig.apiKey}`;
        
        const data = {
            fields: toObject(obj)
        };

        fetch(firestoreUrl, {
            method: 'POST',
            body: JSON.stringify(data),
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

        function toObject(obj) {
            return {
                title: {stringValue: obj.title},
                icon: {stringValue: obj.icon},
                index: {integerValue: obj.index},
                cost: {integerValue: obj.cost},
                bg: {stringValue: obj.bg},
                color: {stringValue: obj.color},
            };
        }
    }

    function getDataFromFirestore() {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}?key=${firebaseConfig.apiKey}`;
    
        fetch(firestoreUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data from Firestore');
                }
                return response.json();
            })
            .then(data => {
                if (Object.keys(data).length != 0) {
                    arrProperties = transformToArrayFromDatabase(data);
                    setItemToListFromDatabase(arrProperties);
                    chart(arrProperties, chartExpensesPie);
                }
            })
            .catch(error => {
                console.error('Error fetching data from Firestore:', error);
            });
    }

    function transformToArrayFromDatabase(data) {
        const transformedArray = data.documents.map(doc => {
            const { title, icon, index, cost, bg, color } = doc.fields;
            return {
                title: title.stringValue,
                icon: icon.stringValue,
                index: index ? parseInt(index.integerValue) : null,
                cost: parseInt(cost.integerValue),
                bg: bg ? bg.stringValue : null,
                color: color ? color.stringValue : null
            };
        });

        return transformedArray
    }

    function setItemToListFromDatabase(arr) {
        let blockToPaste = document.querySelector(".categories__list");
        for (let i = 0;i < arr.length;i++) {
            let itemCategory = `<div class="list-categories__item item-category item-category_expenses" data-index="${arr[i].index}">
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
}

export default addCategoryExpenses;