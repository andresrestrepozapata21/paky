// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Dropshipper } from "./dropshippers.model.js";
// I define the model for the users table in a variable and export him
export const Dropshipper_bank_account = sequelize.define('Dropshipper_bank_accounts', {
    id_dba: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    number_dba: {
        type: DataTypes.INTEGER
    },
    type_dba: {
        type:DataTypes.STRING
    },
    bank_dba: {
        type:DataTypes.STRING
    },
    description_dba: {
        type:DataTypes.STRING
    },
    date_created_dba: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================
Dropshipper.hasMany(Dropshipper_bank_account, {
    foreignKey: 'fk_id_dropshipper_dba',
    sourceKey: 'id_dropshipper'
});

Dropshipper_bank_account.belongsTo(Dropshipper, {
    foreignKey: 'fk_id_dropshipper_dba',
    targetId: 'id_dropshipper'
});