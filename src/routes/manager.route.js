// I import my Express Router and modules need it
import { Router } from 'express';
import multer from 'multer';
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
// I import my controller with the methods I need
import { login, master, getCityPackages, getInterCityPackages, detailPackage, editPackage, deletePackage, getCarrierPeticions, getDetailCarrier, agreeCarrier, rejectCarrier, getCarriers, detailCarrierAndHistory, editCarrier, deleteCarrier, deleteHistory, getTypeCarrier, getTypePackage, getPaymentsRequestCarrier, detailPaymentRequestCarrier, toPayCarrier, getPortfolioCarrier, downloadExcelPortfolioCarrier, getDropshippers, addDropshipper, getDetailDropshipper, editDropshipper, deleteDropshipper, getPaymentsRequestDropshipper, detailPaymentRequestDropshipper, toPayDropshipper, getPortfolioDropshipper, downloadExcelPortfolioDropshipper, editProductPackage, getCarriersCity, getTypeDocumentsCarrier, editVehicle, getEvidenceHistory } from "../controllers/manager.controller.js";
// Firme private secret jwt
const secret = process.env.SECRET;
// I declare the constant that the Router() method returns and upload multer directory
const router = Router();
/**
 * @api {POST} /manager/login
 * @apiName paky
 * @apiGroup manager
 * @apiDescription Login manager
 *
 * @apiSuccess message and data login
 */
router.post('/manager/login', login);
/**
 * @api {POST} /manager/master
 * @apiName paky
 * @apiGroup manager
 * @apiDescription master manager
 *
 * @apiSuccess message and data master
 */
router.post('/manager/master', async (req, res, next) => {
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
 * @api {POST} /manager/cityPackages
 * @apiName paky
 * @apiGroup manager
 * @apiDescription cityPackages manager
 *
 * @apiSuccess message and data cityPackages
 */
router.get('/manager/cityPackages', async (req, res, next) => {
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
 * @api {POST} /manager/interCityPackages
 * @apiName paky
 * @apiGroup manager
 * @apiDescription interCityPackages manager
 *
 * @apiSuccess message and data interCityPackages
 */
router.get('/manager/interCityPackages', async (req, res, next) => {
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
 * @api {POST} /manager/detailPackage
 * @apiName paky
 * @apiGroup manager
 * @apiDescription detailPackage manager
 *
 * @apiSuccess message and data detailPackage
 */
router.post('/manager/detailPackage', async (req, res, next) => {
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
 * @api {POST} /manager/editPackage
 * @apiName paky
 * @apiGroup editPackage
 * @apiDescription manager editPackage
 *
 * @apiSuccess message and get data needed
 */
router.put('/manager/editPackage/:id_p', async (req, res, next) => {
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
 * @api {POST} /manager/deletePackage
 * @apiName paky
 * @apiGroup deletePackage
 * @apiDescription manager deletePackage
 *
 * @apiSuccess message and get data needed
 */
router.delete('/manager/deletePackage', async (req, res, next) => {
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
 * @api {POST} /manager/carrierPeticions
 * @apiName paky
 * @apiGroup manager
 * @apiDescription carrierPeticions manager
 *
 * @apiSuccess message and data carrierPeticions
 */
router.get('/manager/carrierPeticions', async (req, res, next) => {
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
}, getCarrierPeticions);
/**
 * @api {POST} /manager/detailCarrier
 * @apiName paky
 * @apiGroup manager
 * @apiDescription detailCarrier manager
 *
 * @apiSuccess message and data detailCarrier
 */
router.post('/manager/detailCarrier', async (req, res, next) => {
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
}, getDetailCarrier);
/**
 * @api {POST} /manager/agreeCarrier
 * @apiName paky
 * @apiGroup manager
 * @apiDescription agreeCarrier manager
 *
 * @apiSuccess message and data agreeCarrier
 */
router.put('/manager/agreeCarrier', async (req, res, next) => {
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
}, agreeCarrier);
/**
 * @api {POST} /manager/rejectCarrier
 * @apiName paky
 * @apiGroup manager
 * @apiDescription rejectCarrier manager
 *
 * @apiSuccess message and data rejectCarrier
 */
router.put('/manager/rejectCarrier', async (req, res, next) => {
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
}, rejectCarrier);
/**
 * @api {POST} /manager/getCarriers
 * @apiName paky
 * @apiGroup manager
 * @apiDescription getCarriers manager
 *
 * @apiSuccess message and data getCarriers
 */
router.get('/manager/getCarriers', async (req, res, next) => {
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
 * @api {POST} /manager/detailCarrierAndHistory
 * @apiName paky
 * @apiGroup manager
 * @apiDescription detailCarrierAndHistory manager
 *
 * @apiSuccess message and data detailCarrierAndHistory
 */
router.post('/manager/detailCarrierAndHistory', async (req, res, next) => {
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
}, detailCarrierAndHistory);
/**
 * @api {POST} /manager/editCarrier
 * @apiName paky
 * @apiGroup editCarrier
 * @apiDescription manager editCarrier
 *
 * @apiSuccess message and get data needed
 */
router.put('/manager/editCarrier/:id_carrier', async (req, res, next) => {
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
}, editCarrier);
/**
 * @api {POST} /manager/deleteCarrier
 * @apiName paky
 * @apiGroup deleteCarrier
 * @apiDescription manager deleteCarrier
 *
 * @apiSuccess message and get data needed
 */
router.delete('/manager/deleteCarrier', async (req, res, next) => {
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
}, deleteCarrier);
/**
 * @api {POST} /manager/deleteHistory
 * @apiName paky
 * @apiGroup deleteHistory
 * @apiDescription manager deleteHistory
 *
 * @apiSuccess message and get data needed
 */
router.delete('/manager/deleteHistory', async (req, res, next) => {
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
}, deleteHistory);
/**
 * @api {POST} /manager/getTypeCarrier
 * @apiName paky
 * @apiGroup manager
 * @apiDescription getTypeCarrier manager
 *
 * @apiSuccess message and data getTypeCarrier
 */
router.get('/manager/getTypeCarrier', async (req, res, next) => {
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
}, getTypeCarrier);
/**
 * @api {POST} /manager/getTypePackage
 * @apiName paky
 * @apiGroup manager
 * @apiDescription getTypePackage manager
 *
 * @apiSuccess message and data getTypePackage
 */
router.get('/manager/getTypePackage', async (req, res, next) => {
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
}, getTypePackage);
/**
 * @api {POST} /manager/getPaymentsRequestCarrier
 * @apiName paky
 * @apiGroup manager
 * @apiDescription getPaymentsRequestCarrier manager
 *
 * @apiSuccess message and data getPaymentsRequestCarrier
 */
router.get('/manager/getPaymentsRequestCarrier', async (req, res, next) => {
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
}, getPaymentsRequestCarrier);
/**
 * @api {POST} /manager/detailPaymentRequestCarrier
 * @apiName paky
 * @apiGroup manager
 * @apiDescription detailPaymentRequestCarrier manager
 *
 * @apiSuccess message and data detailPaymentRequestCarrier
 */
router.post('/manager/detailPaymentRequestCarrier', async (req, res, next) => {
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
}, detailPaymentRequestCarrier);
/**
 * @api {POST} /manager/toPayCarrier
 * @apiName paky
 * @apiGroup toPayCarrier
 * @apiDescription manager toPayCarrier
 *
 * @apiSuccess message and get data needed
 */
router.post('/manager/toPayCarrier', async (req, res, next) => {
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
}, toPayCarrier);
/**
 * @api {POST} /manager/getPortfolio
 * @apiName paky
 * @apiGroup getPortfolio
 * @apiDescription manager getPortfolio
 *
 * @apiSuccess message and get data needed
 */
router.post('/manager/getPortfolioCarrier', async (req, res, next) => {
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
}, getPortfolioCarrier);
/**
 * @api {POST} /manager/downloadExcelPortfolio
 * @apiName paky
 * @apiGroup downloadExcelPortfolio
 * @apiDescription manager downloadExcelPortfolio
 *
 * @apiSuccess message and get data needed
 */
router.post('/manager/downloadExcelPortfolioCarrier', async (req, res, next) => {
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
}, downloadExcelPortfolioCarrier);
/**
 * @api {POST} /manager/getDropshippers
 * @apiName paky
 * @apiGroup manager
 * @apiDescription getDropshippers manager
 *
 * @apiSuccess message and data getDropshippers
 */
router.get('/manager/getDropshippers', async (req, res, next) => {
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
}, getDropshippers);
/**
 * @api {POST} /manager/addDropshipper
 * @apiName paky
 * @apiGroup addDropshipper
 * @apiDescription manager addDropshipper
 *
 * @apiSuccess message and get data needed
 */
router.post('/manager/addDropshipper', async (req, res, next) => {
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
}, addDropshipper);
/**
 * @api {POST} /manager/getDetailDropshipper
 * @apiName paky
 * @apiGroup getDetailDropshipper
 * @apiDescription manager getDetailDropshipper
 *
 * @apiSuccess message and get data needed
 */
router.post('/manager/getDetailDropshipper', async (req, res, next) => {
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
}, getDetailDropshipper);
/**
 * @api {POST} /manager/editDropshipper
 * @apiName paky
 * @apiGroup editDropshipper
 * @apiDescription manager editDropshipper
 *
 * @apiSuccess message and get data needed
 */
router.put('/manager/editDropshipper/:id_dropshipper', async (req, res, next) => {
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
}, editDropshipper);
/**
 * @api {POST} /manager/deleteDropshipper
 * @apiName paky
 * @apiGroup deleteDropshipper
 * @apiDescription manager deleteDropshipper
 *
 * @apiSuccess message and get data needed
 */
router.delete('/manager/deleteDropshipper', async (req, res, next) => {
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
}, deleteDropshipper);
/**
 * @api {POST} /manager/getPaymentsRequestDropshipper
 * @apiName paky
 * @apiGroup manager
 * @apiDescription getPaymentsRequestDropshipper manager
 *
 * @apiSuccess message and data getPaymentsRequestDropshipper
 */
router.get('/manager/getPaymentsRequestDropshipper', async (req, res, next) => {
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
}, getPaymentsRequestDropshipper);
/**
 * @api {POST} /manager/detailPaymentRequestDropshipper
 * @apiName paky
 * @apiGroup manager
 * @apiDescription detailPaymentRequestDropshipper manager
 *
 * @apiSuccess message and data detailPaymentRequestDropshipper
 */
router.post('/manager/detailPaymentRequestDropshipper', async (req, res, next) => {
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
}, detailPaymentRequestDropshipper);
/**
 * @api {POST} /manager/toPayDropshipper
 * @apiName paky
 * @apiGroup toPayDropshipper
 * @apiDescription manager toPayDropshipper
 *
 * @apiSuccess message and get data needed
 */
router.post('/manager/toPayDropshipper', async (req, res, next) => {
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
}, toPayDropshipper);
/**
 * @api {POST} /manager/getPortfolioDropshipper
 * @apiName paky
 * @apiGroup getPortfolioDropshipper
 * @apiDescription manager getPortfolioDropshipper
 *
 * @apiSuccess message and get data needed
 */
router.post('/manager/getPortfolioDropshipper', async (req, res, next) => {
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
}, getPortfolioDropshipper);
/**
 * @api {POST} /manager/downloadExcelPortfolioDropshipper
 * @apiName paky
 * @apiGroup downloadExcelPortfolioDropshipper
 * @apiDescription manager downloadExcelPortfolioDropshipper
 *
 * @apiSuccess message and get data needed
 */
router.post('/manager/downloadExcelPortfolioDropshipper', async (req, res, next) => {
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
}, downloadExcelPortfolioDropshipper);
/**
 * @api {POST} /dropshipper/editProductPackageCuantity
 * @apiName paky
 * @apiGroup editProductPackageCuantity
 * @apiDescription dropshipper editProductPackageCuantity
 *
 * @apiSuccess message and get data needed
 */
router.put('/manager/editProductPackageCuantity/:id_pp', async (req, res, next) => {
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
 * @api {POST} /manager/getCarriersCity
 * @apiName paky
 * @apiGroup getCarriers
 * @apiDescription dropshipper getCarriers
 *
 * @apiSuccess message and get data needed
 */
router.post('/manager/getCarriersCity', async (req, res, next) => {
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
}, getCarriersCity);
/**
 * @api {POST} /manager/getTypeDocumentsCarrier
 * @apiName paky
 * @apiGroup getCarriers
 * @apiDescription dropshipper getCarriers
 *
 * @apiSuccess message and get data needed
 */
router.get('/manager/getTypeDocumentsCarrier', async (req, res, next) => {
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
}, getTypeDocumentsCarrier);
/**
 * @api {POST} /dropshipper/editVehicle
 * @apiName paky
 * @apiGroup editVehicle
 * @apiDescription dropshipper editVehicle
 *
 * @apiSuccess message and get data needed
 */
router.put('/manager/editVehicle/:id_vehicle', async (req, res, next) => {
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
}, editVehicle);
/**
 * @api {POST} /manager/getEvidenceHistory
 * @apiName paky
 * @apiGroup getCarriers
 * @apiDescription dropshipper getCarriers
 *
 * @apiSuccess message and get data needed
 */
router.post('/manager/getEvidenceHistory', async (req, res, next) => {
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
}, getEvidenceHistory);
// I export the router
export default router;