
// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Central_warehouse } from "./central_warehouses.model.js";
// I define the model for the users table in a variable and export him
export const Central_warehouse_user = sequelize.define('central_warehouse_users', {
    id_cwu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_cwu: {
        type: DataTypes.STRING
    },
    last_name_cwu: {
        type: DataTypes.STRING
    },
    phone_number_cwu: {
        type: DataTypes.STRING
    },
    email_cwu:{
        type: DataTypes.STRING
    },
    password_cwu: {
        type: DataTypes.STRING
    },
    token_login_cwu: {
        type: DataTypes.STRING
    },
    exp_token_login_cwu: {
        type: DataTypes.STRING
    },
    token_device_cwu: {
        type: DataTypes.STRING
    },
    last_login_cwu: {
        type: DataTypes.DATE
    },
    date_created_cwu: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================
Central_warehouse.hasMany(Central_warehouse_user, {
    foreignKey: 'fk_id_cw_cwu',
    sourceKey: 'id_cw'
});

Central_warehouse_user.belongsTo(Central_warehouse, {
    foreignKey: 'fk_id_cw_cwu',
    targetId: 'id_cw'
});