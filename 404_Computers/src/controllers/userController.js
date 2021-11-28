const { validationResult } = require('express-validator');
let bcrypt = require("bcrypt");
const db = require('../database/models');
const User = db.User;
const Product = db.Product;
const History = db.History;
const Cart = db.CartProduct;
const Favorite = db.Favorite;

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const toDNI = n => n.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&.');

module.exports = {
    login: (req, res) => {
        res.render('users/login',{
            pageURL : "productos",
            session: req.session
        });
    },
    editProfile: (req, res) => {

        User.findOne({
            where : {
                id : req.session.user.id
            },
            include: [{ association: "historyProducts" }]
        }).then((user) => {
            res.render("users/editProfile", {
                user,
                pageURL : "productos",
                session: req.session,
            });
        });

    },
    updateProfile: (req, res) => {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
          let { email, name, surname, address, phone, dni } = req.body;
          User.update(
            {
                email,
                name,
                surname,
                address,
                image : req.file ? req.file.filename : req.body.image,
                phone,
                dni,
            },
            {
              where: {
                id: req.params.id,
              }
            }
          ).then(() => {
            res.redirect(`/perfil/${req.session.user.id}`);
          })
        } else {
          res.render("users/editProfile", {
            errors: errors.mapped(),
            old: req.body,
            session: req.session
          });
        }

    },
    profile: (req, res) => {
        User.findOne({
            where : {
                id : req.session.user.id
            },
            include: [{ association: "historyProducts"}]
        }).then(users=>{
          
            res.render('users/profile',{
                users,
                toDNI,
                pageURL : "productos",
                session: req.session
            });
        })
        .catch(error => {
            console.log("Tenemos un ERROR: "+error);
        });
    },
    processLogin: (req, res) => {
		
        let errors = validationResult(req);

        if (errors.isEmpty()) {
          User.findOne({
            where: {
              email: req.body.email,
            },
          }).then(user => {
            req.session.user = {
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
                image: user.image,
                address: user.address,
                phone: user.phone,
                dni: user.dni
            };
    
            if(req.body.rememberDevice){
                res.cookie("user404", req.session.user, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true,
                });
            }

    
            res.locals.user = req.session.user;
            res.redirect("/")
          });
        }
        else
        {
          res.render('./users/login', {
            errors: errors.mapped(),
            session: req.session
          });
        }

	},
    register: (req, res) => {
        res.render('users/register',{
            pageURL : "productos",
            session: req.session
        });
    }
    ,
    processRegister: (req, res) => {
        let errors = validationResult(req)
        
        if(errors.isEmpty()){           

        let { name, surname, email, pass } = req.body

        User.create ({
            name,
            surname,
            email,
            pass:bcrypt.hashSync(pass, 12),
            role : "ROLE_USER",
            image : "user_default.jpg",
            address : "",
            phone: 0,
            dni: 0
    
            }).then(()=>{
                res.redirect('/login')
            }).catch(err => console.log ("tenemos un error con el registro en el db "+err))
            
        }
        else
        {
            res.render('users/register', {
                errors: errors.mapped(),
                old : req.body,
                session: req.session
            });
        }
    }
    ,
    favorites: (req, res) => {

        User.findOne({
            where : {
                id : req.session.user.id
            },
            include: [{ association: "favorites"}] 
        })
        .then(user => {

            Product.findAll({
                include : ["images","Category","Subcategory"]
            })
            .then(productsData => {
                let result = []
                productsData.forEach(favorited => {
                    for (let i = 0; i < user.favorites.length; i++) {
                        if (user.favorites[i].favorite_Product === favorited.id) {
                            result.push(favorited)
                        }
                    }
                });

                res.render("users/favorites" , {
                    productsData : result,
                    pageURL : "productos",
                    session: req.session,
                    toThousand
                })
            })
        })
        
    }
    ,
    history: (req, res) => {
        User.findOne({
            where : {
                id : req.session.user.id
            },
            include: [{ association: "historyProducts"}]
        })
        .then(user => {

            Product.findAll({
                include : ["images","Category","Subcategory"]
            })
            .then(productsData => {
                
                let result = [];
                
                productsData.forEach(historyData => {
                    for (let i = 0; i < user.historyProducts.length; i++) {
                        if (user.historyProducts[i].product_ID === historyData.id) {
                            result.push(historyData)
                        }
                    }
                });

                res.render("users/history" , {
                    productsData : result,
                    pageURL : "productos",
                    session: req.session,
                    toThousand
                })
            })
        })
    }
    ,
    borrar_perfil: (req, res) => {
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
            req.session.destroy()
            if(req.cookies.user404){
                res.cookie('user404', '', {maxAge: -1})
            }

            res.redirect('/');
        })
        .catch(errr => {
            console.log("ERROR AL BORRAR PERFIL : "+errr);
            res.redirect('/editar-perfil');
        })
    }
    ,
    delHistoryProduct: (req, res) => {
        History.destroy({
            where : {
                product_ID : req.params.id,
                user_ID : req.session.user.id
            }
        })
        .then(()=> {
            res.redirect('/historial');
        })
        .catch(errr => {
            console.log("ERROR AL BORRAR PRODUCTO DEL HISTORIAL : "+errr);
            res.redirect('/historial');
        })
    }
    ,
    cart: (req, res) => {

        User.findOne({
            where : {
                id : req.session.user.id
            },
            include: [{ association: "cartProducts"}] 
        })
        .then(user => {

            Product.findAll({
                include : ["images","Category","Subcategory"]
            })
            .then(productsData => {
                let sliderProducts = productsData;
                
                let listOfProducts = [];
                let ListOfQuantity = []
                productsData.forEach(cart => {
                    for (let i = 0; i < user.cartProducts.length; i++) {
                        if (user.cartProducts[i].cart_Product === cart.id) {
                            listOfProducts.push(cart)
                            ListOfQuantity.push(user.cartProducts[i])
                        }
                    }
                });

                ListOfQuantity = ListOfQuantity.reverse();

                let totalToPay = 0;

                for (let i = 0; i < listOfProducts.length; i++) {
                    totalToPay = totalToPay + listOfProducts[i].finalPrice*ListOfQuantity[i].cart_Quantity 
                }

                /* res.send(productsData[0].CartProducts); */
                res.render("users/cart" , {
                    productsData : listOfProducts,
                    sliderProducts,
                    cartData : ListOfQuantity,
                    totalToPay,
                    cartObj : (user.cartProducts).length,
                    pageURL : "productos",
                    session: req.session,
                    toThousand
                })
            })
        })
        .catch(errr => {
            console.log("ERROR EN PRODUCTOS CARRITO : "+errr);
        })
        
    },
    cart_delete: (req, res) => {
        Cart.destroy({
            where : {
                cart_Product : req.params.id,
                user_ID : req.session.user.id
            }
        })
        .then(()=> {
            res.redirect('/carrito');
        })
        .catch(errr => {
            console.log("ERROR AL BORRAR PRODUCTO DEL CARRITO : "+errr);
            res.redirect('/carrito');
        })
    }
    ,
    cart_plus_stock: (req, res) => {

        let products = Product.findOne({
            where : {
                id : req.params.id
            }
        })

        let foundProduct = Cart.findOne({
            where: {
                cart_Product : req.params.id
            }
        })
        Promise.all([products,foundProduct])
        .then( ([products,foundProduct])=>{

            let number = foundProduct.cart_Quantity

            if (number >= products.stock) {
                number = products.stock
            }
            else
            {
                number = number+1
            }

            Cart.update({
                cart_Quantity : number,
            },
            {
              where: {
                cart_Product: req.params.id,
                user_ID: req.session.user.id
              }
            }
            ).then(() => {
                console.log("Stock Agregado del Carrito Actualizado");
                res.redirect('/carrito');
            })
            .catch(errr => {
                console.log("ERROR AL AUMENTAR STOCK DEL CARRITO : "+errr);
            })
        })
        .catch(errr => {
            console.log("ERROR AL BUSCAR STOCK DEL CARRITO +: "+errr);
        })
    }
    ,
    cart_minus_stock: (req, res) => {

        Cart.findOne({
            where: {
                cart_Product : req.params.id
            }
        })
        .then(foundProduct =>{

            let number = foundProduct.cart_Quantity

            if (number === 1) {
                number = 1
            }
            else
            {
                number = number-1
            }

            Cart.update({
                cart_Quantity : number,
            },
            {
              where: {
                cart_Product: req.params.id,
                user_ID: req.session.user.id
              }
            }
            ).then(() => {
                console.log("Stock Restado del Carrito Actualizado");
                res.redirect('/carrito');
            })
            .catch(errr => {
                console.log("ERROR AL RESTAR STOCK DEL PRODUCTO: "+errr);
            })
        })
        .catch(errr => {
            console.log("ERROR AL BUSCAR STOCK DEL CARRITO -: "+errr);
        })
    }
    ,
    favorite_delete_user: (req, res) => {
        Favorite.destroy({
            where : {
                favorite_Product : req.params.id,
                user_ID : req.session.user.id
            }
        })
        .then(()=> {
            res.redirect('/favoritos');
        })
        .catch(errr => {
            console.log("ERROR AL BORRAR PRODUCTO DE Favoritos : "+errr);
            res.redirect('/favoritos');
        })
    }
    ,
    logout: (req, res) => {
        req.session.destroy()
        if(req.cookies.user404){
            res.cookie('user404', '', {maxAge: -1})
        }
        res.redirect('/')
    }
}