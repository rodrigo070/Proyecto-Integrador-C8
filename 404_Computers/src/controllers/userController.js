//let {productsData, usersData , writeUserEdit} = require('../data/db');
const { validationResult } = require('express-validator');
let bcrypt = require("bcrypt");
let db = require ('../database/models')

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/* al adaptarlo es necesario poner el user/ para que encuentre la carpeta con el archivo ejs */

module.exports = {
    login: (req, res) => {
        res.render('users/login',{
            session: req.session
        });
    },
    editProfile: (req, res) => {

        db.User.findByPk(req.session.user.id).then((user) => {
            res.render("users/editProfile", {
              user,
              session: req.session,
            });
          });
        },
        updateProfile: (req, res) => {
                            let errors = validationResult(req);
            if (errors.isEmpty()) {
              let {name, surname,address,phone,dni } = req.body;
              db.User.update({
                name,
                surname,
                address,
                phone,
                dni
              }, {
                where: {
                  id: req.params.id
                }
              })
              .then(() => {
                db.User.create({
                   surname,address,phone,dni,
                  userId: req.params.id
                  
                }) 
                .then(() => {
                  res.redirect('users/profile')
                })
              })
             
        
     
            } else {
              res.render("editar-perfil", {
                errors: errors.mapped(),
                old: req.body,
                session: req.session,
              });
            }
        
    },
    profile: (req, res) => {
       // let users = usersData.find(user => user.id === +req.params.id)
        db.User.findByPk(req.session.user.id).then((user)=>{
          
        res.render('users/profile',{
            user,
            session: req.session
        });
        })
    },

    processLogin: (req, res) => {
		let errors = validationResult(req);

		if(errors.isEmpty())
		{
            db.User.findOne({
                where :{
                    email:req.body.email
                }
            })
            



         .then(user=>{
             req.session.user ={
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
                image: user.image,
                address: user.address,
                phone: user.phone,
                dni: user.dni,
                favorites: user.favorites,
                cartproducts: user.cartproducts
             };
           
                res.cookie("user404", req.session.user, 
                {expires: new Date(Date.now() + 900000),
                    httpOnly : true})
            
            res.locals.user = req.session.user
			res.redirect(`/perfil/${user.id}`) 
           // res.redirect('/') 
          //  .catch((err) => console.log(err));
         })     
        



			/*let user = usersData.find(user => user.email === req.body.email)

			req.session.user = {

                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                rol: user.rol,
                image: user.image,
                address: user.address,
                phoneNumber: user.phoneNumber,
                dni: user.dni

			}
            if(req.body.rememberDevice){
                res.cookie("user404", req.session.user, {expires: new Date(Date.now() + 900000),httpOnly : true})
            }

			res.locals.user = req.session.user
			res.redirect(`/perfil/${user.id}`) /* Cambie esto para que redireccione con la ruta parametrizada */
		}
		else
		{	
			
			res.render('users/login', {
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
        
        if (errors.isEmpty()) { 
        let{ name,surname,email,pass} = req.body
            
        db.User.create ({
          name,
          surname,
          email,
          pass:bcrypt.hashSync(pass, 12),
          rol :0,

        }).then (()=>{
            res.redirect('/login')
        }).catch(Error=> console.log ("tenemos un erorr"+Error))
        

            /*const {6312314631616333
                name,
                surname,
                email,
                pass
            } = req.body

            let newUser = {jhjhjhjhjh
                id : usersData[usersData.length - 1].id + 1,
                name,
                surname,
                email,
                pass : bcrypt.hashSync(pass, 12),
                rol: "ROLE_USER",
                image: "user_default.jpg",
                address: "",
                phoneNumber: 0,
                dni: "",
            }
            console.log(newUser)
            usersData.push(newUser)

            writeUserEdit(usersData)

            res.redirect('/login')
            
        }*/
     } else
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
        res.render('users/favorites' , {
            productsData,
            session: req.session,
            toThousand
        });
    }
    ,
    
    cart: (req, res) => {
        res.render('users/cart' , {
            productsData,
            session: req.session,
            toThousand
        });
    },
    logout: (req, res) => {
        req.session.destroy()
        if(req.cookies.user404){
            res.cookie('user404', '', {maxAge: -1})
        }

        res.redirect('/')
    }
}