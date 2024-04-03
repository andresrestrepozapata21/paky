// I import my Express Router and modules need it
import { Router } from 'express';
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
// I import my controller with the methods I need
import { login, getCityPackages, getProductsPackage, getCarriers, getPackagesCarrier, getDetailAsignate, toAsignatePackages, getInterCityPackages, getCarriersInter, getDetailAsignateInter } from '../controllers/router_users.controller.js';
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
 * @api {POST} /routerUser/getProductsPackage
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription getProductsPackage routerUser
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
/**
 * @api {POST} /routerUser/getCarriers
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription getCarriers routerUser
 *
 * @apiSuccess message and data getCarriers
 */
router.get('/routerUser/getCarriers', async (req, res, next) => {
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
 * @api {POST} /routerUser/getPackagesCarrier
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription getPackagesCarrier routerUser
 *
 * @apiSuccess message and data getPackagesCarrier
 */
router.post('/routerUser/getPackagesCarrier', async (req, res, next) => {
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
}, getPackagesCarrier);
/**
 * @api {POST} /routerUser/getDetailAsignate
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription getDetailAsignate routerUser
 *
 * @apiSuccess message and data getDetailAsignate
 */
router.post('/routerUser/getDetailAsignate', async (req, res, next) => {
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
}, getDetailAsignate);
/**
 * @api {POST} /routerUser/toAsignatePackages
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription toAsignatePackages routerUser
 *
 * @apiSuccess message and data toAsignatePackages
 */
router.post('/routerUser/toAsignatePackages', async (req, res, next) => {
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
}, toAsignatePackages);
/**
 * @api {POST} /routerUser/getInterCityPackages
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription getInterCityPackages routerUser
 *
 * @apiSuccess message and data getInterCityPackages
 */
router.get('/routerUser/getInterCityPackages', async (req, res, next) => {
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
}, getInterCityPackages);
/**
 * @api {POST} /routerUser/getCarriersInter
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription getCarriersInter routerUser
 *
 * @apiSuccess message and data getCarriersInter
 */
router.get('/routerUser/getCarriersInter', async (req, res, next) => {
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
}, getCarriersInter);
/**
 * @api {POST} /routerUser/getDetailAsignateInter
 * @apiName paky
 * @apiGroup routerUser
 * @apiDescription getDetailAsignateInter routerUser
 *
 * @apiSuccess message and data getDetailAsignateInter
 */
router.post('/routerUser/getDetailAsignateInter', async (req, res, next) => {
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
}, getDetailAsignateInter);
// I export the router
export default router;