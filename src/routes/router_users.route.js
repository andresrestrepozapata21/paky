// I import my Express Router and modules need it
import { Router } from 'express';
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
// I import my controller with the methods I need
import { login, getCityPackages, getProductsPackage } from '../controllers/router_users.controller.js';
// Firme private secret jwt
const secret = process.env.SECRET;
// I declare the constant that the Router() method returns and upload multer directory
const router = Router();
/**
 * @api {POST} /carrier/login
 * @apiName paky
 * @apiGroup carrier
 * @apiDescription login carrier
 *
 * @apiSuccess message and data login
 */
router.post('/routerUser/login', login);
/**
 * @api {POST} /carrier/getCityPackages
 * @apiName paky
 * @apiGroup carrier
 * @apiDescription getCityPackages carrier
 *
 * @apiSuccess message and data getCityPackages
 */
router.get('/routerUser/getCityPackages', async (req, res, next) => {
    try {
        //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret);
        // Validate expiration token
        if (Date.now() > payload.exp) {
            return res.status(401).json({
                error: "token expired",
                result: 2
            });
        }
        logger.info('Token validated successfuly');
        next();
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(401).json({ message: 'Non-existent invalid token', result: 0, data: error.message });
    }
}, getCityPackages);
/**
 * @api {POST} /carrier/getProductsPackage
 * @apiName paky
 * @apiGroup carrier
 * @apiDescription getProductsPackage carrier
 *
 * @apiSuccess message and data getProductsPackage
 */
router.post('/routerUser/getProductsPackage', async (req, res, next) => {
    try {
        //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, secret);
        // Validate expiration token
        if (Date.now() > payload.exp) {
            return res.status(401).json({
                error: "token expired",
                result: 2
            });
        }
        logger.info('Token validated successfuly');
        next();
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(401).json({ message: 'Non-existent invalid token', result: 0, data: error.message });
    }
}, getProductsPackage);
// I export the router
export default router;