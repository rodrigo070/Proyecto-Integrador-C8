const { check, body } = require('express-validator')
//const { usersData } = require('../data/db');
let db = require ('../database/models')

const bcrypt = require("bcrypt");

module.exports = [
    check('email')
    .notEmpty()
    .withMessage('Debe ingresar su E-Mail.')
    .bail()
    .isEmail()
    .withMessage('Debes escribir un email valido'),

    body('custom')
    .custom((value, {req})=>{
        return db.User.findOne({
            where : {
                email:req.body.email
            }
        })
        .then((user) =>{
            if (!bcrypt.compareSync(req.body.pass, user.dataValues.pass)){
                return Promise.reject()
            }
        })
        .catch(error => {
          
            return Promise.reject ('Credenciales invalidas')
        })
    })


  /*  body('email')
    .custom(inputEmail => {
        let user = usersData.find(user => user.email === inputEmail)

        if(user !== undefined){
            return true
        }else{
            return false
        }
    })
    .withMessage("Usuario no registrado"),

    check('pass')
    .notEmpty()
    .withMessage('Debe escribir su Contraseña.'),

    body('pass')
    .custom((inputPass, {req}) => {
        let user = usersData.find(user => user.email === req.body.email)
        return bcrypt.compareSync(inputPass, user.pass)
    })
    .withMessage('Contraseña inválida.')*/
]