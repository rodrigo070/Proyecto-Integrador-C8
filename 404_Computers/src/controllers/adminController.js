let { bannersData, productsData , usersData , categoriesData , subCategoriesData , writeProductEdit ,writeBannersEdit, writeUserEdit} = require('../data/db');
const { validationResult } = require('express-validator');

module.exports = {
    admin: (req, res) => {
        res.render('admin/adminPanel',{
            session: req.session
        });
    }
    ,
    admin_usuarios: (req, res) => {
        res.render('admin/adminUsersList',  {
            usersData,
            session: req.session
        });
    }
    ,
    admin_detalle_usuario: (req, res) => {
        let userID = +req.params.id;
        let user = usersData.find(userToFind => userToFind.id === userID);

        res.render('admin/adminEditUser',  {
            user,
            session: req.session
        });
    }
    ,
    admin_detalle_usuario_editar: (req, res) => {

        usersData.forEach(userToEdit => {
            if(userToEdit.id === +req.params.id)
            {
                userToEdit.id = userToEdit.id,
                userToEdit.name = req.body.name ? req.body.name : userToEdit.name,
                userToEdit.surname = req.body.surname ? req.body.surname : userToEdit.surname,
                userToEdit.address = req.body.address ? req.body.address : userToEdit.address,
                userToEdit.dni = req.body.dni ? req.body.dni : userToEdit.dni,
                userToEdit.rol = req.body.rol ? req.body.rol : userToEdit.rol,
                userToEdit.email = req.body.email ? req.body.email : userToEdit.email,
                userToEdit.phoneNumber = req.body.phoneNumber ? req.body.phoneNumber : userToEdit.phoneNumber,
                userToEdit.image = userToEdit.image
            }
        });

        writeUserEdit(usersData)

        res.redirect('/admin/usuarios')
    }
    ,
    admin_productos: (req, res) => {
        res.render('admin/adminProductList',  {
            productsData,
            messageToDisplay : "Disponibles",
            session: req.session
        });
    }
    ,
    admin_agregar: (req, res) => {
        res.render('admin/adminAddProduct',  {
            productsData,
            categoriesData,
            subCategoriesData,
            session: req.session
        });
    }
    ,
    admin_carga_update: (req, res) => {
        
        let errors = validationResult(req)

        if(errors.isEmpty()){

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
        else
        {
            console.log("ERROR al Agregar Producto");
            res.render("admin/adminAddProduct", {
                productsData,
                categoriesData,
                subCategoriesData,
                errors: errors.mapped(),
                old: req.body,
                session: req.session
            })
        }
    },
    admin_editar_producto: (req, res) => {

        let productToEditID = +req.params.id;
        let productToEdit = productsData.find(productToEditFind => productToEditFind.id === productToEditID);

        res.render('admin/adminEditProduct',  {
            productToEdit,
            categoriesData,
            subCategoriesData,
            session: req.session
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
            messageToDisplay : "Disponibles en Stock",
            session: req.session
        });
    }
    ,
    admin_ofertas: (req, res) => {

        let products = productsData.filter(product => product.discount > 0);

        res.render('admin/adminProductList',  {
            productsData:products,
            messageToDisplay : "Disponibles en Oferta",
            session: req.session
        });
    }
    ,
    banners: (req, res) => {
        
        res.render('admin/addBanners',  {
            productsData,
            bannersData,
            session: req.session
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
    ,
    borrar_usuario: (req, res) => {
        usersData.forEach(userToDelete => {
            if(userToDelete.id === +req.params.id){
                let deleteUser = usersData.indexOf(userToDelete)
                usersData.splice(deleteUser, 1)
            }
        })

        writeUserEdit(usersData);
        res.redirect('/admin/usuarios');
    }
}