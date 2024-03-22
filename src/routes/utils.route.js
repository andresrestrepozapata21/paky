// I import my Express Router and modules need it
import { Router } from 'express';
// I import my controller with the methods I need
import { getCities, getDepartments, getTypeCarrier, getTypeDocument } from '../controllers/utils.controller.js';
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