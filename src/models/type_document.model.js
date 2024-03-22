// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
// I define the model for the users table in a variable and export him
export const Type_document = sequelize.define('types_document', {
    id_td: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description_td: {
        type:DataTypes.STRING
    }
},{
    TimesTamps: true
});