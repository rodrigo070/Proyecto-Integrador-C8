const fs = require('fs');
const path = require('path');

//aca paso la variable productsData que contiene el archivo json parseado para ser utilizado en products

module.exports = {
    productsData: JSON.parse(fs.readFileSync(path.join(__dirname, '/productList.json'), "utf-8")),
    categoriesData: JSON.parse(fs.readFileSync(path.join(__dirname, '/categories.json'), "utf-8")),
    subCategoriesData: JSON.parse(fs.readFileSync(path.join(__dirname, '/subcategories.json'), "utf-8"))
}