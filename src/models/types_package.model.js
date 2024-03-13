// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
// I define the model for the users table in a variable and export him
export const Type_package = sequelize.define('types_package', {
    id_tp: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description_tp: {
        type:DataTypes.STRING
    },
    date_created_tp: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});