// I import my Express Router and modules need it
import { Router } from 'express';
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
// I import my controller with the methods I need
import { login, getCarriers, passCarrier, packages } from '../controllers/store_users.controller.js';
// Firme private secret jwt
const secret = process.env.SECRET;
// I declare the constant that the Router() method returns and upload multer directory
const router = Router();
/**
 * @api {POST} /routerUser/login
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription login routerUser
 *
 * @apiSuccess message and data login
 */
router.post('/storeUser/login', login);
/**
 * @api {POST} /routerUser/getCarriers
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription getCarriers routerUser
 *
 * @apiSuccess message and data getCarriers
 */
router.post('/storeUser/getCarriers', async (req, res, next) => {
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
}, getCarriers);
/**
 * @api {POST} /routerUser/getCarriers
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription getCarriers routerUser
 *
 * @apiSuccess message and data getCarriers
 */
router.put('/storeUser/passCarrier/:id_carrier', async (req, res, next) => {
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
}, passCarrier);
/**
 * @api {POST} /routerUser/packages
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription packages routerUser
 *
 * @apiSuccess message and data packages
 */
router.post('/storeUser/packages', async (req, res, next) => {
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
}, packages);
// I export the router
export default router;