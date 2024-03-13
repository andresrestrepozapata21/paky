import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";
// I define the model for the users table in a variable
export const Product = sequelize.define('product', {
  id_product: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name_producto: {
    type: DataTypes.STRING
  },
  description_producto: {
    type: DataTypes.STRING
  },
  importance_producto: {
    type: DataTypes.INTEGER
  },
  price_producto: {
    type: DataTypes.INTEGER
  },
  high_producto: {
    type: DataTypes.INTEGER
  },
  broad_number_producto: {
    type: DataTypes.INTEGER
  },
  long_number_producto: {
    type: DataTypes.INTEGER
  },
  date_created_producto: {
    type: DataTypes.DATE
  },
  fk_id_dropshipper_producto: {
    type: DataTypes.INTEGER
  },
  fk_id_store_producto: {
    type: DataTypes.INTEGER
  },
  fk_id_package_order_producto: {
    type: DataTypes.INTEGER
  }
}, {
  TimesTamps: true
});

/*
Project.hasMany(Task, {
    foreignKey: 'projectId',
    sourceKey: 'id'
});

Task.belongsTo(Project, {
    foreignKey: 'projectId',
    targetId: 'id'
});
*/