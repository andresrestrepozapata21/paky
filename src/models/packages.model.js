// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Carrier } from "./carriers.model.js";
import { Type_package } from "./types_package.model.js";
import { City } from "./cities.model.js";
import { Store } from "./stores.model.js";
// I define the model for the users table in a variable and export him
export const Package = sequelize.define('packages', {
    id_p: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_shopify: {
        type: DataTypes.BIGINT,
    },
    orden_p: {
        type: DataTypes.STRING
    },
    name_client_p: {
        type: DataTypes.STRING
    },
    phone_number_client_p: {
        type: DataTypes.STRING
    },
    email_client_p: {
        type: DataTypes.STRING
    },
    direction_client_p: {
        type: DataTypes.STRING
    },
    comments_p: {
        type: DataTypes.STRING
    },
    guide_number_p: {
        type: DataTypes.STRING
    },
    status_p: {
        type: DataTypes.INTEGER
    },
    profit_carrier_inter_city_p: {
        type: DataTypes.INTEGER
    },
    profit_carrier_p: {
        type: DataTypes.INTEGER
    },
    profit_dropshipper_p: {
        type: DataTypes.INTEGER
    },
    with_collection_p:{
        type: DataTypes.INTEGER
    },
    total_price_p:{
        type: DataTypes.INTEGER
    },
    does_shopify_p:{
        type: DataTypes.INTEGER
    },
    send_cost_shopify_p:{
        type: DataTypes.INTEGER
    },
    send_priority_shopify_p:{
        type: DataTypes.INTEGER
    },
    total_price_shopify_p:{
        type: DataTypes.INTEGER
    },
    confirmation_carrier_p:{
        type: DataTypes.INTEGER
    },
    confirmation_dropshipper_p:{
        type: DataTypes.INTEGER
    },
    date_created_package: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});

//=================== I define the relationship between the tables =================
//Relation with store
Store.hasMany(Package, {
    foreignKey: 'fk_id_store_p',
    sourceKey: 'id_store'
});
Package.belongsTo(Store, {
    foreignKey: 'fk_id_store_p',
    targetId: 'id_store'
});

//Relation with carrier
Carrier.hasMany(Package, {
    foreignKey: 'fk_id_carrier_p',
    sourceKey: 'id_carrier'
});
Package.belongsTo(Carrier, {
    foreignKey: 'fk_id_carrier_p',
    targetId: 'id_carrier'
});

//Relation with type package
Type_package.hasMany(Package, {
    foreignKey: 'fk_id_tp_p',
    sourceKey: 'id_tp'
});

Package.belongsTo(Type_package, {
    foreignKey: 'fk_id_tp_p',
    targetId: 'id_tp'
});

//Relation with destiny city
City.hasMany(Package, {
    foreignKey: 'fk_id_destiny_city_p',
    sourceKey: 'id_city'
});

Package.belongsTo(City, {
    foreignKey: 'fk_id_destiny_city_p',
    targetId: 'id_city'
});