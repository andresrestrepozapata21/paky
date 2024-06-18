// I import my Express Router and modules need it
import { Router } from 'express';
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
// I import my controller with the methods I need
import { CronJobPackages, getCities, getDepartments, getTypeCarrier, getTypeDocument } from '../controllers/utils.controller.js';
// Firme private secret jwt
const secret = process.env.SECRET;
// I declare the constant that the Router() method returns and upload multer directory
const router = Router();
/**
 * @api {POST} /utils/typeDocuments
 * @apiName paky
 * @apiGroup typeDocuments
 * @apiDescription get typeDocuments
 *
 * @apiSuccess message and data
 */
router.get('/utils/typesCarrier', getTypeCarrier);
/**
 * @api {POST} /utils/typeDocuments
 * @apiName paky
 * @apiGroup typeDocuments
 * @apiDescription get typeDocuments
 *
 * @apiSuccess message and data
 */
router.get('/utils/typeDocuments', getTypeDocument);
/**
 * @api {POST} /utils/departments
 * @apiName paky
 * @apiGroup departments
 * @apiDescription get departments
 *
 * @apiSuccess message and data
 */
router.get('/utils/departments', getDepartments);
/**
 * @api {POST} /utils/cities
 * @apiName paky
 * @apiGroup cities
 * @apiDescription get cities
 *
 * @apiSuccess message and data
 */
router.post('/utils/cities', getCities);

// I export the router
export default router;
/**
 =======================================================================================================================

                                                    ROUTE CRON JOB

 =======================================================================================================================
 */
/**
 * @api {POST} /utils/cronJobPackages
 * @apiName paky
 * @apiGroup cronJobPackages
 * @apiDescription get cronJobPackages
 *
 * @apiSuccess message and data
 */
router.post('/utils/cronJobPackages', async (req, res, next) => {
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
}, CronJobPackages);