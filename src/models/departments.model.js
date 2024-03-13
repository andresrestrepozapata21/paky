// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
// I define the model for the users table in a variable and export him
export const Department = sequelize.define('departments', {
    id_d: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_d: {
        type:DataTypes.STRING
    },
    date_created_d: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});