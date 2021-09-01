let express = require('express');
let router = express.Router()
let controller = require('../controllers/homeController.js')

router.get('/', controller.home);
router.get('/local', controller.location);
router.get('/404computers', controller.about);
router.get('/contacto', controller.contact);
router.get('/terminos', controller.terms);

module.exports = router;