const { validationResult } = require('express-validator');
const db = require('../database/models');
const User = db.User;
const Product = db.Product;
const Category = db.Category;
const Subcategory = db.Subcategory;

module.exports = {
    admin: (req, res) => {
        res.render('admin/adminPanel',{
            session: req.session
        });
    }
    ,
    admin_usuarios: (req, res) => {
        User.findAll()
        .then(usersData => {
            res.render('admin/adminUsersList',  {
                usersData,
                session: req.session
            });
        })
        .catch((err) => console.log("ERROR en Admin_Usuarios: "+err));
    }
    ,
    admin_detalle_usuario: (req, res) => {
        User.findOne({
            where : {
                id : req.params.id
            }
        })
        .then(user => {
            res.render('admin/adminEditUser',  {
                user,
                session: req.session
            });
        })
        .catch((err) => console.log("ERROR en Detalle Usuario: "+err));
    }
    ,
    admin_detalle_usuario_editar: (req, res) => {

        let { name, surname, address, dni, role ,email, phone, image } = req.body;

        User.update({
            name,
            surname,
            address,
            dni,
            role,
            email,
            phone,
            image
        },
        {
            where : {
                id : req.params.id
            }
        })
        .then(() => {
            res.redirect('/admin/usuarios')
        })
        .catch((err) => console.log("ERROR Editando Usuario: "+err));
    }
    ,
    admin_productos: (req, res) => {

        Product.findAll()
        .then(productsData => {
            res.render('admin/adminProductList',  {
                productsData,
                messageToDisplay : "Disponibles",
                session: req.session
            });
        })
        .catch((err) => console.log("ERROR Lista Productos Admin: "+err));

    }
    ,
    admin_agregar: (req, res) => {

        let categoriesData = Category.findAll()
        let subCategoriesData = Subcategory.findAll()

        Promise.all([categoriesData, subCategoriesData])
        .then(([categoriesData, subCategoriesData]) => {
            res.render('admin/adminAddProduct',  {
                categoriesData,
                subCategoriesData,
                session: req.session
            });
        })
        .catch((err) => console.log("ERROR Vista Agregar Producto: "+err));
    }
    ,
    admin_carga_update: (req, res) => {
        
        let errors = validationResult(req)

        if(errors.isEmpty()){

            let { image, name, color, price, stock ,discount, onsale, description , categoryid , subcategoryid} = req.body;

            Product.create({
                image,
                name,
                color,
                price,
                stock,
                discount,
                onsale,
                description,
                categoryid,
                subcategoryid
            })
            .then(() => {
                res.redirect('/admin/lista-productos');
            })
            .catch((err) => console.log("ERROR Agregando Producto: "+err));
        }
        else
        {
            let categoriesData = Category.findAll()
            let subCategoriesData = Subcategory.findAll()
            Promise.all([categoriesData, subCategoriesData])
            .then(([categoriesData, subCategoriesData])=> {
                console.log("ERROR al Agregar Producto");
                res.render("admin/adminAddProduct", {
                    categoriesData,
                    subCategoriesData,
                    errors: errors.mapped(),
                    old: req.body,
                    session: req.session
                })
            })
        }
    },
    admin_editar_producto: (req, res) => {

        let productToEdit = Product.findOne({
            where : {
                id : req.params.id
            }
        })

        let categoriesData = Category.findAll()
        let subCategoriesData = Subcategory.findAll()

        Promise.all([productToEdit, categoriesData, subCategoriesData])
        .then( ([productToEdit, categoriesData, subCategoriesData]) => {
            res.render('admin/adminEditProduct',  {
                productToEdit,
                categoriesData,
                subCategoriesData,
                session: req.session
            });
        })
        .catch((err) => console.log("ERROR Editando Producto: "+err));
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