module.exports = (sequelize,DataTypes) => {
    let alias = 'User';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
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
}