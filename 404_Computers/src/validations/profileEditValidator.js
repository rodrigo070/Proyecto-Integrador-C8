const { check, body } = require('express-validator');
const db = require('../database/models');
const User = db.User;

module.exports = [

    body('email')
    .custom((value , {req}) => {
        return User.findOne({
            where: {
                email : value
            }
        })
        .then(usera => {
            if(usera && usera.id != req.session.user.id){
                return Promise.reject("El eMail ya está registrado")
            }
        })
    })
    .withMessage("el Email ingresado ya se encuentra registrado."),

    body('dni')
    .custom((value , {req}) => {
        return User.findOne({
            where: {
                dni : value
            }
        })
        .then(userDNI => {
            if(userDNI && userDNI.id != req.session.user.id){
                return Promise.reject("El DNI ingresado ya se encuentra registrado")
            }
        })
    })
    .withMessage("el DNI ingresado ya se encuentra registrado."),

]