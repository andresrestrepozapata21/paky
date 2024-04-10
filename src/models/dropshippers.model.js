
// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
// I define the model for the users table in a variable and export him
export const Dropshipper = sequelize.define('dropshippers', {
    id_dropshipper: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_documento: {
        type: DataTypes.STRING
    },
    numero_documento: {
        type: DataTypes.STRING
    },
    status_dropshipper: {
        type: DataTypes.INTEGER
    },
    name_dropshipper: {
        type: DataTypes.STRING
    },
    last_name_dropshipper: {
        type: DataTypes.STRING
    },
    phone_number_dropshipper: {
        type: DataTypes.STRING
    },
    email_dropshipper: {
        type: DataTypes.STRING
    },
    password_dropshipper: {
        type: DataTypes.STRING
    },
    token_device_dropshipper: {
        type: DataTypes.STRING
    },
    wallet_dropshipper: {
        type: DataTypes.INTEGER
    },
    total_sales_dropshipper: {
        type: DataTypes.INTEGER
    },
    verification_PIN_bank_withdrawal_dropshipper: {
        type: DataTypes.INTEGER
    },
    last_login_dropshipper: {
        type: DataTypes.DATE
    },
    date_created_dropshipper: {
        type: DataTypes.DATE
    }
}, {
    TimesTamps: true
});