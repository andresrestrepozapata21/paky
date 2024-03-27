// I import my Express Router and modules need it
import { Router } from 'express';
import multer from 'multer';
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
// I import my controller with the methods I need
import { login } from '../controllers/router_users.controller.js';
// Firme private secret jwt
const secret = process.env.SECRET;
// I declare the constant that the Router() method returns and upload multer directory
const router = Router();
/**
 * @api {POST} /carrier/login
 * @apiName paky
 * @apiGroup carrier
 * @apiDescription login carrier
 *
 * @apiSuccess message and data login
 */
router.post('/routerUser/login', login);
// I export the router
export default router;