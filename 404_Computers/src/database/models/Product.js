module.exports = (sequelize,DataTypes) => {
    let alias = 'Product';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
        }
        ,
        image0: DataTypes.STRING,
        image1: DataTypes.STRING,
        image2: DataTypes.STRING,
        image3: DataTypes.STRING,
        name: DataTypes.STRING,
        color: DataTypes.STRING,
        price : DataTypes.DECIMAL,
        stock : DataTypes.INTEGER,
        discount : DataTypes.INTEGER,
        onsale : DataTypes.BOOLEAN,
        description: DataTypes.TEXT,
        categoryid : DataTypes.INTEGER,
        subcategoryid : DataTypes.INTEGER
    }
    let config = {
        timestamps: false
    }
    const Product = sequelize.define(alias, cols , config);
    Product.associate = function(models){
        Product.belongsTo(models.Category, {
            as : 'Category',
            foreignKey: 'categoryid',
            sourceKey: 'id',
            timestamps: false
        })

        Product.belongsTo(models.Subcategory, {
            as : 'Subcategory',
            foreignKey: 'subcategoryid',
            sourceKey: 'id',
            timestamps: false
        })
    }
    return Product;
}