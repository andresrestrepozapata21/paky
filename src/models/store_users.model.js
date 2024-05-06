
// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Store } from "./stores.model.js";
// I define the model for the users table in a variable and export him
export const StoreUser = sequelize.define('store_users', {
    id_su: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status_su: {
        type: DataTypes.INTEGER
    },
    name_su: {
        type: DataTypes.STRING
    },
    last_name_su: {
        type: DataTypes.STRING
    },
    phone_number_su: {
        type: DataTypes.STRING
    },
    email_su:{
        type: DataTypes.STRING
    },
    password_su: {
        type: DataTypes.STRING
    },
    token_login_su: {
        type: DataTypes.STRING
    },
    exp_token_login_su: {
        type: DataTypes.STRING
    },
    token_device_su: {
        type: DataTypes.STRING
    },
    last_login_su: {
        type: DataTypes.DATE
    },
    date_created_su: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================

Store.hasMany(StoreUser, {
    foreignKey: 'fk_id_store_su',
    sourceKey: 'id_store'
});

StoreUser.belongsTo(Store, {
    foreignKey: 'fk_id_store_su',
    targetId: 'id_store'
});