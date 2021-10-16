const { check, body } = require('express-validator')
const bcrypt = require("bcrypt");
const db = require('../database/models');
const User = db.User;

module.exports = [
    check('email')
    .notEmpty()
    .withMessage('Debe ingresar su E-Mail.'),

    body("custom").custom((value, { req }) => {
        return User.findOne({
            where: {
                email: req.body.email,
            },
        })
        .then(user => {
        if (!bcrypt.compareSync(req.body.pass, user.dataValues.pass)) {
            return Promise.reject();
        }
        })
        .catch((error) => {
            return Promise.reject("Credenciales inválidas");
        });
    })
    .withMessage("Usuario no registrado"),

]