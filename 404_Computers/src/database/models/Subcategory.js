module.exports = (sequelize,DataTypes) => {
    let alias = 'Subcategory';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
        },
        subcategory: DataTypes.STRING,
        subcategorylink: DataTypes.STRING,
        categoryid: DataTypes.INTEGER
    }

    let config = {
        timestamps: false
    }

    const Subcategory = sequelize.define(alias, cols , config);
    Subcategory.associate = function(models){
        Subcategory.belongsTo(models.Category, {
            as : 'Subcategory',
            foreignKey : 'categoryid',
            sourceKey: 'id',
        })
    }
    
    return Subcategory;
}