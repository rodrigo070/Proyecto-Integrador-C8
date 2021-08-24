let { productsData } = require('../data/db');
//aca controlamos la vista y las funciones por defecto se
//renderiza la vista que queremos de la carpeta views
//por aca podemos controlar que datos queremos que muestre por pantalla

module.exports = {
    admin: (req, res) => {
        res.render('admin/adminProducts',  {productsData});
    }
}