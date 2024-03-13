// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { City } from "./cities.model.js";
// I define the model for the users table in a variable and export him
export const Central_warehouse = sequelize.define('central_warehouses', {
    id_cw: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_cw: {
        type: DataTypes.STRING
    },
    phone_number_cw: {
        type: DataTypes.STRING
    },
    direction_cw: {
        type: DataTypes.STRING
    },
    capacity_cw:{
        type: DataTypes.STRING
    },
    date_created_cw: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================
City.hasMany(Central_warehouse, {
    foreignKey: 'fk_id_city_cw',
    sourceKey: 'id_city'
});

Central_warehouse.belongsTo(City, {
    foreignKey: 'fk_id_city_cw',
    targetId: 'id_city'
});