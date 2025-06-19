const { Sequelize, Model, DataTypes } = require('sequelize');


const sequelize = new Sequelize({    // create connection
    dialect: 'sqlite',       
    storage: './database.sqlite'
});

class User extends Model {}
User.init({
  name:DataTypes.STRING,
  email:DataTypes.STRING,
  password:DataTypes.STRING
},{sequelize,modelName:'users'})

sequelize.sync()

module.exports = User