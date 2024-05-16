// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Carrier } from "./carriers.model.js";
import { Package } from "./packages.model.js";
//import { Department } from "./departments.model.js";
// I define the model for the users table in a variable and export him
export const Attempt_log = sequelize.define('attempt_logs', {
    id_al: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    comentary_al: {
        type: DataTypes.STRING
    },
    details_al: {
        type: DataTypes.STRING
    }
}, {
    TimesTamps: true
});

//=================== I define the relationship between the tables =================
//relation with carrier
Carrier.hasMany(Attempt_log, {
    foreignKey: 'fk_id_carrier_al',
    sourceKey: 'id_carrier'
});
Attempt_log.belongsTo(Carrier, {
    foreignKey: 'fk_id_carrier_al',
    targetId: 'id_carrier'
});

//relation with package
Package.hasMany(Attempt_log, {
    foreignKey: 'fk_id_p_al',
    sourceKey: 'id_p'
});
Attempt_log.belongsTo(Package, {
    foreignKey: 'fk_id_p_al',
    targetId: 'id_p'
});