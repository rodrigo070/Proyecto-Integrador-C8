function leftPanel(){
    let button = document.querySelector(".leftPanelAdmin");
    button.classList.toggle("leftPanelActive");
    let home = document.querySelector(".AdminContent");
    home.classList.toggle("mainPanelActive");
}

/* Funciones del modal de Form Delete Msg .etc */

function modalFormShow () {

    document.querySelector(".modalFormBox").classList.toggle("formActive")
    
    document.querySelector(".modalFormContent").classList.toggle("formActive")
}