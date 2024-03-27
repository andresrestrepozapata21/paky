
// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Type_carrier } from "./types_carrier.model.js";
import { City } from "./cities.model.js";
import { Type_document } from "./type_document.model.js";
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
    number_document_carrier: {
        type: DataTypes.STRING
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
    token_device_carrier: {
        type: DataTypes.STRING
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
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================

//Relation with type carrier
Type_carrier.hasMany(Carrier, {
    foreignKey: 'fk_id_tc_carrier',
    targetId: 'id_tc'
});

Carrier.belongsTo(Type_carrier, {
    foreignKey: 'fk_id_tc_carrier',
    targetId: 'id_tc'
});

//Relation with city
City.hasMany(Carrier, {
    foreignKey: 'fk_id_city_carrier',
    targetId: 'id_city'
});

Carrier.belongsTo(City, {
    foreignKey: 'fk_id_city_carrier',
    targetId: 'id_city'
});

//Relation with type carrier
Type_document.hasMany(Carrier, {
    foreignKey: 'fk_id_td_carrier',
    targetId: 'id_td'
});

Carrier.belongsTo(Type_document, {
    foreignKey: 'fk_id_td_carrier',
    targetId: 'id_td'
});