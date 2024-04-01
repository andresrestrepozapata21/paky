
// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Carrier } from "../models/carriers.model.js";
// I define the model for the users table in a variable and export him
export const Vehicle = sequelize.define('vehicles', {
    id_vehicle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    capacity_vehicle: {
        type: DataTypes.INTEGER
    },
    description_vehicle: {
        type: DataTypes.STRING
    },
    class_vehicle: {
        type: DataTypes.STRING
    },
    plate_vehicle: {
        type: DataTypes.STRING
    },
    color_vehicle:{
        type: DataTypes.STRING
    },
    brand_vehicle: {
        type: DataTypes.STRING
    },
    line_vehicle: {
        type: DataTypes.STRING
    },
    model_vehicle: {
        type: DataTypes.STRING
    },
    cylinder_capacity_vehicle: {
        type: DataTypes.STRING
    },
    url_image_vehicle:{
        type: DataTypes.STRING
    },
    date_created_vehicle: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});

//=================== I define the relationship between the tables =================

//Relation with Carrier
Carrier.hasOne(Vehicle, {
    foreignKey: 'fk_id_carrier_vehicle',
    targetId: 'id_carrier'
});

Vehicle.belongsTo(Carrier, {
    foreignKey: 'fk_id_carrier_vehicle',
    targetId: 'id_carrier'
});