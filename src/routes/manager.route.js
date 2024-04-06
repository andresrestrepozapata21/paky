// I import my Express Router and modules need it
import { Router } from 'express';
import multer from 'multer';
import jwt from "jsonwebtoken";
import logger from '../utils/logger.js';
// I import my controller with the methods I need
import { login, master } from "../controllers/manager.controller.js";
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
router.post('/manager/master', master);
// I export the router
export default router;