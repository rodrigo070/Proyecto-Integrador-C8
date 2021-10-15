module.exports = (sequelize,DataTypes) => {
    let alias = 'Category';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
        },
        category: DataTypes.STRING,
        categorylink: DataTypes.STRING,
    }

    let config = {
        timestamps: false
    }

    const Category = sequelize.define(alias, cols, config);
    Category.associate = function(models){
        Category.hasMany(models.Subcategory, {
            as : 'SubCategory',
            foreignKey : 'id',
            timestamps : false
        })
        ,
        Category.hasMany(models.Product, {
            as : 'ProductCatg',
            foreignKey : 'categoryid',
            timestamps : false
        })
    }

    return Category;
}