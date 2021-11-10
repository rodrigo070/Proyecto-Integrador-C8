function leftPanel(){
    let button = document.querySelector(".leftPanelAdmin");
    button.classList.toggle("leftPanelActive");
    let home = document.querySelector(".AdminContent");
    home.classList.toggle("mainPanelActive");
    document.body.classList.toggle("bNoScroll");
}

/* Funciones del modal de Form Delete Msg .etc */

window.addEventListener("load", function() {
    
    const element = document.querySelectorAll("#btnDeleteUser");
    const contentBox = document.querySelectorAll(".modalFormBox");
    const content = document.querySelectorAll(".modalFormContent");
    const cancel = document.querySelectorAll(".cancelDeleteBTN");

    for(let i = 0; i < element.length; i++) {
        element[i].addEventListener('click' , function(){
            contentBox[i].classList.toggle("formActive");
            content[i].classList.toggle("formActive");
        })
        cancel[i].addEventListener('click' , function(){
            contentBox[i].classList.toggle("formActive");
            content[i].classList.toggle("formActive");
        })
    }

})