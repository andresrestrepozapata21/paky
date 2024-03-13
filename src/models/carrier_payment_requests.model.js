// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Carrier_bank_account } from "./carrier_bank_accounts.model.js";
// I define the model for the users table in a variable and export him
export const Carrier_payment_request = sequelize.define('carrier_payment_requests', {
    id_cba: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity_requested_cpr: {
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

Carrier_bank_account.hasMany(Carrier_payment_request, {
    foreignKey: 'fk_id_cba_cpr',
    sourceKey: 'id_cba'
});

Carrier_payment_request.belongsTo(Carrier_bank_account, {
    foreignKey: 'fk_id_cba_cpr',
    targetId: 'id_cba'
});