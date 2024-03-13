// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { City } from "./cities.model.js";
import { Dropshipper } from "./dropshippers.model.js";
// I define the model for the users table in a variable and export him
export const Store = sequelize.define('stores', {
    id_store: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    direction_store: {
        type: DataTypes.STRING
    },
    phone_number_store: {
        type: DataTypes.STRING
    },
    capacity_store: {
        type: DataTypes.INTEGER
    },
    date_created_store: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});

//=================== I define the relationship between the tables =================
// Relation with city
City.hasMany(Store, {
    foreignKey: 'fk_id_city_store',
    sourceKey: 'id_city'
});

Store.belongsTo(City, {
    foreignKey: 'fk_id_city_store',
    targetId: 'id_city'
});

// Relation with dropshipper
Dropshipper.hasMany(Store, {
    foreignKey: 'fk_id_dropshipper_store',
    sourceKey: 'id_dropshipper'
});

Store.belongsTo(Dropshipper, {
    foreignKey: 'fk_id_dropshipper_store',
    targetId: 'id_dropshipper'
});