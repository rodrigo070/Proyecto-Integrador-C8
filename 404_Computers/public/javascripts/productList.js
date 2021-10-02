/* Boton de filtro para el listado de productos */

let filterButton = document.getElementById("buttonFilterOptions");
let sideButton = document.getElementById("modalSidePanelButton");
var closeButton = document.getElementsByClassName("closeFilterOptions")[0];

filterButton.onclick = function() {
    sideButton.style.display = "block";
    document.body.style.overflowY = "hidden";
}

closeButton.onclick = function() {
    sideButton.style.display = "none";
    document.body.style.overflowY = "visible";
}