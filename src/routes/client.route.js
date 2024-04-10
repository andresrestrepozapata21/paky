// I import my Express Router and modules need it
import { Router } from 'express';
// I import my controller with the methods I need
import { getPackageGuide } from "../controllers/client.controller.js"
// Firme private secret jwt
const secret = process.env.SECRET;
// I declare the constant that the Router() method returns and upload multer directory
const router = Router();

/**
 * @api {POST} /client/getPackageGuide
 * @apiName paky
 * @apiGroup client
 * @apiDescription getPackageGuide client
 *
 * @apiSuccess message and data getPackageGuide
 */
router.post('/client/getPackageGuide', getPackageGuide);

// I export the router
export default router;