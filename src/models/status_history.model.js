// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Carrier } from "./carriers.model.js";
import { Package } from "./packages.model.js";
//import { Department } from "./departments.model.js";
// I define the model for the users table in a variable and export him
export const Status_history = sequelize.define('status_history', {
    id_sh: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status_sh: {
        type:DataTypes.INTEGER
    },
    comentary_sh: {
        type:DataTypes.STRING
    },
    date_created_city: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});

//=================== I define the relationship between the tables =================
//relation with carrier
Carrier.hasMany(Status_history, {
    foreignKey: 'fk_id_carrier_asignated_sh',
    sourceKey: 'id_carrier'
});
Status_history.belongsTo(Carrier, {
    foreignKey: 'fk_id_carrier_asignated_sh',
    targetId: 'id_carrier'
});

//relation with package
Package.hasMany(Status_history, {
    foreignKey: 'fk_id_p_sh',
    sourceKey: 'id_p'
});
Status_history.belongsTo(Package, {
    foreignKey: 'fk_id_p_sh',
    targetId: 'id_p'
});