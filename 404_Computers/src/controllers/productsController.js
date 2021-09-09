let { productsData,categoriesData,subCategoriesData } = require('../data/db');

module.exports = {
    productsList: (req, res) => {
        let subCategoriesFiltered = [];
        res.render('products/productsList' , {
            products_List : productsData,
            products_List_Catg : categoriesData,
            products_List_SubCatg : subCategoriesData,
            subCategoriesFiltered
        });

    }
    ,
    product_Detail: (req, res) => {
        let productCatg = req.params.category;
        let productSubCatg = req.params.subcategory;
        let productID = +req.params.id;

        /* aca valido que la categoria y subcategoria de la URL
        coincidan con los datos de la base de datos en caso de
        que no coincida devuelvo por consola un mensaje de error
        */
       
        let productToDisplay = productsData.find(productToDisplay => productToDisplay.id === productID && productToDisplay.category === productCatg && productToDisplay.subcategory === productSubCatg);
        
        if(productToDisplay !== undefined)
        {
            res.render('products/productDetail' , {
                productToDisplay,
                productsData
            });
        }
        else
        {
            res.render('errorPage' , {
                error: "El Producto al cual intenta acceder no existe o fue removido de la pagina."
            });
            console.log("el producto no existe o fue removido de la tienda");
        }
    }
    ,
    categories: (req, res) => {
        let categoryId = req.params.category;
        let subCategoriesFiltered = []; 

        let category = categoriesData.find(category => {
            return category.category === categoryId;
        });

        if(category !== undefined){
            subCategoriesFiltered = subCategoriesData.filter(subCatg => {
                if(subCatg.categoryID === category.categoryID)
                {
                    return subCategoriesFiltered;
                }
            });
        }

        if(category !== undefined) {
            let product = productsData.filter(product => {
                return product.category === categoryId;
            });
        
            res.render('products/productsList', {
                products_List:product,
                category,
                subCategoriesFiltered,
                products_List_Catg : categoriesData
            });
        }
        else
        {
            res.render('errorPage' , {
                error: "La Categoria a la cual intenta acceder no existe o fue removida de la pagina."
            });
            console.log("la categoria ingresada no existe");
        }
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
            product = productsData.filter(product => {
                if(product.category === categoryId && product.subcategory === subCategoryId){
                    return product;
                }
            });
        
            res.render('products/productsList', {
                products_List:product,
                category,
                subCategory,
                subCategoriesFiltered,
                products_List_Catg : categoriesData
            });
        }
        else
        {
            res.render('errorPage', {
                error: "La Sub Categoria a la cual intenta acceder no existe o fue removida de la pagina."
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
            subCategoriesFiltered
        })
    }
}