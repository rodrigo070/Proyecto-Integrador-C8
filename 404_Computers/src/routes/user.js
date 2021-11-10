const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const loginValidator = require('../validations/loginValidator');
const registerValidator = require('../validations/registerValidator');
const userSessionCheck = require('../middlewares/userSessionCheck');
const userLog = require('../middlewares/userLog');
const profileCheck = require('../middlewares/profileCheck');
const uploadProfilePicFile = require("../middlewares/uploadProfilePicFile");

/* Router de Login y Logout */
router.get('/login', userLog, controller.login);
router.post('/login', loginValidator, controller.processLogin);
router.get('/logout', userSessionCheck, controller.logout);

/* Router de Registro */

router.get('/registro', userLog, controller.register);
router.post('/registro', registerValidator, controller.processRegister);

/* Routers de Favoritos */

router.get('/favoritos', userSessionCheck, controller.favorites);

router.delete('/borrar-favorito-user/:id', controller.favorite_delete_user);

/* Routers de Historial */

router.get('/historial', userSessionCheck, controller.history);

router.delete('/delHistoryProduct/:id', controller.delHistoryProduct);

/* Routers de Edicion de Perfil */

router.get('/editar-perfil', userSessionCheck, controller.editProfile);

router.put('/editar-perfil/:id' ,uploadProfilePicFile.single("image"), controller.updateProfile)

/* Routers de Perfil de Usuario */
router.get('/perfil/:id', userSessionCheck,profileCheck ,controller.profile);/* cambie la ruta para que en perfil nos muestre los datos del usuario que venga por id */

/* Routers de Carrito de Compras */

router.get('/carrito', userSessionCheck, controller.cart);

router.delete('/cart_delete/:id', controller.cart_delete);

module.exports = router;