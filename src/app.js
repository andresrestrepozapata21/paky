// I import my scrip app where I do the routing and server configurations
import express from 'express';
import morgan from 'morgan';
import { dirname, join} from "path";
import { fileURLToPath } from 'url';
import cors from "cors";
// importing routes
import carriers from "./routes/carriers.route.js";
import utils from "./routes/utils.route.js";
import router_user from "./routes/router_users.route.js";
/**
 * 
 * @apiDescription inicialization around variables
 *
 */
const app = express();
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
// Configuring CORS options to include multiple sources
const corsOptions = {
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
    methods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cross-origin cookies
    allowedHeaders: ["Content-Type", "Authorization"]
};
/**
 * 
 * @apiDescription middlewares and necessary settings
 *
 */
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/documents_carrier', express.static(join(CURRENT_DIR, '../documents_carrier')));
app.use('/documents_vehicle_carrier', express.static(join(CURRENT_DIR, '../documents_vehicle_carrier')));

/**
 * @api /api
 * @apiName routes
 * @apiGroup routes
 * @apiDescription route definition
 *
 */
app.use(carriers);
app.use(utils);
app.use(router_user);

// I export my app variable
export default app;