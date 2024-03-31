// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Dropshipper } from "./dropshippers.model.js";
// I define the model for the users table in a variable and export him
export const Product = sequelize.define('products', {
    id_product: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_product: {
        type: DataTypes.STRING
    },
    description_product: {
        type: DataTypes.STRING
    },
    price_sale_product: {
        type: DataTypes.INTEGER
    },
    price_cost_product: {
        type: DataTypes.INTEGER
    },
    size_product: {
        type: DataTypes.STRING
    }
}, {
    TimesTamps: true
});

//=================== I define the relationship between the tables =================
Dropshipper.hasMany(Product, {
    foreignKey: 'fk_id_dropshipper_product',
    sourceKey: 'id_dropshipper'
});

Product.belongsTo(Dropshipper, {
    foreignKey: 'fk_id_dropshipper_product',
    targetId: 'id_dropshipper'
});