const { check, body } = require('express-validator');
const db = require('../database/models');
const User = db.User;

module.exports = [
    check('name')
    .notEmpty()
    .withMessage('Debe ingresar su Nombre.'),

    check('surname')
    .notEmpty()
    .withMessage('Debe ingresar su Apellido.'),

    check('email')
    .notEmpty()
    .withMessage('Debe ingresar su E-mail.').bail()
    .isEmail()
    .withMessage('Debe ingresar un E-mail válido.'),

    body('email')
    .custom(value => {
        return User.findOne({
            where: {
                email : value
            }
        })
        .then(user => {
            if(user){
                return Promise.reject("El Usuario ya está registrado")
            }
        })
    })
    .withMessage("el Email ingresado ya esta registrado."),

    check('pass')
    .notEmpty()
    .withMessage('Debe escribir una Contraseña.')
    .isLength({
        min: 6,
        max: 12
    })
    .withMessage('La Contraseña debe tener entre 6 y 12 caracteres.'),

    body('passCheck')
    .custom((value, {req}) => value !== req.body.pass ? false : true)
    .withMessage('Las Contraseñas no coinciden.'),

]