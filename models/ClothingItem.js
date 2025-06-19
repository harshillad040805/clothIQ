const { Sequelize, Model, DataTypes } = require('sequelize');


const sequelize = new Sequelize({    // create connection
    dialect: 'sqlite',       
    storage: './database.sqlite'
});

class ClothingImages extends Model {}
ClothingImages.init({
  name:DataTypes.STRING,
  email:DataTypes.STRING,
  password:DataTypes.STRING
},{sequelize,modelName:'images'})

sequelize.sync()

module.exports = User