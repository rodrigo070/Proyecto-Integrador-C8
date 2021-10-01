const { compareSync } = require('bcrypt');
const db = require('../database/models');
const Product = db.Product;
const Category = db.Category;
const Subcategory = db.Subcategory;
const Sequelize = db.sequelize;
const Op  = Sequelize.Op;

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
    productsList: (req, res) => {

        const categories = Category.findAll()
        const products = Product.findAll({
            include : ["Category","Subcategory"]
        })
        Promise.all([products,categories])
        .then(([products,categories]) =>{
            res.render('products/productsList' , {
                products,
                categories,
                subCategoriesFiltered : 0,
                title : 'Productos - ',
                session: req.session,
                toThousand
            });
        })
        .catch(error => {
            console.log("Tenemos un ERROR: "+error);
        });

    }
    ,
    product_Detail: (req, res) => {

        Product.findByPk(req.params.id, {
            include : ["Category","Subcategory"]
        })
        .then(productDetail => {
            /* console.log("DATO QUE QUEREMOS VER ->>>>>>>>"+productDetail.Subcategory.subcategory); */
            if(req.params.category === productDetail.Category.categorylink && req.params.subcategory === productDetail.Subcategory.subcategorylink)
            {
                Product.findAll({
                    include :  ["Category","Subcategory"]
                })
                .then(sliderProducts=>{
                    res.render('products/productDetail' , {
                        product : productDetail,
                        sliderProducts,
                        session: req.session,
                        toThousand
                    })
                })
                .catch(error => {
                    console.log("Tenemos un ERROR: "+error);
                });
            }
            else
            {
                res.render('errorPage' , {
                    error: "El Producto al cual intenta acceder no existe o fue removido de la pagina.",
                    session: req.session
                })
            }
        })
        .catch(error => {
            console.log("Tenemos un ERROR: "+error);
        });
    }
    ,
    categories: (req, res) => {

        Category.findAll()
        .then(categories => {

            let filterThisCategory = 0;
            let title;

            categories.forEach(catg => {
                if(req.params.category === catg.categorylink)
                {
                    filterThisCategory = catg.id;
                    title = catg.category;
                }
            });
        
            Product.findAll({
                include :  ["Category","Subcategory"],
                where : {
                    categoryId : filterThisCategory
                }
            })
            .then(products=>{

                Subcategory.findAll({
                    where : {
                        categoryid : filterThisCategory
                    }
                })
                .then(subcategories => {

                    res.render('products/productsList', {
                        products,
                        categories,
                        title : title+" - ",
                        linkOfCategory : req.params.category,
                        subCategoriesFiltered : 1,
                        subcategories,
                        session: req.session,
                        toThousand
                    });

                })
    
            })

        })
        .catch(error => {
            console.log("Tenemos un ERROR: "+error);
        });
    }
    ,
    subCategories: (req, res) => {
        let categoryId = req.params.category;
        let subCategoryId = req.params.subcategory;
        let subCategoriesFiltered = []; 

        let category = categoriesData.find(category => {
            return category.category === categoryId;
        });

        let subCategory = subCategoriesData.find(subcategory => {
            return subcategory.subcategory === subCategoryId;
        });

        subCategoriesFiltered = subCategoriesData.filter(subCatg => {
            if(subCatg.categoryID === category.categoryID)
            {
                return subCategoriesFiltered;
            }
        });

        if(category !== undefined && subCategory !== undefined) {
            let product = productsData.filter(product => {
                if(product.category === categoryId && product.subcategory === subCategoryId){
                    return product;
                }
            });

            res.render('products/productsList', {
                products_List:product,
                category,
                subCategory,
                subCategoriesFiltered,
                products_List_Catg : categoriesData,
                title : subCategory.subcategoryName+' - ',
                session: req.session,
                toThousand
            });
        }
        else
        {
            res.render('errorPage', {
                error: "La Sub Categoria a la cual intenta acceder no existe o fue removida de la pagina.",
                session: req.session
            });
            console.log("la subcategoria ingresada no existe");
        }
    }
    ,
    offers: (req, res) => {
        let products = productsData.filter(product => product.discount > 0);

        let subCategoriesFiltered = [];
        res.render("products/productsList", {
            products_List : products,
            products_List_Catg : categoriesData,
            products_List_SubCatg : subCategoriesData,
            subCategoriesFiltered,
            title : 'Ofertas - ',
            session: req.session,
            toThousand
        })
    }
}