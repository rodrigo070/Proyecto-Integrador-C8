let { bannersData, productsData , usersData , categoriesData , subCategoriesData , writeProductEdit ,writeBannersEdit} = require('../data/db');
//aca controlamos la vista y las funciones por defecto se
//renderiza la vista que queremos de la carpeta views
//por aca podemos controlar que datos queremos que muestre por pantalla

module.exports = {
    admin: (req, res) => {
        res.render('admin/adminPanel');
    }
    ,
    admin_usuarios: (req, res) => {
        res.render('admin/adminUsersList',  {usersData});
    }
    ,
    admin_productos: (req, res) => {
        res.render('admin/adminProductList',  {
            productsData,
            messageToDisplay : "Disponibles"
        });
    }
    ,
    admin_agregar: (req, res) => {
        res.render('admin/adminAddProduct',  {
            productsData,
            categoriesData,
            subCategoriesData
        });
    }
    ,
    admin_carga_update: (req, res) => {
        
        let lastId = 1;

        productsData.forEach(product => {
            if(product.id > lastId){
                lastId = product.id
            }
        });

        let productIMGArray = [];

        req.files.forEach(image => {
            productIMGArray.push(image.filename);
        });

        let newProduct = {
            id: lastId + 1,
            image: productIMGArray.length > 0 ? productIMGArray : ["default.jpg"],
            name: req.body.name,
            color: req.body.color,
            price: req.body.price,
            stock: 1,
            discount: req.body.discount,
            onSale: req.body.onSale,
            description: req.body.description,
            category: req.body.category,
            subcategory: req.body.subcategory
        }

        productsData.push(newProduct);
        writeProductEdit(productsData);

        res.redirect('/admin/lista-productos');
    }
    ,
    admin_editar_producto: (req, res) => {

        let productToEditID = +req.params.id;
        let productToEdit = productsData.find(productToEditFind => productToEditFind.id === productToEditID);

        res.render('admin/adminEditProduct',  {
            productToEdit,
            categoriesData,
            subCategoriesData,
        });
    }
    ,
    admin_editar_producto_update: (req, res) => {

        let productIMGArray = [];
        
        req.files.forEach(image => {
            productIMGArray.push(image.filename);
        });

        productsData.forEach(productToEdit => {
            if(productToEdit.id === +req.params.id)
            {
                productToEdit.id = productToEdit.id,
                productToEdit.image = productIMGArray.length > 0 ? productIMGArray : productToEdit.image,
                productToEdit.name = req.body.name ? req.body.name : productToEdit.name,
                productToEdit.color = req.body.color ? req.body.color : productToEdit.color,
                productToEdit.price = req.body.price ? req.body.price : productToEdit.price,
                productToEdit.stock = req.body.stock ? req.body.stock : productToEdit.stock,
                productToEdit.discount = req.body.discount ? req.body.discount : productToEdit.discount,
                productToEdit.onSale = req.body.onSale ? req.body.onSale : productToEdit.onSale,
                productToEdit.description = req.body.description ? req.body.description : productToEdit.description,
                productToEdit.category = req.body.category ? req.body.category : productToEdit.category,
                productToEdit.subcategory = req.body.subcategory ? req.body.subcategory : productToEdit.subcategory
            }
        });

        writeProductEdit(productsData)

        res.redirect('/admin/lista-productos')
    }
    ,
    admin_stock: (req, res) => {
        let products = productsData.filter(product => product.stock > 0);

        res.render('admin/adminProductList',  {
            productsData: products,
            messageToDisplay : "Disponibles en Stock"
        });
    }
    ,
    admin_ofertas: (req, res) => {

        let products = productsData.filter(product => product.discount > 0);

        res.render('admin/adminProductList',  {
            productsData:products,
            messageToDisplay : "Disponibles en Oferta"
        });
    }
    ,
    banners: (req, res) => {
        
        res.render('admin/addBanners',  {
            productsData,
            bannersData
        });
    }
    ,
    banners_update: (req, res) => {

        let lastId = 1;

        bannersData.forEach(banner => {
            if(banner.id > lastId){
                lastId = banner.id
            }
        });

        let newBanner = {
            id: lastId + 1,
            bannerImage: req.file ? req.file.filename : "default.jpg",
        }

        bannersData.push(newBanner);
        console.log(newBanner);

        writeBannersEdit(bannersData);

        res.redirect('/');
    }
    ,
    borrar_banner: (req, res) => {
        bannersData.forEach(bannerToDelete => {
            if(bannerToDelete.id === +req.params.id){
                let borrarBanner = bannersData.indexOf(bannerToDelete)
                bannersData.splice(borrarBanner, 1)
            }
        })

        writeBannersEdit(bannersData);
        res.redirect('/admin/banners');
    }
    ,
    borrar_Producto: (req, res) => {
        productsData.forEach(productToDelete => {
            if(productToDelete.id === +req.params.id){
                let sucursalAEliminar = productsData.indexOf(productToDelete)
                productsData.splice(sucursalAEliminar, 1)
            }
        })

        writeProductEdit(productsData);
        res.redirect('/admin/lista-productos');
    }
}