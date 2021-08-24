let {productsData} = require('../data/db');

/* al adaptarlo es necesario poner el user/ para que encuentre la carpeta con el archivo ejs */

module.exports = {
    login: (req, res) => {
        res.render('users/login');
    }
    ,
    register: (req, res) => {
        res.render('users/register');
    }
    ,
    favorites: (req, res) => {
        res.render('users/favorites' , {productsData});
    }
    ,
    editProfile: (req, res) => {
        res.render('users/editProfile',);
    }
    ,
    profile: (req, res) => {
        res.render('users/profile',);
    }
    ,
    cart: (req, res) => {
        res.render('users/cart' , {productsData});
    }
}