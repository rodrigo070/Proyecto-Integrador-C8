let express = require('express');
let router = express.Router()
let controller = require('../controllers/homeController.js')
let cookieCheck = require('../middlewares/cookieCheck');

router.get('/', cookieCheck, controller.home);
router.get('/local', controller.location);
router.get('/404computers', controller.about);
router.get('/contacto', controller.contact);
router.get('/terminos', controller.terms);
router.get('/buscar', controller.search);

module.exports = router;