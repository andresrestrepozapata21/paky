import { sequelize } from "./database.js";
import './models/project.js';
import './models/task.js';
await sequelize.sync({
  force: true
});