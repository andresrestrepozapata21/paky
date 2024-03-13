// I import my scrip app where I do the routing and server configurations
import express from 'express';
import morgan from 'morgan';
// importing routes
//import productsRouter from "./routes/products.routes.js";
/**
 * 
 * @apiDescription inicialization
 *
 */
const app = express();
/**
 * 
 * @apiDescription middlewares
 *
 */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
/**
 * @api /api
 * @apiName routes
 * @apiGroup routes
 * @apiDescription route definition
 *
 */
//app.use(productsRouter);
// I export my app variable
export default app;