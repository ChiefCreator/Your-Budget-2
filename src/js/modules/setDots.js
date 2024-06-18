function setDots() {
    let nameWrappers = document.querySelectorAll(".element-name-wrapper");
    nameWrappers.forEach(nameWrapper => {
        let name = nameWrapper.querySelector(".element-name");
        let string = name.textContent;
        if (string) {
            for(let i = 0;i < string.length; i++) {
                if (name.clientWidth == nameWrapper.clientWidth) {
                    string = string.slice(0, string.length - 1)
                    name.textContent = string;
                    name.textContent = string + "..."
                }
            }
        }
    })
}

export default setDots;