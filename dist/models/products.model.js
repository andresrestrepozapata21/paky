"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Product = void 0;
var _sequelize = require("sequelize");
var _database = require("../database/database.js");
var _dropshippersModel = require("./dropshippers.model.js");
// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB

// I define the model for the users table in a variable and export him
var Product = exports.Product = _database.sequelize.define('products', {
  id_product: {
    type: _sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name_product: {
    type: _sequelize.DataTypes.STRING
  },
  description_product: {
    type: _sequelize.DataTypes.STRING
  },
  price_sale_product: {
    type: _sequelize.DataTypes.INTEGER
  },
  price_cost_product: {
    type: _sequelize.DataTypes.INTEGER
  },
  size_product: {
    type: _sequelize.DataTypes.STRING
  }
}, {
  TimesTamps: true
});

//=================== I define the relationship between the tables =================
_dropshippersModel.Dropshipper.hasMany(Product, {
  foreignKey: 'fk_id_dropshipper_product',
  sourceKey: 'id_dropshipper'
});
Product.belongsTo(_dropshippersModel.Dropshipper, {
  foreignKey: 'fk_id_dropshipper_product',
  targetId: 'id_dropshipper'
});