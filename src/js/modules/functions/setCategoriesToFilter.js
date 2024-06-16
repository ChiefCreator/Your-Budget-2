function setCategoriesToFilter(arr) {
    let blockToPaste = document.querySelector(`.category-sorting`);

    blockToPaste.querySelectorAll(".input-check").forEach(block => {
        block.remove()
    })

    for (let i = 0;i < arr.length;i++) {
        let itemCategory = `<div class="input-check">
        <div class="input-check__wrapper-inp">
            <input class="input-check__inp" type="checkbox" id="input-check__${arr[i].title}" data-title="${arr[i].title}">
            <span class="input-check__wrapper-inp-bg"></span>
        </div>
        <label class="input-check__label" for="input-check__${arr[i].title}">${arr[i].title}</label>
        </div>`;
                    
        function parser(itemCategory) {
            var parser = new DOMParser();
            let teg = parser.parseFromString(itemCategory, 'text/html');
            let item = teg.querySelector(".input-check");
            return item;
        }
        blockToPaste.append(parser(itemCategory))
    }
}

export default setCategoriesToFilter;