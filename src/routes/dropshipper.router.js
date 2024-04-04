// I import my Express Router and modules need it
import { Router } from 'express';
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
// I import my controller with the methods I need
import { getpackages, login, master, filterByDate, downloadExcelpackagesDate, corfirmatePackage, detailPackage } from '../controllers/dropshipper.controller.js';
// Firme private secret jwt
const secret = process.env.SECRET;
// I declare the constant that the Router() method returns and upload multer directory
const router = Router();
/**
 * @api {POST} /dropshipper/login
 * @apiName paky
 * @apiGroup dropshipper
 * @apiDescription login dropshipper
 *
 * @apiSuccess message and data login
 */
router.post('/dropshipper/login', login);
/**
 * @api {POST} /dropshipper/master
 * @apiName paky
 * @apiGroup master
 * @apiDescription dropshipper master
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/master', async (req, res, next) => {
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
}, master);
/**
 * @api {POST} /dropshipper/getpackages
 * @apiName paky
 * @apiGroup getpackages
 * @apiDescription dropshipper getpackages
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/getpackages', async (req, res, next) => {
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
}, getpackages);
/**
 * @api {POST} /dropshipper/filterByDate
 * @apiName paky
 * @apiGroup filterByDate
 * @apiDescription dropshipper filterByDate
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/filterByDate', async (req, res, next) => {
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
}, filterByDate);
/**
 * @api {POST} /dropshipper/downloadExcelpackagesDate
 * @apiName paky
 * @apiGroup downloadExcelpackagesDate
 * @apiDescription dropshipper downloadExcelpackagesDate
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/downloadExcelpackagesDate', async (req, res, next) => {
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
}, downloadExcelpackagesDate);
/**
 * @api {POST} /dropshipper/corfirmatePackage
 * @apiName paky
 * @apiGroup corfirmatePackage
 * @apiDescription dropshipper corfirmatePackage
 *
 * @apiSuccess message and get data needed
 */
router.put('/dropshipper/corfirmatePackage', async (req, res, next) => {
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
}, corfirmatePackage);
/**
 * @api {POST} /dropshipper/detailPackage
 * @apiName paky
 * @apiGroup detailPackage
 * @apiDescription dropshipper detailPackage
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/detailPackage', async (req, res, next) => {
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
}, detailPackage);
// I export the router
export default router;