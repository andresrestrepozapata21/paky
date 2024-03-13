// I import my scrip app where I do the routing and server configurations
import app from './app.js';
import logger from './utils/logger.js';
import { sequelize } from "./database/database.js";
// I import the models for to create the database
import './models/products.model.js';
import './models/packages_products.model.js';
import './models/evidences.model.js';
import './models/types_evidence.model.js';
import './models/carriers.model.js';
import './models/types_carrier.model.js';
import './models/carrier_documents.model.js';
import './models/vehicles.model.js';
import './models/vehicle_documents.model.js';
import './models/carrier_bank_accounts.model.js';
import './models/carrier_payment_requests.model.js';
import './models/managers.model.js';
import './models/packages.model.js';
import './models/types_package.model.js';
import './models/cities.model.js';
import './models/departments.model.js';
import './models/status_history.model.js';
import './models/central_warehouses.model.js';
import './models/central_warehouse_users.model.js';
import './models/stores.model.js';
import './models/store_users.model.js';
import './models/dropshippers.model.js';
import './models/dropshipper_bank_accounts.model.js';
import './models/dropshipper_payment_requests.model.js';
import './models/portfolio_history_dropshipper.model.js';

// Function main api rest
async function main() {
    try {
        // Command for to create tables in database
        await sequelize.sync({force: true});
        // Command listening port 3000
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