function inputTextarrea() {
    let textarreas = document.querySelectorAll(".popup-operation__textarrea");
    for (let textarrea of textarreas) {
        let width = +textarrea.clientWidth;
        let charWidth = 8.8;
        let allCharWidth = charWidth;
        let height = +textarrea.clientHeight;

        const plusHeight = +textarrea.clientHeight;
        const plusWidth = +textarrea.clientWidth;
        
        textarrea.addEventListener("input", function() {

            if (allCharWidth < width) {
                textarrea.style.maxHeight = height + "px";
                textarrea.style.minHeight = height + "px";
                height -= plusHeight; 
                width -= plusWidth;
            }

            if (allCharWidth >= width) {
                height += plusHeight; 
                width += plusWidth;
                textarrea.style.maxHeight = height + "px";
                textarrea.style.minHeight = height + "px";
            }

            if (textarrea.value.length == 0) {
                textarrea.style.maxHeight = 25 + "px";
                textarrea.style.minHeight = 25 + "px";
            }

            allCharWidth = textarrea.value.length * charWidth; 
        })
    }
}

export default inputTextarrea;