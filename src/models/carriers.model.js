
// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Vehicle } from "./vehicles.model.js";
import { Type_carrier } from "./types_carrier.model.js";
// I define the model for the carriers table in a variable and export him
export const Carrier = sequelize.define('carriers', {
    id_carrier: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status_carrier: {
        type: DataTypes.INTEGER
    },
    name_carrier: {
        type: DataTypes.STRING
    },
    last_name_carrier: {
        type: DataTypes.STRING
    },
    phone_number_carrier: {
        type: DataTypes.STRING
    },
    email_carrier:{
        type: DataTypes.STRING
    },
    password_carrier: {
        type: DataTypes.STRING
    },
    url_perfil_image_carrier: {
        type: DataTypes.STRING
    },
    token_login_carrier: {
        type: DataTypes.STRING
    },
    exp_token_login_carrier: {
        type: DataTypes.STRING
    },
    token_device_carrier: {
        type: DataTypes.STRING
    },
    active_carrier:{
        type: DataTypes.INTEGER
    },
    trust_carrier:{
        type: DataTypes.INTEGER
    },
    last_login_carrier: {
        type: DataTypes.DATE
    },
    revenue_carrier: {
        type: DataTypes.INTEGER
    },
    debt_carrier: {
        type: DataTypes.INTEGER
    },
    url_QR_carrier: {
        type: DataTypes.STRING
    },
    bancolombia_number_account_carrier: {
        type: DataTypes.INTEGER
    },
    nequi_carrier: {
        type: DataTypes.INTEGER
    },
    daviplata_carrier: {
        type: DataTypes.INTEGER
    },
    recovery_code_carrier: {
        type: DataTypes.INTEGER
    },
    date_created_carrier: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================
//Relation with vehicle
Vehicle.hasOne(Carrier, {
    foreignKey: 'fk_id_vehicle_carrier',
    targetId: 'id_vehicule'
});

Carrier.belongsTo(Vehicle, {
    foreignKey: 'fk_id_vehicle_carrier',
    targetId: 'id_vehicule'
});

//Relation with type carrier
Type_carrier.hasOne(Carrier, {
    foreignKey: 'fk_id_tc_carrier',
    targetId: 'id_tc'
});

Carrier.belongsTo(Type_carrier, {
    foreignKey: 'fk_id_tc_carrier',
    targetId: 'id_tc'
});