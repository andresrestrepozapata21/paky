// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
// I define the model for the users table in a variable and export him
export const Type_evidence = sequelize.define('types_evidence', {
    id_te: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description_te: {
        type:DataTypes.STRING
    },
    date_created_te: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});