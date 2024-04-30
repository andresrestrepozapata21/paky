// I import my Express Router and modules need it
import { Router } from 'express';
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
// I import my controller with the methods I need
import { login, getPackages } from '../controllers/store_users.controller.js';
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
router.post('/routerUser/login', login);
/**
 * @api {POST} /routerUser/getCityPackages
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription getCityPackages routerUser
 *
 * @apiSuccess message and data getCityPackages
 */
router.post('/routerUser/getPackages', async (req, res, next) => {
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
}, getPackages);
// I export the router
export default router;