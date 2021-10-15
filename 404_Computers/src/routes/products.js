const express = require('express');
const router = express.Router()
const controller = require('../controllers/productsController.js')

/* Router de todos los Productos Disponibles */

router.get('/productos', controller.productsList);

/* Router de todos los Productos disponibles en Oferta */

router.get('/ofertas', controller.offers);

/* Router de todos los Productos disponibles segun la Categoria */

router.get('/productos/:category', controller.categories);

/* Router de todos los Productos disponibles segun la Categoria y Sub-Categoria */

router.get('/productos/:category/:subcategory', controller.subCategories);

/* Router del detalle de Producto */

router.get('/productos/:category/:subcategory/:id', controller.product_Detail);


module.exports = router;