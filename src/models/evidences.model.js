// I imported the Sequelize module and my custom sequelize module with the configuration and connection to the DB
import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
import { Package } from "../models/packages.model.js";
import { Type_evidence } from "../models/types_evidence.model.js";
// I define the model for the users table in a variable and export him
export const Evidence = sequelize.define('evidences', {
    id_evidence: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url_image_evidence: {
        type: DataTypes.STRING
    },
    date_created_evidence: {
        type: DataTypes.DATE
    }
},{
    TimesTamps: true
});
//=================== I define the relationship between the tables =================

//relation with evidence
Package.hasMany(Evidence, {
    foreignKey: 'fk_id_p_evidence',
    sourceKey: 'id_p'
});
Evidence.belongsTo(Package, {
    foreignKey: 'fk_id_p_evidence',
    targetId: 'id_p'
});

//relation with types evidence
Type_evidence.hasMany(Evidence, {
    foreignKey: 'fk_id_type_evidence_evidence',
    sourceKey: 'id_te'
});
Evidence.belongsTo(Type_evidence, {
    foreignKey: 'fk_id_type_evidence_evidence',
    targetId: 'id_te'
});