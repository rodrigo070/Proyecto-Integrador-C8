let express = require('express');
let router = express.Router()
let controller = require('../controllers/userController.js')

router.get('/login', controller.login);

router.get('/registro', controller.register);

router.get('/favoritos', controller.favorites);

router.get('/editar-perfil', controller.editProfile);

router.get('/perfil', controller.profile);

router.get('/carrito', controller.cart);

module.exports = router;