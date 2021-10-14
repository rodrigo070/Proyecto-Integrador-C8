module.exports = function(sequelize, DataTypes){
    let alias = "ProductImage";

    let cols = {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
        },
        image_Route: {
            type: DataTypes.STRING
        },
        product_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }

    let config = {
        tableName: "products_Images",
        timestamps: false
    }

    const ProductImage = sequelize.define(alias, cols, config)

    ProductImage.associate = models => {

        ProductImage.belongsTo(models.Product, {
            as: "Product",
            foreignKey: "product_Id"
        })

    }

    return ProductImage
}