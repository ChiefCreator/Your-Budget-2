function tabletMenu() {
    let menu = document.querySelector(".tablet-menu");
    let close = document.querySelector(".tablet-menu__close");
    let overblock = document.querySelector(".overblock");
    let burger = document.querySelector(".burger-menu");

    burger.addEventListener("click", function() {
        menu.classList.add("tablet-menu_open");
        overblock.classList.add("overblock_open");
    })
    close.addEventListener("click", function() {
        menu.classList.remove("tablet-menu_open");
        overblock.classList.remove("overblock_open");
    })
    overblock.addEventListener("click", function() {
        menu.classList.remove("tablet-menu_open");
        overblock.classList.remove("overblock_open");
    })
}

export default tabletMenu;