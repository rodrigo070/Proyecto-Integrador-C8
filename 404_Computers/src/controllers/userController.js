const { validationResult } = require('express-validator');
let bcrypt = require("bcrypt");
const db = require('../database/models');
const User = db.User;
const Product = db.Product;

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const toDNI = n => n.toString().replace(/\d(?=(?:\d{3})+$)/g, '$&.');

module.exports = {
    login: (req, res) => {
        res.render('users/login',{
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
            res.redirect(`/perfil/${user.id}`)
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
                    session: req.session,
                    toThousand
                })
            })
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
                let result = []
                productsData.forEach(cart => {
                    for (let i = 0; i < user.cartProducts.length; i++) {
                        if (user.cartProducts[i].cart_Product === cart.id) {
                            result.push(cart)
                        }
                    }
                });

                res.render("users/cart" , {
                    productsData : result,
                    sliderProducts,
                    session: req.session,
                    toThousand
                })
            })
        })
        
    },
    logout: (req, res) => {
        req.session.destroy()
        if(req.cookies.user404){
            res.cookie('user404', '', {maxAge: -1})
        }

        res.redirect('/')
    }
}