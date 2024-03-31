// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import { Sequelize } from "sequelize";
// import personaly models
import { Router_user } from '../models/router_users.model.js';
import { Package } from '../models/packages.model.js';
import { Store } from "../models/stores.model.js";
import { City } from "../models/cities.model.js";
import { PackageProduct } from "../models/packages_products.model.js";
import { Product } from "../models/products.model.js";
// config dot env secret
dotenv.config();
// Firme private secret jwt
const secret = process.env.SECRET;
// capture the exact time in my time zone using the moment-timezone module, I do this capture outside the methods to reuse this variable
const bogotaTime = moment.tz('America/Bogota');
const formattedTime = bogotaTime.format('YYYY-MM-DD HH:mm:ss');

// Method login Carriers
export async function login(req, res) {
    // logger control proccess
    logger.info('enter the endpoint login');
    try {
        // capture the id that comes in the parameters of the req
        const { email_ru, password_ru } = req.body;
        // I validate req correct json
        if (!email_ru || !password_ru) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const loginRU = await Router_user.findAll({
            where: {
                email_ru,
                password_ru
            },
            attributes: ['id_ru', 'name_ru', 'email_ru', 'status_ru', 'last_login_ru']
        });
        // I validate login exist
        if (loginRU.length > 0) {
            // realiazr la validacion si el usuario esta activado para poder hacer el login
            // 1. activo, 0. desactivado
            if (loginRU[0].status_ru === 1) {
                // Token Payload
                const payload = {
                    id_ru: loginRU[0].id_ru,
                    name_ru: loginRU[0].name_ru,
                    exp: Date.now() + 60 * 1000 * 60
                };
                // I Create json web token for return him in json response
                const token = jwt.sign(payload, secret);
                // I go through the login data that I obtained and send the lastlogin to be updated
                loginRU.forEach(async loginRU => {
                    await loginRU.update({
                        last_login_ru: formattedTime,
                    });
                });
                // logger control proccess
                logger.info('correct credentials, Started Sesion, token returned in response body data.');
                // The carrier exists and the credentials are correct
                res.json({
                    message: 'Successful login router user',
                    result: 1,
                    token,
                    data: loginRU
                });
            } else {
                // logger control proccess
                logger.info('User Disabled');
                // The credentials are incorrect
                res.status(401).json({
                    message: 'User Disabled',
                    result: 0,
                    status_ru: loginRU[0].status_ru
                });
            }
        } else {
            // logger control proccess
            logger.info('Incorrect credentials or non-existent credenciales');
            // The credentials are incorrect
            res.status(401).json({ message: 'Incorrect credentials or non-existent credenciales' });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error Login: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get city packages
export async function getCityPackages(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint get city packages');
    try {
        // I call and save the result of the findAll method, which is d sequelize
        const getCityPackages = await Package.findAll({
            where: {
                status_p: {
                    [Sequelize.Op.notIn]: [6]
                },
                fk_id_tp_p: {
                    [Sequelize.Op.notIn]: [2]
                }
            },
            attributes: ['id_p', 'fk_id_tp_p', 'orden_p', 'guide_number_p', 'profit_carrier_p', 'total_price_p', 'with_collection_p', 'status_p', 'direction_client_p', 'createdAt']
        });
        // logger control proccess
        logger.info('Get city packages successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Get city packages successfuly',
            result: 1,
            data: getCityPackages
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error city packages: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}

// Method get products packages
export async function getProductsPackage(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint get products package');
    try {
        // capture the id that comes in the parameters of the req
        const { id_p } = req.body;
        // I validate req correct json
        if (!id_p) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const getProductsPackage = await Package.findAll({
            where: {
                id_p
            },
            attributes: ['id_p'],
            include: [
                {
                    model: PackageProduct,
                    attributes: ['id_pp', 'createdAt'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id_product', 'name_product', 'description_product', 'price_sale_product', 'price_cost_product', 'size_product']
                        }
                    ]
                }
            ],
        });
        // logger control proccess
        logger.info('Get products package successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Get products package successfuly',
            result: 1,
            data: getProductsPackage
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error product package: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}