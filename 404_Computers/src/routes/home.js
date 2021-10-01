const express = require('express');
const router = express.Router()
const controller = require('../controllers/homeController.js')
const cookieCheck = require('../middlewares/cookieCheck');

/* Router de Pagina Principal */

router.get('/', cookieCheck, controller.home);

/* Router de Pagina del Local */

router.get('/local', controller.location);

/* Router de Info de Developers */

router.get('/404computers', controller.about);

/* Router de Pagina de Contacto */

router.get('/contacto', controller.contact);

/* Router de Pagina de Terminos y Condiciones */

router.get('/terminos', controller.terms);

/* Router del Buscador de Productos */

router.get('/buscar', controller.search);



module.exports = router;