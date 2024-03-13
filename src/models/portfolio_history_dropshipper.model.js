// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Dropshipper } from "./dropshippers.model.js";
// I define the model for the users table in a variable and export him
export const Portfolios_history_dropshipper = sequelize.define('portfolios_history_dropshipper', {
    id_phd: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type_phd: {
        type:DataTypes.STRING
    },
    monto_phd: {
        type: DataTypes.INTEGER
    },
    description_phd: {
        type:DataTypes.STRING
    },
    date_created_phd: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================
Dropshipper.hasMany(Portfolios_history_dropshipper, {
    foreignKey: 'fk_id_dropshipper_phd',
    sourceKey: 'id_dropshipper'
});

Portfolios_history_dropshipper.belongsTo(Dropshipper, {
    foreignKey: 'fk_id_dropshipper_phd',
    targetId: 'id_dropshipper'
});