// I import my scrip app where I do the routing and server configurations
import express from 'express';
import morgan from 'morgan';
import { dirname, join} from "path";
import { fileURLToPath } from 'url';
// importing routes
import carriers from "./routes/carriers.route.js";
/**
 * 
 * @apiDescription inicialization around variables
 *
 */
const app = express();
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
/**
 * 
 * @apiDescription middlewares and necessary settings
 *
 */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/documents_carrier', express.static(join(CURRENT_DIR, '../documents_carrier')));
/**
 * @api /api
 * @apiName routes
 * @apiGroup routes
 * @apiDescription route definition
 *
 */
app.use(carriers);
// I export my app variable
export default app;