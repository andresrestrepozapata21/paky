// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Dropshipper_bank_account } from "./dropshipper_bank_accounts.model.js";
// I define the model for the users table in a variable and export him
export const Dropshipper_payment_request = sequelize.define('dropshipper_payment_requests', {
    id_dpr: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity_requested_dpr: {
        type: DataTypes.INTEGER
    },
    status_cpr: {
        type:DataTypes.STRING
    },
    date_created_cba: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================

Dropshipper_bank_account.hasMany(Dropshipper_payment_request, {
    foreignKey: 'fk_id_dba_drp',
    sourceKey: 'id_dba'
});

Dropshipper_payment_request.belongsTo(Dropshipper_bank_account, {
    foreignKey: 'fk_id_dba_drp',
    targetId: 'id_dba'
});