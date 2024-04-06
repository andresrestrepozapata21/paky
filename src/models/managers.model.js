
// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
// I define the model for the users table in a variable and export him
export const Manager = sequelize.define('managers', {
    id_manager: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status_manager: {
        type: DataTypes.INTEGER
    },
    name_manager: {
        type: DataTypes.STRING
    },
    last_name_manager: {
        type: DataTypes.STRING
    },
    phone_number_manager: {
        type: DataTypes.STRING
    },
    email_manager: {
        type: DataTypes.STRING
    },
    password_manager: {
        type: DataTypes.STRING
    },
    token_device_manager: {
        type: DataTypes.STRING
    },
    debt_dropshipper_manager: {
        type: DataTypes.INTEGER
    },
    debt_carrier_manager: {
        type: DataTypes.INTEGER
    },
    last_login_manager: {
        type: DataTypes.DATE
    },
    date_created_manager: {
        type: DataTypes.DATE
    }
}, {
    TimesTamps: true
});