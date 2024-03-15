// I import my Express Router and modules need it
import { Router } from 'express';
import multer from 'multer';
// I import logger js
import logger from '../utils/logger.js';
// I import my controller with the methods I need
import { loadDocumentsCarrier, loadDocumentsVehicle, login, register, registerVehicle } from '../controllers/carriers.controller.js';
//I import multer middleware controller
import multerUpload from "../middlewares/multer_carrier_documents.js";
import multerUploadVehicle from "../middlewares/multer_vehicle_documents.js";

// I declare the constant that the Router() method returns and upload multer directory
const router = Router();
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
 * @api {POST} /carrier/register
 * @apiName paky
 * @apiGroup carrier
 * @apiDescription register carrier
 *
 * @apiSuccess message and data register
 */
router.post('/carrier/register', register);
/**
 * @api {POST} /carrierDocuments/register
 * @apiName paky
 * @apiGroup carrierDocuments
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
 * @api {POST} /carrierDocuments/register
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
// I export the router
export default router;