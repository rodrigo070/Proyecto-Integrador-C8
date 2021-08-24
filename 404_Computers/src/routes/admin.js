let express = require('express');
let router = express.Router()
let controller = require('../controllers/adminController.js')

//aca se controla la direccion que se va a 

router.get('/admin', controller.admin);


module.exports = router;