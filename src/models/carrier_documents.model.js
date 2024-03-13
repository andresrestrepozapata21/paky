// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Carrier } from "./carriers.model.js";
// I define the model for the users table in a variable and export him
export const Carrier_document = sequelize.define('carrier_documents', {
    id_cd: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url_cd: {
        type:DataTypes.STRING
    },
    date_created_cd: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================

Carrier.hasMany(Carrier_document, {
    foreignKey: 'fk_id_carrier_cd',
    sourceKey: 'id_carrier'
});

Carrier_document.belongsTo(Carrier, {
    foreignKey: 'fk_id_carrier_cd',
    targetId: 'id_carrier'
});