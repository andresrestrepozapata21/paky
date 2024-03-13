// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Package } from "./packages.model.js";
import { Product } from "./products.model.js";
//import { Product } from "./products.model.js";
// I define the model for the users table in a variable and export him
export const PackageProduct = sequelize.define('package_products', {
    id_pp: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date_created_pp: {
        type: DataTypes.DATE
    }
}, {
    TimesTamps: true
});

//=================== I define the relationship between the tables =================

//Relation with packages
Package.hasMany(PackageProduct, {
    foreignKey: 'fk_id_p_pp',
    sourceKey: 'id_p'
});

PackageProduct.belongsTo(Package, {
    foreignKey: 'fk_id_p_pp',
    targetId: 'id_p'
});

//Relation with products
Product.hasMany(PackageProduct, {
    foreignKey: 'fk_id_product_pp',
    sourceKey: 'id_product'
});

PackageProduct.belongsTo(Product, {
    foreignKey: 'fk_id_product_pp',
    targetId: 'id_product'
});