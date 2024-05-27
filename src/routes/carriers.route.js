// I import my Express Router and modules need it
import { Router } from 'express';
import multer from 'multer';
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
import multerUpload from "../middlewares/multer_carrier_documents.js";
import multerUploadVehicle from "../middlewares/multer_vehicle_documents.js";
import multerUploadEvidence from "../middlewares/multer_evidence_packages.js";
// I import my controller with the methods I need
import { asignatedPackages, confirmatePackage, deliverPackage, detailPackage, getHistory, loadDocumentsCarrier, loadDocumentsVehicle, login, master, onTheWayPackages, putAccounts, register, registerBankAccountCarrier, registerCarrierPaymentsRequest, registerVehicle, reportProblemPackage, getPassword, deliveryAtempt, callRequest } from '../controllers/carriers.controller.js';
// Firme private secret jwt
const secret = process.env.SECRET;
// I declare the constant that the Router() method returns and upload multer directory
const router = Router();
/**
 * @api {POST} /carrier/register
 * @apiName paky
 * @apiGroup carrier
 * @apiDescription register carrier
 *
 * @apiSuccess message and data register
 */
router.post('/carrier/register', register);
/**
 * @api {POST} /carrier/loadDocuments
 * @apiName paky
 * @apiGroup loadDocuments
 * @apiDescription register carrier documents and multer load document with validations
 *
 * @apiSuccess message and data register
 */
router.post('/carrier/loadDocuments', async (req, res, next) => {
    try {
        // I call the method of my multer middleware
        multerUpload.array('documents', 2)(req, res, (err) => {
            // check empty documents
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No documents provided', result: 0 });
            } else {
                // Validate errors multer personalized
                if (err instanceof multer.MulterError) {
                    // Multer error (e.g. file size exceeds limit)
                    return res.status(400).json({ message: 'Multer Error: Invalide number of files, invalide file size or extension type of any file', result: 0 });
                } else if (err) {
                    // Capture any unexpected errors and return a JSON with the error message
                    return res.status(500).json({ message: 'Something went wrong', result: 0 });
                }
            }
            // logger control proccess
            logger.info('Carrier documents load successfully');
            // If there is no error, move to the next middleware or controller
            next();
        });
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(500).json({ message: 'Something went wrong', result: 0 });
    }
}, loadDocumentsCarrier);
/**
 * @api {POST} /carrier/registerCarrierBankAccount
 * @apiName paky
 * @apiGroup registerCarrierBankAccount
 * @apiDescription register registerCarrierBankAccount
 *
 * @apiSuccess message and data register
 */
router.post('/carrier/registerCarrierBankAccount', registerBankAccountCarrier);
/**
 * @api {POST} /carrier/vehicle/register
 * @apiName paky
 * @apiGroup vehile
 * @apiDescription register carrier vehicle and multer load image vehicle with validations
 *
 * @apiSuccess message and data register
 */
router.post('/carrier/vehicle/register', async (req, res, next) => {
    try {
        // I call the method of my multer middleware
        multerUploadVehicle.array('image_vehicle', 1)(req, res, (err) => {
            // check empty documents
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No photo provided', result: 0 });
            } else {
                // Validate errors multer personalized
                if (err instanceof multer.MulterError) {
                    // Multer error (e.g. file size exceeds limit)
                    return res.status(400).json({ message: 'Multer Error: Invalide number of files, invalide file size or extension type of any file', result: 0 });
                } else if (err) {
                    // Capture any unexpected errors and return a JSON with the error message
                    return res.status(500).json({ message: 'Something went wrong', result: 0 });
                }
            }
            // logger control proccess
            logger.info('vehicle photo load successfully');
            // If there is no error, move to the next middleware or controller
            next();
        });
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(500).json({ message: 'Something went wrong', result: 0 });
    }
}, registerVehicle);
/**
 * @api {POST} /carrier/vehicle/loadDocuments
 * @apiName paky
 * @apiGroup carrierDocuments
 * @apiDescription register carrier documents and multer load document with validations
 *
 * @apiSuccess message and data register
 */
router.post('/carrier/vehicle/loadDocuments', async (req, res, next) => {
    try {
        // I call the method of my multer middleware
        multerUploadVehicle.array('documents', 2)(req, res, (err) => {
            // check empty documents
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No documents provided', result: 0 });
            } else {
                // Validate errors multer personalized
                if (err instanceof multer.MulterError) {
                    // Multer error (e.g. file size exceeds limit)
                    return res.status(400).json({ message: 'Multer Error: Invalide number of files, invalide file size or extension type of any file', result: 0 });
                } else if (err) {
                    // Capture any unexpected errors and return a JSON with the error message
                    return res.status(500).json({ message: 'Something went wrong', result: 0 });
                }
            }
            // logger control proccess
            logger.info('vehicle documents load successfully');
            // If there is no error, move to the next middleware or controller
            next();
        });
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(500).json({ message: 'Something went wrong', result: 0 });
    }
}, loadDocumentsVehicle);
/**
 * @api {POST} /carrier/login
 * @apiName paky
 * @apiGroup carrier
 * @apiDescription Login carrier
 *
 * @apiSuccess message and data login
 */
router.post('/carrier/login', login);
/**
 * @api {POST} /carrier/master
 * @apiName paky
 * @apiGroup master
 * @apiDescription carrier master
 *
 * @apiSuccess message and get data needed
 */
router.post('/carrier/master', async (req, res, next) => {
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
 * @api {POST} /carrier/asignatedPackage
 * @apiName paky
 * @apiGroup asignatedPackage
 * @apiDescription carrier asignated Package
 *
 * @apiSuccess message and get data needed
 */
router.post('/carrier/asignatedPackage', async (req, res, next) => {
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
        // logger control proccess
        logger.info('Token validated successfuly');
        next();
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(401).json({ message: 'Non-existent invalid token', result: 0, data: error.message });
    }
}, asignatedPackages);
/**
 * @api {POST} /carrier/confirmatePackage
 * @apiName paky
 * @apiGroup confirmatePackage
 * @apiDescription carrier confirmatePackage
 *
 * @apiSuccess message and get data needed
 */
router.post('/carrier/confirmatePackage', async (req, res, next) => {
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
        // logger control proccess
        logger.info('Token validated successfuly');
        next();
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(401).json({ message: 'Non-existent invalid token', result: 0, data: error.message });
    }
}, confirmatePackage);
/**
 * @api {POST} /carrier/onTheWayPackage
 * @apiName paky
 * @apiGroup onTheWayPackage
 * @apiDescription carrier onTheWayPackage
 *
 * @apiSuccess message and get data needed
 */
router.post('/carrier/onTheWayPackage', async (req, res, next) => {
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
        // logger control proccess
        logger.info('Token validated successfuly');
        next();
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(401).json({ message: 'Non-existent invalid token', result: 0, data: error.message });
    }
}, onTheWayPackages);
/**
 * @api {POST} /carrier/detailsPackage
 * @apiName paky
 * @apiGroup detailsPackage
 * @apiDescription carrier detailsPackage
 *
 * @apiSuccess message and get data needed
 */
router.post('/carrier/detailsPackage', async (req, res, next) => {
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
        // logger control proccess
        logger.info('Token validated successfuly');
        next();
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(401).json({ message: 'Non-existent invalid token', result: 0, data: error.message });
    }
}, detailPackage);
/**
 * @api {POST} /carrier/deliverPackage
 * @apiName paky
 * @apiGroup deliverPackage
 * @apiDescription carrier deliverPackage
 *
 * @apiSuccess message and get data needed
 */
router.post('/carrier/deliverPackage', async (req, res, next) => {
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
        // logger control proccess
        logger.info('Token validated successfuly');
        // I call the method of my multer middleware
        multerUploadEvidence.array('evidence', 1)(req, res, (err) => {
            // check empty documents
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No documents provided', result: 0 });
            } else {
                // Validate errors multer personalized
                if (err instanceof multer.MulterError) {
                    // Multer error (e.g. file size exceeds limit)
                    return res.status(400).json({ message: 'Multer Error: Invalide number of files, invalide file size or extension type of any file', result: 0 });
                } else if (err) {
                    // Capture any unexpected errors and return a JSON with the error message
                    return res.status(500).json({ message: 'Something went wrong', result: 0 });
                }
            }
            // logger control proccess
            logger.info('Evidence load successfully');
            // If there is no error, move to the next middleware or controller
            next();
        });
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(401).json({ message: 'Non-existent invalid token', result: 0, data: error.message });
    }
}, deliverPackage);
/**
 * @api {POST} /carrier/reportProblemPackage
 * @apiName paky
 * @apiGroup reportProblemPackage
 * @apiDescription carrier reportProblemPackage
 *
 * @apiSuccess message and get data needed
 */
router.post('/carrier/reportProblemPackage', async (req, res, next) => {
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
        // logger control proccess
        logger.info('Token validated successfuly');
        // I call the method of my multer middleware
        multerUploadEvidence.array('evidence', 1)(req, res, (err) => {
            // check empty documents
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No documents provided', result: 0 });
            } else {
                // Validate errors multer personalized
                if (err instanceof multer.MulterError) {
                    // Multer error (e.g. file size exceeds limit)
                    return res.status(400).json({ message: 'Multer Error: Invalide number of files, invalide file size or extension type of any file', result: 0 });
                } else if (err) {
                    // Capture any unexpected errors and return a JSON with the error message
                    return res.status(500).json({ message: 'Something went wrong', result: 0 });
                }
            }
            // logger control proccess
            logger.info('Evidence problem load successfully');
            // If there is no error, move to the next middleware or controller
            next();
        });
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(401).json({ message: 'Non-existent invalid token', result: 0, data: error.message });
    }
}, reportProblemPackage);
/**
 * @api {POST} /carrier/carrierPaymentsRequest
 * @apiName paky
 * @apiGroup carrierPaymentsRequest
 * @apiDescription carrier carrierPaymentsRequest
 *
 * @apiSuccess message and get data needed
 */
router.post('/carrier/carrierPaymentsRequest', async (req, res, next) => {
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
}, registerCarrierPaymentsRequest);
/**
 * @api {POST} /carrier/history
 * @apiName paky
 * @apiGroup history
 * @apiDescription carrier history
 *
 * @apiSuccess message and get data needed
 */
router.post('/carrier/history', async (req, res, next) => {
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
}, getHistory);
/**
 * @api {POST} /carrier/account
 * @apiName paky
 * @apiGroup account
 * @apiDescription carrier account
 *
 * @apiSuccess message and get data needed
 */
router.put('/carrier/accounts/:id_carrier', async (req, res, next) => {
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
        // logger control proccess
        logger.info('Token validated successfuly');
        // I call the method of my multer middleware
        multerUpload.array('qr', 1)(req, res, (err) => {
            // check empty documents
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: 'No documents provided', result: 0 });
            } else {
                // Validate errors multer personalized
                if (err instanceof multer.MulterError) {
                    // Multer error (e.g. file size exceeds limit)
                    return res.status(400).json({ message: 'Multer Error: Invalide number of files, invalide file size or extension type of any file', result: 0 });
                } else if (err) {
                    // Capture any unexpected errors and return a JSON with the error message
                    return res.status(500).json({ message: 'Something went wrong', result: 0 });
                }
            }
            // logger control proccess
            logger.info('Carrier QR load successfully');
            // If there is no error, move to the next middleware or controller
            next();
        });
    } catch (error) {
        // Capture any unexpected errors and return a JSON with the error message
        return res.status(401).json({ message: 'Non-existent invalid token', result: 0, data: error.message });
    }
}, putAccounts);
/**
 * @api {POST} /carrier/getPassword
 * @apiName paky
 * @apiGroup carrier
 * @apiDescription getPassword carrier
 *
 * @apiSuccess message and data getPassword
 */
router.post('/carrier/getPassword', getPassword);
/**
 * @api {POST} /carrier/deliveryAtempt
 * @apiName paky
 * @apiGroup deliveryAtempt
 * @apiDescription carrier deliveryAtempt
 *
 * @apiSuccess message and get data needed
 */
router.post('/carrier/deliveryAtempt', async (req, res, next) => {
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
}, deliveryAtempt);
/**
 * @api {POST} /carrier/callRequest
 * @apiName paky
 * @apiGroup callRequest
 * @apiDescription carrier callRequest
 *
 * @apiSuccess message and get data needed
 */
router.post('/carrier/callRequest', async (req, res, next) => {
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
}, callRequest);
// I export the router
export default router;