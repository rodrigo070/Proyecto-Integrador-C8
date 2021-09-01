let { productsData } = require('../data/db');

//aca controlamos la vista y las funciones por defecto se
//renderiza la vista que queremos de la carpeta views
//por aca podemos controlar que datos queremos que muestre por pantalla

module.exports = {
    home: (req, res) => {
        res.render('home' , {productsData});
    }
    ,
    location: (req, res) => {
        res.render('location');
    }
    ,
    contact: (req, res) => {
        res.render('contact');
    }
    ,
    about: (req, res) => {
        res.render('404computers');
    }
    ,
    terms: (req, res) => {
        res.render('termsAndCond');
    }
}