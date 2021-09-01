let express = require('express');
let router = express.Router();
let controller = require('../controllers/adminController.js');

router.get('/', controller.admin);
router.get('/usuarios', controller.admin_usuarios);
/* GET Carga de Productos */
router.get('/agregar-producto', controller.admin_agregar);
/* POST Recibo los Datos y los integro a la Base de Datos */
router.post('/', controller.admin_carga_update);

/* GET Edicion de Producto */
router.get('/editar-producto/:id', controller.admin_editar_producto);
/* PUT recibo los datos modificados y aplico la actualizacion */
router.put('/editar-producto/:id', controller.admin_editar_producto_update);

router.get('/lista-productos', controller.admin_productos);
/* las vistas de abajo reutilizan el listado de productos */
router.get('/lista-productos/stock', controller.admin_stock);
router.get('/lista-productos/ofertas', controller.admin_ofertas);

/* Boton de Eliminar Producto */
router.delete('/borrarProducto/:id', controller.borrar_Producto);

module.exports = router;