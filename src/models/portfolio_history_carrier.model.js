// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Carrier } from "./carriers.model.js";
// I define the model for the users table in a variable and export him
export const Portfolio_history_carrier = sequelize.define('portfolios_history_carriers', {
    id_phc: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type_phc: {
        type:DataTypes.STRING
    },
    Quantity_pay_phc: {
        type: DataTypes.INTEGER
    },
    description_phc: {
        type:DataTypes.STRING
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================

//relation with evidence
Carrier.hasMany(Portfolio_history_carrier, {
    foreignKey: 'fk_id_carrier_phc',
    sourceKey: 'id_carrier'
});
Portfolio_history_carrier.belongsTo(Carrier, {
    foreignKey: 'fk_id_carrier_phc',
    targetId: 'id_carrier'
});