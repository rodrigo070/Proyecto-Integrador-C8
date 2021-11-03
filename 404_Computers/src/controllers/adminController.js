const { validationResult } = require('express-validator');
const db = require('../database/models');
const {eliminarImagen} = require("../database/config/product_config")
const User = db.User;
const History = db.History;
const Cart = db.CartProduct;
const Favorite = db.Favorite;
const Product = db.Product;
const Category = db.Category;
const Subcategory = db.Subcategory;
const Banner = db.Banner;
const Product_Images = db.ProductImage;
const { Op } = require('sequelize');

module.exports = {
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

        Product.findAll({
            include : ["images","Category","Subcategory"]
        })
        .then(productsData => {
            res.render('admin/adminPanel',  {
                productsData,
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
        let errors = validationResult(req);

        if (req.fileValidatorError) {
          let image = {
            param: "image_Route",
            msg: req.fileValidatorError,
          };
          errors.push(image);
        }

        if (errors.isEmpty()) {
          let arrayImages = [];
          if (req.files) {
            req.files.forEach((image) => {
              arrayImages.push(image.filename);
            });
          }

          let {
            name,
            price,
            discount,
            description,
            product_Category,
            product_Subcategory,
          } = req.body;
          /*  return res.json(req.body) */
          Product.create({
            name,
            price,
            finalPrice: req.body.price,
            color: "Blanco",
            discount,
            description,
            product_Category,
            onSale: 0,
            product_Subcategory,
          })
            .then((product) => {
              if (arrayImages.length > 0) {
                let images = arrayImages.map((image) => {
                  return {
                    image_Route: image,
                    product_Id: product.id,
                  };
                });
                Product_Images.bulkCreate(images)
                  .then(() => res.redirect("/admin/lista-productos"))
                  .catch((err) => console.log(err));
              } else {
                Product_Images.create({
                  image_Route: "default.jpg",
                  product_Id: product.id,
                })
                  .then(() => res.redirect("/admin/lista-productos"))
                  .catch((err) => console.log(err));
              }
            })
            .catch((err) => console.log(err));
        } else {
          let categoriesData = Category.findAll();
          let subCategoriesData = Subcategory.findAll();
          Promise.all([categoriesData, subCategoriesData]).then(
            ([categoriesData, subCategoriesData]) => {
              console.log("ERROR al Agregar Producto");
              res.render("admin/adminAddProduct", {
                categoriesData,
                subCategoriesData,
                errors: errors.mapped(),
                old: req.body,
                session: req.session,
              });
            }
          );
        }
    },
    admin_editar_producto: (req, res) => {

        const productToEdit = Product.findOne({
            where : {
                id : req.params.id
            },
            include : ["images","Category","Subcategory"]
        })

        const categoriesData = Category.findAll()
        const subCategoriesData = Subcategory.findAll()

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

        let errors = validationResult(req);

        if (errors.isEmpty()) {
          let {
            name,
            color,
            price,
            onSale,
            stock,
            discount,
            description,
            product_Category,
            product_Subcategory,
          } = req.body;

          Product.update(
            {
              name,
              color,
              price,
              finalPrice: req.body.price - (req.body.price * req.body.discount) / 100,
              onSale,
              stock,
              discount,
              description,
              product_Category,
              product_Subcategory,
            },
            {
              where: {
                id: req.params.id,
              },
            }
          )
            .then(() => {
              res.redirect("/admin/lista-productos");
            })
            .catch((error) =>
              console.log(
                "Error al Actualizar Producto : " +
                  error +
                  "++++++++++++++++++++++++++++++++++"
              )
            );
        } else {
          let categoriesData = Category.findAll();
          let subCategoriesData = Subcategory.findAll();

          Promise.all([categoriesData, subCategoriesData])
            .then(([categoriesData, subCategoriesData]) => {
              Product.findOne({
                where: {
                  id: req.params.id,
                },
              }).then((productToEdit) => {
                res.render("admin/adminEditProduct", {
                  categoriesData,
                  subCategoriesData,
                  productToEdit,
                  errors: errors.mapped(),
                  old: req.body,
                });
              });
            })
            .catch((err) =>
              console.log(
                "ERROR Ver Campos de Editar Producto " +
                  err +
                  "-----------------------------"
              )
            );
        }
    }
    ,
    admin_stock: (req, res) => {
        
        Product.findAll({
            where : {
                stock : {
                    [Op.gt]: 0, 
                }
            },
            include : ["images","Category","Subcategory"]
        })
        .then(productsData =>{
            res.render('admin/adminPanel' , {
                productsData,
                session: req.session
            });
        })
        .catch(error => {
            console.log("Tenemos un ERROR: "+error);
        });
    }
    ,
    admin_ofertas: (req, res) => {

        Product.findAll({
            where : {
                discount : {
                    [Op.gt]: 0, 
                }
            },
            include : ["images","Category","Subcategory"]
        })
        .then(productsData =>{
            res.render('admin/adminPanel' , {
                productsData,
                session: req.session
            });
        })
        .catch(error => {
            console.log("Tenemos un ERROR: "+error);
        });

    }
    ,
    banners: (req, res) => {
        
        Banner.findAll()
        .then(bannersData => {
            res.render('admin/addBanners',  {
                bannersData,
                session: req.session
            });
        })
    }
    ,
    banners_update: (req, res) => {

        let image_Route = req.file.filename;
        
        Banner.create({
            image_Route
        })
        .then(() => {
            res.redirect('/admin/banners')
        })
        .catch((err) => console.log("ERROR Agregando Banner: "+err));

    }
    ,
    searchAdmin: (req, res) => {
        let buscar = req.query.userSearch;
        console.log("BUSCAR"+buscar);
        if(buscar)
        {
            User.findAll()
            .then(UserDB => {
                let result = [];
    
                UserDB.forEach(UserSearch => {
                    if(UserSearch.name.toLowerCase().includes(req.query.busqueda) || UserSearch.surname.toLowerCase().includes(req.query.busqueda)){
                        result.push(UserSearch)
                    }
                });
                if(result.length != 0)
                {
                    res.render('admin/adminUsersList' , {
                        usersData : result,
                        search: req.query.busqueda,
                        title: req.query.busqueda+' - ',
                        session: req.session
                    });
                }
                else
                {
                    res.render('admin/adminUsersList' , {
                        usersData : [],
                        search: req.query.busqueda,
                        title: req.query.busqueda+' - ',
                        session: req.session
                    });
                }
            })
        }
        else
        {
            Product.findAll({
                include : ["images","Category","Subcategory"]
            })
            .then(ProductsDB =>{
    
                let result = [];
    
                ProductsDB.forEach(ProductSearch => {
                    if(ProductSearch.name.toLowerCase().includes(req.query.busqueda)){
                        result.push(ProductSearch)
                    }
                });
    
                if(result.length != 0)
                {
                    res.render('admin/adminPanel' , {
                        productsData : result,
                        search: req.query.busqueda,
                        title: req.query.busqueda+' - ',
                        session: req.session
                    });
                }
                else
                {
                    res.render('admin/adminPanel' , {
                        productsData : [],
                        search: req.query.busqueda,
                        title: req.query.busqueda+' - ',
                        session: req.session
                    });
                }
            })
            .catch(error => {
                console.log("Tenemos un ERROR: "+error);
            });
        }        
    }
    ,
    borrar_banner: (req, res) => {

        Banner.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(()=> {
            res.redirect('/admin/banners');
        })
        .catch(errr => {
            console.log("ERROR AL BORRAR BANNER : "+errr);
            res.redirect('/admin/banners');
        })

    }
    ,
    borrar_Producto: (req, res) => {
        Product.findByPk(req.params.id, {
            include: [{
                association: "images",
            }, ],
        })
        .then((product) => {
            for (let i = 0; i < product.images.length; i++) {
                eliminarImagen(product.images[i].image_Route);
            }
        })
        .catch((err) => console.log(err))
        .then(() => {
            Product.findByPk(req.params.id)
            .then((product) => {
                Product_Images.destroy({
                        where: {
                            product_Id: product.id
                        }
                    })
                    .then(() => {
                        Product.destroy({
                            where: {
                                id: +req.params.id
                            }
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
            }).catch((err) => console.log(err));
        }).catch((err) => console.log(err))
        .then(() => {
            res.redirect("/admin")
        }).catch(error => console.log(error))
    }
    ,
    borrar_usuario: (req, res) => {
        History.destroy({
            where: {
                user_ID: req.params.id
            }
        })
        Cart.destroy({
            where: {
                user_ID: req.params.id
            }
        })
        Favorite.destroy({
            where: {
                user_ID: req.params.id
            }
        })
        User.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(()=> {
            res.redirect('/admin/usuarios');
        })
        .catch(errr => {
            console.log("ERROR AL BORRAR USUARIO : "+errr);
            res.redirect('/admin/usuarios');
        })
    }
}