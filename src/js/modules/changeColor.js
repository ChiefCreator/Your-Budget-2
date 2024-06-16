function changeColor(icons, inpBg, inpColor, wrapperInpBg, wrapperInpColor) {

    icons.forEach(icon => {
        icon.style.backgroundColor = inpBg.value;
        icon.style.color = inpColor.value; 

        wrapperInpBg.style.backgroundColor = inpBg.value;
        wrapperInpColor.style.backgroundColor = inpColor.value; 
    })

    window.addEventListener("click", function(event) {
        let icon = event.target.closest(".popup-category__icon");

        if (event.target.closest(".popup-category__icon")) {
            document.querySelectorAll(".popup-category__icon").forEach(icon => {
                icon.style.backgroundColor = "#A2A6B4";
                icon.style.color = "white"; 
                icon.classList.remove("act");
            })

            icon.classList.add("act");
            icon.style.backgroundColor = changeColor(inpBg, inpColor, icon)[0]; 
            icon.style.color = changeColor(inpBg, inpColor, icon)[1]; 
        } else if (!event.target.closest(".popup-category__block-wrapper") && !event.target.closest(".popup-category__icon")) {
            document.querySelectorAll(".popup-category__icon").forEach(icon => {
                icon.style.backgroundColor = "#A2A6B4";
                icon.style.color = "white"; 
                icon.classList.remove("act");
            })
        }
    })

    function changeColor(inpBg, inpColor, icon) {
        let bg = inpBg.value;
        let color = inpColor.value;
        inpBg.addEventListener("input", function() {
            bg = inpBg.value;

            if (icon.classList.contains("act")) {
                icon.style.backgroundColor = bg;
            }
        })
        inpColor.addEventListener("input", function() {
            color = inpColor.value;

            if (icon.classList.contains("act")) {
                icon.style.color = color;
            }
        })
        return [bg, color]
    }

    wrapperInpColor.style.border = `2px solid #eef0f4`;
    wrapperInpBg.style.border = `2px solid ${inpBg.value}`;

    function changeBgOFInputs() {
        inpBg.addEventListener("input", function() {
            wrapperInpBg.style.backgroundColor = inpBg.value;

            if (inpBg.value == "#ffffff") {
                wrapperInpBg.style.border = `2px solid #eef0f4`;
            } else {
                wrapperInpBg.style.border = `2px solid ${inpBg.value}`;
            }
        })

        inpColor.addEventListener("input", function() {
            wrapperInpColor.style.backgroundColor = inpColor.value;
        
            if (inpColor.value == "#ffffff") {
                wrapperInpColor.style.border = `2px solid #eef0f4`;
            } else {
                wrapperInpColor.style.border = `2px solid ${inpColor.value}`;
            }
        
        })
    }
    changeBgOFInputs();
}

export default changeColor;