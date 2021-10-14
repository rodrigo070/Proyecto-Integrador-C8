const db = require('../database/models');
const Product = db.Product; 
const Category = db.Category;
const Subcategory = db.Subcategory;
const Banner = db.Banner;
const { Op } = require('sequelize');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
    home: (req, res) => {
        
        const bannersData = Banner.findAll()
        const productsData = Product.findAll({
            include : ["image","Category","Subcategory"]
        })
        Promise.all([productsData,bannersData])
        .then(([productsData,bannersData]) =>{
            res.render('home' , {
                productsData,
                bannersData,
                sliderProducts : productsData,
                session: req.session,
                toThousand
            });
        })
        .catch(error => {
            console.log("Tenemos un ERROR: "+error);
        });
    }
    ,
    location: (req, res) => {
        res.render('location',{
            session: req.session
        });
    }
    ,
    contact: (req, res) => {
        res.render('contact',{
            session: req.session
        });
    }
    ,
    about: (req, res) => {
        res.render('404computers',{
            session: req.session
        });
    }
    ,
    terms: (req, res) => {
        res.render('termsAndCond',{
            session: req.session
        });
    }
    ,
    search: (req, res) => {

        const categories = Category.findAll()
        const products = Product.findAll({
            include : ["image","Category","Subcategory"]
        })
        Promise.all([products,categories])
        .then(([products,categories]) =>{

            let result = [];

            products.forEach(product => {
                if(product.name.toLowerCase().includes(req.query.producto)){
                    result.push(product)
                }
            });

            if(result.length != 0)
            {
                res.render('products/productsList' , {
                    products : result,
                    categories,
                    subCategoriesFiltered : 0,
                    search: req.query.producto,
                    title: req.query.producto+' - ',
                    session: req.session,
                    toThousand
                });
            }
            else
            {
                res.render('errorPage', {
                    error: `Lo sentimos el Producto: ${req.query.producto} no existe o fue removido de la pagina.`,
                    session: req.session
                })
            }
        })
        .catch(error => {
            console.log("Tenemos un ERROR: "+error);
        });
        
    }
}