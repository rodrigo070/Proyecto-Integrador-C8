let express = require('express');
let router = express.Router();
let controller = require('../controllers/userController');
let loginValidator = require('../validations/loginValidator');
let registerValidator = require('../validations/registerValidator');
let userSessionCheck = require('../middlewares/userSessionCheck');
let userLog = require('../middlewares/userLog');

router.get('/login', userLog, controller.login);
router.post('/login', loginValidator, controller.processLogin);
router.get('/logout', userSessionCheck, controller.logout);

router.get('/registro', userLog, controller.register);
router.post('/registro', registerValidator, controller.processRegister);

router.get('/favoritos', userSessionCheck, controller.favorites);

router.get('/editar-perfil', userSessionCheck, controller.editProfile);

/* router.get('/perfil', userSessionCheck, controller.profile); */
router.get('/perfil/:id', userSessionCheck, controller.profile);/* cambie la ruta para que en perfil nos muestre los datos del usuario que venga por id */

router.get('/carrito', userSessionCheck, controller.cart);

module.exports = router;