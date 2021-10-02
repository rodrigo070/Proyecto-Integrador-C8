const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController.js');
const adminSessionCheck = require('../middlewares/adminSessionCheck');
const productCheck = require('../validations/productCreateValidator');

const uploadProductFile = require("../middlewares/uploadProductsFiles");
const uploadBannerFile = require("../middlewares/uploadBannerFile");

router.get('/', adminSessionCheck, controller.admin);
router.get('/usuarios', adminSessionCheck, controller.admin_usuarios);
router.get('/banners', adminSessionCheck, controller.banners);
router.post('/banners', uploadBannerFile.single("bannerImage") ,controller.banners_update);

/* GET Carga de Productos */
router.get('/agregar-producto', adminSessionCheck, controller.admin_agregar);
/* POST Recibo los Datos y los integro a la Base de Datos */
router.post('/agregar-producto', uploadProductFile.array("image", 4) , productCheck, controller.admin_carga_update);

/* GET Edicion de Producto */
router.get('/editar-producto/:id', adminSessionCheck, controller.admin_editar_producto);
/* PUT recibo los datos modificados y aplico la actualizacion */
router.put('/editar-producto/:id', uploadProductFile.array("image", 4) , controller.admin_editar_producto_update);

/* GET Edicion de Usuarios */
router.get('/editar-usuario/:id', adminSessionCheck, controller.admin_detalle_usuario);
/* PUT recibo los datos modificados y aplico la actualizacion */
router.put('/editar-usuario/:id', controller.admin_detalle_usuario_editar);


router.get('/lista-productos', adminSessionCheck, controller.admin_productos);
/* las vistas de abajo reutilizan el listado de productos */
router.get('/lista-productos/stock', adminSessionCheck, controller.admin_stock);
router.get('/lista-productos/ofertas', adminSessionCheck, controller.admin_ofertas);

/* Boton de Borrar Banner */

router.delete('/borrarBanner/:id', controller.borrar_banner);

/* Boton de Eliminar Producto */
router.delete('/borrarProducto/:id', controller.borrar_Producto);

/* Boton de Eliminar Usuario */
router.delete('/borrarUsuario/:id', controller.borrar_usuario);

module.exports = router;