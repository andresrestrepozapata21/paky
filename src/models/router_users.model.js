
// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { City } from "./cities.model.js";
// I define the model for the users table in a variable and export him
export const Router_user = sequelize.define('router_users', {
    id_ru: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status_ru: {
        type: DataTypes.INTEGER
    },
    name_ru: {
        type: DataTypes.STRING
    },
    last_name_ru: {
        type: DataTypes.STRING
    },
    phone_number_ru: {
        type: DataTypes.STRING
    },
    email_ru: {
        type: DataTypes.STRING
    },
    password_ru: {
        type: DataTypes.STRING
    },
    token_device_ru: {
        type: DataTypes.STRING
    },
    last_login_ru: {
        type: DataTypes.DATE
    }
}, {
    TimesTamps: true
});
//=================== I define the relationship between the tables =================

//Relation with type carrier
City.hasMany(Router_user, {
    foreignKey: 'fk_id_city_ru',
    targetId: 'id_city'
});

Router_user.belongsTo(City, {
    foreignKey: 'fk_id_city_ru',
    targetId: 'id_city'
});