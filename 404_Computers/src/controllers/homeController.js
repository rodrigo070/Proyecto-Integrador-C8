let { bannersData,productsData,categoriesData,subCategoriesData }  = require('../data/db');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

//aca controlamos la vista y las funciones por defecto se
//renderiza la vista que queremos de la carpeta views
//por aca podemos controlar que datos queremos que muestre por pantalla

module.exports = {
    home: (req, res) => {
        res.render('home' , {
            productsData,
            bannersData,
            session: req.session,
            toThousand
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
        let result = [];
        let subCategoriesFiltered = [];

        productsData.forEach(product => {
            if(product.name.toLowerCase().includes(req.query.producto)){
                result.push(product)
            }
        });
        
        if(result.length != 0)
        {
            res.render('products/productsList', {
                products_List : result,
                products_List_Catg : categoriesData,
                products_List_SubCatg : subCategoriesData,
                category : categoriesData,
                subCategoriesFiltered,
                search: req.query.producto,
                session: req.session,
                title: req.query.producto+' - ',
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
    }
}