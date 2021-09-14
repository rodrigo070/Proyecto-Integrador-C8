let {productsData, usersData , writeUserEdit} = require('../data/db');
const { validationResult } = require('express-validator');
let bcrypt = require("bcrypt");

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
    processRegister: (req, res) => {
        let errors = validationResult(req)
        
        if (errors.isEmpty()) {           

            const {
                name,
                surname,
                email,
                pass
            } = req.body

            let newUser = {
                id : usersData[usersData.length - 1].id + 1,
                name,
                surname,
                email,
                pass : bcrypt.hashSync(pass, 12),
                rol: "ROL_USER",
                image: "user_default.jpg",
                address: "",
                phoneNumber: 0,
                dni: 0,
            }
            console.log(newUser)
            usersData.push(newUser)

            writeUserEdit(usersData)

            res.redirect('/login')
            
        }
        else
        {
            res.render('users/register', {
                errors: errors.mapped(),
                old : req.body,
                session: req.session
            });
        }
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