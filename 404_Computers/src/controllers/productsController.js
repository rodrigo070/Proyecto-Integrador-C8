const db = require('../database/models');
const User = db.User; 
const Product = db.Product; 
const Category = db.Category;
const Subcategory = db.Subcategory;
const History = db.History;
const { Op } = require('sequelize');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

module.exports = {
    productsList: (req, res) => {

        const categories = Category.findAll()
        const products = Product.findAll({
            include : ["images","Category","Subcategory"]
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

        let sliderProducts = Product.findAll({
            include :  ["images","Category","Subcategory"]
        })

        let product = Product.findOne({
                where : {
                    id : req.params.id
                },
                include : ["images","Category","Subcategory"]
            }
        )

        Promise.all([sliderProducts , product])
        .then(([sliderProducts , product]) => {
            if(req.params.category === product.Category.category_Link && req.params.subcategory === product.Subcategory.subcategory_Link)
            {
                if(req.session.user)
                {
                    User.findOne({
                        where : {
                            id : req.session.user.id
                        },
                        include: ["favorites","historyProducts"] 
                    })
                    .then(user => {
                        
                        History.findOne({
                            where : {
                                product_ID : req.params.id,
                                user_ID : user.id
                            }
                        })
                        .then(productFound => {
                            if(!productFound)
                            {
                                History.create(
                                    {
                                        user_ID : user.id,
                                        product_ID : product.id
                                    },
                                    {
                                        where: {
                                            id: user.id,
                                        }
                                    }
                                )
                            }
                        })

                        let favoriteItem = -1;

                        for (let i = 0; i < user.favorites.length; i++) {
                            if (user.favorites[i].favorite_Product === product.id) {
                                favoriteItem = 1
                            }
                        }

                        res.render('products/productDetail' , {
                            product,
                            sliderProducts,
                            favoriteItem,
                            session: req.session,
                            toThousand
                        })
                    })
                }
                else
                {
                    res.render('products/productDetail' , {
                        product,
                        sliderProducts,
                        favoriteItem : -1,
                        session: req.session,
                        toThousand
                    })
                }
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
            console.log("Tenemos un ERROR al mostrar Producto: "+error);
        });
    }
    ,
    categories: (req, res) => {

        Category.findOne({
            where : {
                category_Link : req.params.category
            }
        })
        .then(categoryPage => {

            let categories = Category.findAll()

            let products = Product.findAll({
                include :  ["images","Category","Subcategory"],
                where : {
                    product_Category : categoryPage.id
                }
            })

            let subcategories = Subcategory.findAll({
                where : {
                    category_Id : categoryPage.id
                }
            })

            Promise.all([categoryPage,categories, products,subcategories])
            .then(([categoryPage,categories, products,subcategories]) => {
                
                res.render('products/productsList', {
                    products,
                    categories,
                    title : categoryPage.category_Name+" - ",
                    linkOfCategory : req.params.category,
                    subCategoriesFiltered : 1,
                    subcategories,
                    session: req.session,
                    toThousand
                });
            })
            .catch(error => {
                console.log("Tenemos un ERROR: "+error);
            });
                
        })
        .catch(() => {
            res.render('errorPage' , {
                error: "La Categoria a la cual intenta acceder no existe o fue removida de la pagina.",
                session: req.session
            });
        });
    }
    ,
    subCategories: (req, res) => {

        Subcategory.findOne({
            where : {
                subcategory_Link : req.params.subcategory
            }
        })
        .then(subcategoryPage => {

            let categories = Category.findAll()

            let products = Product.findAll({
                include :  ["images","Category","Subcategory"],
                where : {
                    product_Subcategory : subcategoryPage.id
                }
            })

            let subcategories = Subcategory.findAll({
                where : {
                    category_Id : subcategoryPage.category_Id
                }
            })

            Promise.all([subcategoryPage,categories, products,subcategories])
            .then(([subcategoryPage,categories, products,subcategories]) => {
                
                res.render('products/productsList', {
                    products,
                    categories,
                    title : subcategoryPage.subcategory_Name+" - ",
                    linkOfCategory : req.params.category,
                    subCategoriesFiltered : 1,
                    subcategories,
                    session: req.session,
                    toThousand
                });
            })
            .catch(error => {
                console.log("Tenemos un ERROR: "+error);
            });

        })
        .catch(error => {
            res.render('errorPage' , {
                error: "La Sub Categoria a la cual intenta acceder no existe o fue removida de la pagina.",
                session: req.session
            });
        });

    }
    ,
    offers: (req, res) => {
        
        const categories = Category.findAll()
        const products = Product.findAll({
            where : {
                discount : {
                    [Op.gt]: 0, 
                }
            },
            include : ["images","Category","Subcategory"]
        })
        Promise.all([products,categories])
        .then(([products,categories]) =>{
            res.render('products/productsList' , {
                products,
                categories,
                subCategoriesFiltered : 0,
                title : 'Ofertas - ',
                session: req.session,
                toThousand
            });
        })
        .catch(error => {
            console.log("Tenemos un ERROR: "+error);
        });
    }
    ,
    order_low: (req, res) => {
        const categories = Category.findAll()
        const products = Product.findAll({
            include : ["images","Category","Subcategory"],
            order: [
                ["finalPrice", "ASC"]
            ]
        })
        Promise.all([products,categories])
        .then(([products,categories]) =>{

            res.render('products/productsList' , {
                products,
                categories,
                subCategoriesFiltered : 0,
                title : 'Menor A Mayor - ',
                session: req.session,
                toThousand
            });
        })
        .catch(error => {
            console.log("Tenemos un ERROR: "+error);
        });
    }
    ,
    order_high: (req, res) => {
        const categories = Category.findAll()
        const products = Product.findAll({
            include : ["images","Category","Subcategory"],
            order: [
                ["finalPrice", "DESC"]
            ]
        })
        Promise.all([products,categories])
        .then(([products,categories]) =>{

            res.render('products/productsList' , {
                products,
                categories,
                subCategoriesFiltered : 0,
                title : 'Mayor a Menor - ',
                session: req.session,
                toThousand
            });
        })
        .catch(error => {
            console.log("Tenemos un ERROR: "+error);
        });
    }
}