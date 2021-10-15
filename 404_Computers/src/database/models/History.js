module.exports = (sequelize, dataTypes) => {
    let alias = "History";
    let cols = {
        id: {
            type: dataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
        },
        userID: {
             type: dataTypes.INTEGER(11).UNSIGNED,
            allowNull: false
        },
       productID: {
             type: dataTypes.INTEGER(11).UNSIGNED,
            allowNull: false
        },
        
    }
    let config = {
        tableName: "historyProducts",
        timestamps: false
    }

    const History = sequelize.define(alias, cols, config)

   History.associate = models => {
       History.belongsTo(models.User, {
            as: "User",
            foreignKey:"userId" 
        })
    }

    return History;
}