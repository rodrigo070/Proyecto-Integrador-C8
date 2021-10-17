/* let { bannersData, productsData , usersData , categoriesData , subCategoriesData , writeProductEdit ,writeBannersEdit, writeUserEdit} = require('../data/db'); */
const { validationResult } = require('express-validator');
const db = require("../database/models");
const { Op, where } = require('sequelize')
const {eliminarImagen} = require("../data/db")

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
    },
    admin_productos: (req, res) => {
        db.Product.findAll()
        .then(products => {
            res.render('admin/adminProductList', {
                products,
                session: req.session
            })
        }).catch((err) => console.log(err))
    },
    
    
    admin_agregar: (req, res) => {
        let categoriesPromise = db.Category.findAll();
        let subcategoriesPromise = db.Subcategory.findAll();
        /* let product = db.Product.findAll() */
    
        Promise.all([categoriesPromise, subcategoriesPromise])
          .then(([categoriesPromise, subcategoriesPromise]) => {
            /* return res.json({categoriesPromise, subcategoriesPromise}) */
            res.render("admin/adminAddProduct", {
              categoriesPromise,
              subcategoriesPromise,
              session: req.session,
            });
          })
          .catch((err) => console.log(err));
    }
    ,
    admin_carga_update: (req, res) => {/* funciona */
        let errors = validationResult(req);
        if (req.fileValidatorError) {
          let image = {
            param: "image",
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
    
          let { name, price, discount, category, subcategory, description,}=req.body;
         /*  return res.json(req.body) */
          db.Product.create({
            name,
            price,
            discount,
            description,
            category,
            subcategory
          }).then(product => {
            
            if (arrayImages.length > 0) {
                let images = arrayImages.map(image => {
                    return {
                        image_Route: image,
                        product_Id: product.id
                    }
                })
                db.Product_images.bulkCreate(images)
                .then(() => res.redirect('admin/adminProductList'))
                .catch(err => console.log(err))
            }else {
                db.Product_images.create({
                    image_Route: "default-image.png",
                    product_Id: product.id
                })
                .then(() => res.redirect('admin/adminProductList'))
                .catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
          
        }else{
            console.log("ERROR al Agregar Producto");
            res.render("admin/adminAddProduct", {
                categories,
                subcategories,
                errors: errors.mapped(),
                old: req.body,
                session: req.session
            })
        }
    },
    admin_editar_producto: (req, res) => { /* no edita las imagenes ni tampoco las sube a la base de datos */
        let categoriesPromise = db.Category.findAll();
        let subcategoriesPromise = db.Subcategory.findAll();
        let product = db.Product.findByPk(req.params.id, {
            include: [{ association: "images" }],
        })
        Promise.all([categoriesPromise,subcategoriesPromise,product])
        .then(([categoriesPromise,subcategoriesPromise,product])=>{
            /* return res.json({categoriesPromise, subcategoriesPromise, product}) */
            res.render('admin/adminEditProduct',{
            categoriesPromise,
            subcategoriesPromise,
            product,
            old: req.body,
            session: req.session
            
        })}).catch(err => console.log(err)) 
    },
    admin_editar_producto_update: (req, res) => {/* Todavia No edita las imagenes ni tampoco las agrega a la base de datos */
        let errors = validationResult(req);

        if (errors.isEmpty()) {
    
          
        let product = db.Product.findByPk(req.params.id, {
            include: [{ association: "images" }],
        })
    
          let {
            name,
            color,
            price,
            stock,
            discount,
            onsale,
            description,
            category,
            subcategory
          } = req.body;
    
          db.Product.update({
            name,
            color,
            price,
            stock,
            discount,
            onsale,
            description,
            category,
            subcategory},
            { where: { id: req.params.id } })
            .then(() => {
              res.redirect('/admin/lista-productos')
            })
            .catch(error => console.log(error))
    
    
        } else {
          let categoriesPromise = db.Categorie.findAll();
          let subcategoriesPromise = db.Subcategorie.findAll();
      
          Promise.all([categoriesPromise, subcategoriesPromise])
            .then(([categories, subcategories]) => {
              db.Product.findByPk(+req.params.id)
                .then(product => {
                  res.render("admin/adminEditProduct", {
                    categories,
                    subcategories,
                    product,
                    errors: errors.mapped(),
                    old: req.body,     
                  });
                })})
                .catch((err) => console.log(err));
        
        }
    },
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
        db.Product.findByPk(req.params.id, {
          include: [
            {
              association: "images",
            },
          ],
        })
          .then((product) => {
            for (let i = 0; i < product.images.length; i++) {
              eliminarImagen(product.images[i].image_Route);
            }
          })
        .catch((err) => console.log(err))
        .then(() => {
            db.Product.findByPk(req.params.id)
            .then((product) => {
                db.Product_images.destroy({ where: { product_Id: product.id } })
                .then(() => {
                    db.Product.destroy({ where: { id: +req.params.id } });
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => console.log(err));
          }).catch((err) => console.log(err))
        .then(() => {
            res.redirect("/admin/lista-productos")
        }).catch(error => console.log(error))
      },
    
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