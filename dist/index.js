// I import my scrip app where I do the routing and server configurations
import app from './app.js';
import logger from './utils/logger.js';
import { sequelize } from "./database/database.js";
// I import the models for i create the database
import './models/products.model.js';
async function main() {
  try {
    // Command for to create tables in database
    //await sequelize.sync({force: true});
    app.listen(3000);
    // Write log
    logger.info('server running on port 3000');
  } catch (error) {
    // error console log
    console.error('Unable to connect to the database:', error);
  }
}
// Method main
main();