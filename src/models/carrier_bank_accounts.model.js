// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Carrier } from "./carriers.model.js";
// I define the model for the users table in a variable and export him
export const Carrier_bank_account = sequelize.define('carrier_bank_accounts', {
    id_cba: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    number_cba: {
        type: DataTypes.INTEGER
    },
    type_cba: {
        type:DataTypes.STRING
    },
    bank_cba: {
        type:DataTypes.STRING
    },
    description_cba: {
        type:DataTypes.STRING
    },
    date_created_cba: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================
Carrier.hasMany(Carrier_bank_account, {
    foreignKey: 'fk_id_carrier_cba',
    sourceKey: 'id_carrier'
});

Carrier_bank_account.belongsTo(Carrier, {
    foreignKey: 'fk_id_carrier_cba',
    targetId: 'id_carrier'
});