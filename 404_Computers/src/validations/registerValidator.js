const { check, body } = require('express-validator');
const { usersData } = require('../data/db')

module.exports = [
    check('name')
    .notEmpty()
    .withMessage('Debe Ingresar un Nombre'),

    check('surname')
    .notEmpty()
    .withMessage('Debe Ingresar un Apellido'),

    check('email')
    .notEmpty()
    .withMessage('Debes escribir un email').bail()
    .isEmail()
    .withMessage('Debes escribir un email válido'),

    body('email')
    .custom(value => {
        let user = usersData.find(user => user.email === value)

        if(user === undefined){
            return true
        }else{
            return false
        }
    })
    .withMessage("Email ya registrado"),

    check('pass')
    .notEmpty()
    .withMessage('Debes escribir tu contraseña')
    .isLength({
        min: 6,
        max: 12
    })
    .withMessage('La contraseña debe tener entre 6 y 12 caracteres'),

    body('passCheck')
    .custom((value, {req}) => value !== req.body.pass ? false : true)
    .withMessage('Las contraseñas no coinciden'),

]