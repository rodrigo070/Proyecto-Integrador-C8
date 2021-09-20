let {productsData, usersData , writeUserEdit} = require('../data/db');
const { validationResult } = require('express-validator');
let bcrypt = require("bcrypt");

/* al adaptarlo es necesario poner el user/ para que encuentre la carpeta con el archivo ejs */

module.exports = {
    login: (req, res) => {
        res.render('users/login',{
            session: req.session
        });
    }
    ,
    processLogin: (req, res) => {
		let errors = validationResult(req);

		if(errors.isEmpty())
		{
			let user = usersData.find(user => user.email === req.body.email)

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

			res.locals.user = req.session.user
			res.redirect('/perfil')
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

            const {
                name,
                surname,
                email,
                pass
            } = req.body

            let newUser = {
                id : usersData[usersData.length - 1].id + 1,
                name,
                surname,
                email,
                pass : bcrypt.hashSync(pass, 12),
                rol: "ROL_USER",
                image: "user_default.jpg",
                address: "",
                phoneNumber: 0,
                dni: 0,
            }
            console.log(newUser)
            usersData.push(newUser)

            writeUserEdit(usersData)

            res.redirect('/login')
            
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
        res.render('users/favorites' , {
            productsData,
            session: req.session
        });
    }
    ,
    editProfile: (req, res) => {
        res.render('users/editProfile',{
            session: req.session
        });
    }
    ,
    profile: (req, res) => {
        res.render('users/profile',{
            session: req.session
        });
    }
    ,
    cart: (req, res) => {
        res.render('users/cart' , {
            productsData,
            session: req.session
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