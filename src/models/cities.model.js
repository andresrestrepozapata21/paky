// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Department } from "./departments.model.js";
// I define the model for the users table in a variable and export him
export const City = sequelize.define('cities', {
    id_city: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name_city: {
        type:DataTypes.STRING
    },
    status_city: {
        type:DataTypes.INTEGER
    },
    date_created_city: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================

Department.hasMany(City, {
    foreignKey: 'fk_id_d_city',
    sourceKey: 'id_d'
});
City.belongsTo(Department, {
    foreignKey: 'fk_id_d_city',
    targetId: 'id_d'
});