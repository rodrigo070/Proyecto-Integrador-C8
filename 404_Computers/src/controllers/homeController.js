let { productsData,categoriesData,subCategoriesData }  = require('../data/db');

//aca controlamos la vista y las funciones por defecto se
//renderiza la vista que queremos de la carpeta views
//por aca podemos controlar que datos queremos que muestre por pantalla

module.exports = {
    home: (req, res) => {
        res.render('home' , {productsData});
    }
    ,
    location: (req, res) => {
        res.render('location');
    }
    ,
    contact: (req, res) => {
        res.render('contact');
    }
    ,
    about: (req, res) => {
        res.render('404computers');
    }
    ,
    terms: (req, res) => {
        res.render('termsAndCond');
    }
    ,
    search: (req, res) => {
        let result = [];
        let subCategoriesFiltered = [];

		productsData.forEach(product => {
			if(product.name.toLowerCase().includes(req.query.keywords)){
				result.push(product)
			}
		});

		res.render('products/productsList', {
			products_List : result,
            products_List_Catg : categoriesData,
            products_List_SubCatg : subCategoriesData,
            category : categoriesData,
            subCategoriesFiltered,
			search: req.query.keywords
		});
    }
}