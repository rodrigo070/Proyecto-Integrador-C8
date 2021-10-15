/*module.exports = (sequelize,DataTypes) => {
    let alias = 'User';
    let cols = {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
        }
        ,
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        email: DataTypes.STRING,
        pass : DataTypes.STRING,
        role : DataTypes.STRING,
        image : DataTypes.STRING,
        address : DataTypes.STRING,
        phonenumber : DataTypes.INTEGER,
        dni : DataTypes.INTEGER,
        historyproducts : DataTypes.STRING,
        favorites : DataTypes.STRING,
        cartproducts : DataTypes.STRING
    }

    let config = {
        timestamps: false
    }

    const User = sequelize.define(alias, cols , config);

    return User;
}*/
module.exports = (sequelize, dataTypes) => {
    let alias = "User";
    let cols = {
        id: {
            type: dataTypes.INTEGER(11).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false 
        },
        name: {
            type: dataTypes.STRING(45),
            allowNull: false
        },
        surname: {
            type: dataTypes.STRING(45),
            allowNull: false
        },
        email: {
            type: dataTypes.STRING(60),
            allowNull: false,
            unique: true
        },
        pass: {
            type: dataTypes.STRING(70),
            allowNull: false
        },
      
        rol: {
            type: dataTypes.INTEGER(2).UNSIGNED,
            allowNull: false
        },
        image:{
            type: dataTypes.STRING(100)
        },
       
        address: {
            type: dataTypes.STRING(45),
           
        },
        phone:{
            type: dataTypes.INTEGER(11)
        },
        dni:{
            type: dataTypes.INTEGER(11)
        },
       
        favorites: {
            type: dataTypes.STRING(45),
           
        },
        cartproducts: {
            type: dataTypes.STRING(45),
           
        },

    }
    let config = {
        tableName: "users",
        timestamps: false
    }

    const User = sequelize.define(alias, cols, config)

    User.associate = models => {
        User.hasMany(models.History, {
            as: "historyProducts",
            foreignKey:"userId" 
        })
    }

    return User;
}
