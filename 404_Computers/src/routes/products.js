let express = require('express');
let router = express.Router()
let controller = require('../controllers/productsController.js')

//vista de todos los productos disponibles productsList
router.get('/productos', controller.productsList);

//vista de todos los productos disponibles productsList
router.get('/ofertas', controller.offers);

//vista de todos los productos disponibles segun la categoria categories
router.get('/productos/:category', controller.categories);

//vista de todos los productos disponibles segun la categoria y Sub-Categoria subCategories
router.get('/productos/:category/:subcategory', controller.subCategories);

//vista de un producto especifico
router.get('/productos/:category/:subcategory/:id', controller.product_Detail);


module.exports = router;