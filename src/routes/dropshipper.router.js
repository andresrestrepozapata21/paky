// I import my Express Router and modules need it
import { Router } from 'express';
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
// I import my controller with the methods I need
import { getpackages, login, master, filterByDate, downloadExcelpackagesDate, corfirmatePackage, detailPackage, deletePackage, editPackage, addBankAccount, getBankAccount, deleteBankAccount, addPaymentRequest, validateVerificationPin, getPortfolio, downloadExcelPortfolio, getCarriers, editProductPackage, getPayments, deletePaymentRequest } from '../controllers/dropshipper.controller.js';
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
/**
 * @api {POST} /dropshipper/editPackage
 * @apiName paky
 * @apiGroup editPackage
 * @apiDescription dropshipper editPackage
 *
 * @apiSuccess message and get data needed
 */
router.put('/dropshipper/editPackage/:id_p', async (req, res, next) => {
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
}, editPackage);
/**
 * @api {POST} /dropshipper/deletePackage
 * @apiName paky
 * @apiGroup deletePackage
 * @apiDescription dropshipper deletePackage
 *
 * @apiSuccess message and get data needed
 */
router.delete('/dropshipper/deletePackage', async (req, res, next) => {
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
}, deletePackage);
/**
 * @api {POST} /dropshipper/addBankAccount
 * @apiName paky
 * @apiGroup addBankAccount
 * @apiDescription dropshipper addBankAccount
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/addBankAccount', async (req, res, next) => {
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
}, addBankAccount);
/**
 * @api {POST} /dropshipper/getBankAccount
 * @apiName paky
 * @apiGroup getBankAccount
 * @apiDescription dropshipper getBankAccount
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/getBankAccount', async (req, res, next) => {
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
}, getBankAccount);
/**
 * @api {POST} /dropshipper/deleteBankAccount
 * @apiName paky
 * @apiGroup deleteBankAccount
 * @apiDescription dropshipper deleteBankAccount
 *
 * @apiSuccess message and get data needed
 */
router.delete('/dropshipper/deleteBankAccount', async (req, res, next) => {
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
}, deleteBankAccount);
/**
 * @api {POST} /dropshipper/addPaymentRequest
 * @apiName paky
 * @apiGroup addPaymentRequest
 * @apiDescription dropshipper addPaymentRequest
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/addPaymentRequest', async (req, res, next) => {
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
}, addPaymentRequest);
/**
 * @api {POST} /dropshipper/validateVerificationPin
 * @apiName paky
 * @apiGroup validateVerificationPin
 * @apiDescription dropshipper validateVerificationPin
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/validateVerificationPin', async (req, res, next) => {
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
}, validateVerificationPin);
/**
 * @api {POST} /dropshipper/getPortfolio
 * @apiName paky
 * @apiGroup getPortfolio
 * @apiDescription dropshipper getPortfolio
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/getPortfolio', async (req, res, next) => {
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
}, getPortfolio);
/**
 * @api {POST} /dropshipper/downloadExcelPortfolio
 * @apiName paky
 * @apiGroup downloadExcelPortfolio
 * @apiDescription dropshipper downloadExcelPortfolio
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/downloadExcelPortfolio', async (req, res, next) => {
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
}, downloadExcelPortfolio);
/**
 * @api {POST} /dropshipper/getCarriers
 * @apiName paky
 * @apiGroup getCarriers
 * @apiDescription dropshipper getCarriers
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/getCarriers', async (req, res, next) => {
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
 * @api {POST} /dropshipper/editProductPackageCuantity
 * @apiName paky
 * @apiGroup editProductPackageCuantity
 * @apiDescription dropshipper editProductPackageCuantity
 *
 * @apiSuccess message and get data needed
 */
router.put('/dropshipper/editProductPackageCuantity/:id_pp', async (req, res, next) => {
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
}, editProductPackage);
/**
 * @api {POST} /dropshipper/editProductPackageCuantity
 * @apiName paky
 * @apiGroup editProductPackageCuantity
 * @apiDescription dropshipper editProductPackageCuantity
 *
 * @apiSuccess message and get data needed
 */
router.post('/dropshipper/getPayments', async (req, res, next) => {
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
}, getPayments);
/**
 * @api {POST} /dropshipper/deletePaymentRequest
 * @apiName paky
 * @apiGroup deletePaymentRequest
 * @apiDescription dropshipper deletePaymentRequest
 *
 * @apiSuccess message and get data needed
 */
router.delete('/dropshipper/deletePaymentRequest', async (req, res, next) => {
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
}, deletePaymentRequest);
// I export the router
export default router;