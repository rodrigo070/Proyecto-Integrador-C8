const { check, body } = require('express-validator');
const { users } = require('../data/db')

module.exports = [
    check('name')
    .notEmpty()
    .withMessage('Debe Ingresar un Nombre'),

    check('last_name')
    .notEmpty()
    .withMessage('Debe Ingresar un Apellido'),

    check('email')
    .isEmail()
    .withMessage('Debes ingresar un email válido'),

    body('email').custom(value => {
        let user = users.filter(user=>{ 
            return user.email == value 
        })
        
        if(user == false){ 
            return true 
        }else{
            return false 
        }
    })
    .withMessage('El email ya está registrado'),

    check('pass1')
    .notEmpty()
    .withMessage('Debes escribir tu contraseña')
    .isLength({
        min: 6,
        max: 12
    })
    .withMessage('La contraseña debe tener entre 6 y 12 caracteres'),

    body('pass2').custom((value, {req}) => value !== req.body.pass1 ? false : true)
    .withMessage('Las contraseñas no coinciden'),

    check('terms')
    .isString('on')
    .withMessage('Debes aceptar las bases y condiciones')
]