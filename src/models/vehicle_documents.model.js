// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Vehicle } from "./vehicles.model.js";
// I define the model for the users table in a variable and export him
export const Vehicle_document = sequelize.define('vehicle_documents', {
    id_vd: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description_vd: {
        type: DataTypes.STRING
    },
    url_document_vd: {
        type:DataTypes.STRING
    },
    date_created_vd: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================

Vehicle.hasMany(Vehicle_document, {
    foreignKey: 'fk_id_vehicle_vd',
    sourceKey: 'id_vehicle'
});

Vehicle_document.belongsTo(Vehicle, {
    foreignKey: 'fk_id_vehicle_vd',
    targetId: 'id_vehicle'
});