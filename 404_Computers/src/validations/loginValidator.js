const { check, body } = require('express-validator')
const { usersData } = require('../data/db');
const bcrypt = require("bcrypt");

module.exports = [
    check('email')
    .notEmpty()
    .withMessage('Debe ingresar su E-Mail.'),

    body('email')
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
    .withMessage('Contraseña inválida.')
]