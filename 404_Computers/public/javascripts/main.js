/* Botones de Stock de Carrito */
/* Code By  Stackfindover */

function increaseCount(a, b) {
  var input = b.previousElementSibling;
  var value = parseInt(input.value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  input.value = value;
}
  
function decreaseCount(a, b) {
  var input = b.nextElementSibling;
  var value = parseInt(input.value, 10);
  if (value > 1) {
    value = isNaN(value) ? 0 : value;
    value--;
    input.value = value;
  }
}

/* Funcion del Home */

let navBar = document.getElementById('mobile_Nav_Bar');
let searchBar = document.getElementById("searchBarButtonJS");
let burger = document.getElementById("burgerButton");

function BButton() {
    burger.classList.toggle("is-active");
}

function userPanel(){
    let panel = document.getElementById('userPanel');

    panel.classList.toggle("panel_Active");
}

function dropMenu(){
    if (navBar.style.display === "block")
    {
        navBar.style.display = "none";
        searchBar.style.display = "none";
    }
    else
    {
        navBar.style.display = "block";
        searchBar.style.display = "none";
    }
}

function dropSearch(){
    if (searchBar.style.display === "block")
    {
        searchBar.style.display = "none";
        burger.classList.remove("is-active");
    }
    else
    {
        searchBar.style.display = "block";
        navBar.style.display = "none";
        burger.classList.remove("is-active");
    }
}

/* Las funciones de abajo por el momento no tienen uso en la pagina*/

function dropSubCategoryMenu (id) {
    let list = document.getElementById(`${id}`);
    list.classList.toggle("active");
    navBar.style.display = "none";
    searchBar.style.display = "none";
}

function closeWindow () {
    document.querySelector(".active").classList.remove("active")
}

/* Boton para el Carrito de Compras */

function openPaymentSection(event, payOption) {
    var i, tabcontent, buttonOption;
    tabcontent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    buttonOption = document.getElementsByClassName("buttonSelected");
    for (i = 0; i < buttonOption.length; i++) {
        buttonOption[i].className = buttonOption[i].className.replace(" active", "");
    }
    document.getElementById(payOption).style.display = "grid";
    event.currentTarget.className += " active";
}

/* Calcular Costo de Envio */

function shippingCost(){
    let cpCode =document.getElementById("cpcode").value;

    let fieldToReplace = document.getElementById("shippingCost");

    let cost = 0.400;

    let finalCost = cpCode * cost;

    if(cpCode > 0 && cpCode.length > 3)
    {
        if(finalCost < 600)
        {
            finalCost = 720;
        }
        else if(finalCost > 2300)
        {
            finalCost = 1900;
        }
    
        fieldToReplace.innerHTML = "$"+finalCost;
    }
    else
    {
        fieldToReplace.innerHTML = "$";
    }
}