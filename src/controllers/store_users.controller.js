// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import { Sequelize, Op } from "sequelize";
// import personaly models
import { StoreUser } from '../models/store_users.model.js';
import { Carrier } from "../models/carriers.model.js";
import { Package } from "../models/packages.model.js";
import { Store } from "../models/stores.model.js";
import { Type_document } from "../models/type_document.model.js";
import { Type_package } from "../models/types_package.model.js";
// config dot env secret
dotenv.config();
// Firme private secret jwt
const secret = process.env.SECRET;
// capture the exact time in my time zone using the moment-timezone module, I do this capture outside the methods to reuse this variable
const bogotaTime = moment.tz('America/Bogota');
const formattedTime = bogotaTime.format('YYYY-MM-DD HH:mm:ss');

// Method login dropshipper
export async function login(req, res) {
    // logger control proccess
    logger.info('enter the endpoint login dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { email_su, password_su } = req.body;
        // I validate req correct json
        if (!email_su || !password_su) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const loginSu = await StoreUser.findAll({
            where: {
                email_su,
                password_su
            },
            attributes: ['id_su', 'name_su', 'email_su', 'status_su', 'last_login_su'],
            include: [
                {
                    model: Store,
                    attributes: ['id_store', 'fk_id_city_store']
                }
            ]

        });
        // I validate login exist
        if (loginSu.length > 0) {
            // realiazr la validacion si el usuario esta activado para poder hacer el login
            // 1. activo, 0. desactivado
            if (loginSu[0].status_su === 1) {
                // Token Payload
                const payload = {
                    id_su: loginSu[0].id_su,
                    name_su: loginSu[0].name_su,
                    exp: Date.now() + 60 * 1000 * 60 * 4
                };
                // I Create json web token for return him in json response
                const token = jwt.sign(payload, secret);
                // I go through the login data that I obtained and send the lastlogin to be updated
                loginSu.forEach(async loginSu => {
                    await loginSu.update({
                        last_login_su: formattedTime,
                    });
                });
                // logger control proccess
                logger.info('correct credentials, Started Sesion, token returned in response body data.');
                // The carrier exists and the credentials are correct
                res.json({
                    message: 'Successful login dropshipper',
                    result: 1,
                    token,
                    data: loginSu
                });
            } else {
                // logger control proccess
                logger.info('User Disabled');
                // The credentials are incorrect
                res.status(401).json({
                    message: 'User Disabled',
                    result: 0,
                    status_su: loginSu[0].status_su
                });
            }
        } else {
            // logger control proccess
            logger.info('Incorrect credentials or non-existent credenciales');
            // The credentials are incorrect
            res.status(404).json({ message: 'Incorrect credentials or non-existent credenciales', result: 404 });
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

// Method get carriers city
export async function getCarriers(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint get carriers');
    try {
        // capture the id that comes in the parameters of the req
        const { city } = req.body;
        // I validate req correct json
        if (!city) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const getCarriers = await Carrier.findAll({
            attributes: ['id_carrier', 'status_carrier', 'number_document_carrier', 'name_carrier', 'last_name_carrier', 'phone_number_carrier', 'email_carrier', 'fk_id_tc_carrier', 'fk_id_city_carrier', 'debt_carrier'],
            where: {
                status_carrier: 1,
                debt_carrier: {
                    [Sequelize.Op.ne]: 0, // La deuda debe ser diferente de cero
                    [Sequelize.Op.gt]: 0  // Y la deuda debe ser mayor que cero
                },
                fk_id_city_carrier: city
            },
            include: [
                {
                    model: Type_document,
                    attributes: ['description_td']
                }
            ]
        });
        // Process data for JSON response and promise.all for await all promise it is executing
        const formattedDataPackages = await Promise.all(getCarriers.map(async c => {
            return {
                id_carrier: c.id_carrier,
                type_document: c.types_document.description_td,
                number_document_carrier: c.number_document_carrier,
                name_carrier: c.name_carrier,
                last_name_carrier: c.last_name_carrier,
                phone_number_carrier: c.phone_number_carrier,
                email_carrier: c.email_carrier,
                debt_carrier: c.debt_carrier
            }
        }));
        // logger control proccess
        logger.info('Get carriers successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Get carriers successfuly',
            result: 1,
            data: formattedDataPackages
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error carriers: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}

// Pass carrier
export async function passCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint pass carrier');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.params;
        const { pass } = req.body;
        // I validate req correct json
        if (!id_carrier || !pass) return res.sendStatus(400);
        // I find if exist package by 
        const getCarrier = await Carrier.findOne({
            where: {
                id_carrier
            }
        });
        // I validate exist info and infoStorePackage
        if (getCarrier) {
            let debt = getCarrier.debt_carrier;
            let debt_result = debt - pass;
            getCarrier.set({
                debt_carrier: debt_result
            });
            getCarrier.save()
            // logger control proccess
            logger.info('Pass carrier successfuly');
            // The credentials are incorrect
            res.json({
                message: 'Pass carrier successfuly',
                result: 1
            });
        } else {
            // logger control proccess
            logger.info('Not found carrier');
            // The credentials are incorrect
            res.status(401).json({
                message: 'Not found carrier',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error pass package: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method getpackages store
export async function packages(req, res) {
    // logger control proccess
    logger.info('enter the endpoint getpackages store');
    try {
        // capture the id that comes in the parameters of the req
        const { id_store } = req.body;
        // I validate req correct json
        if (!id_store) return res.sendStatus(400);
        // I find if exist package by store
        const getPackages = await Package.findAll({
            where: {
                fk_id_store_p: id_store
            },
            attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'direction_client_p', 'guide_number_p', 'status_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'total_price_shopify_p', 'confirmation_dropshipper_p', 'fk_id_tp_p', 'fk_id_carrier_p', 'createdAt'],
            include: [
                {
                    model: Type_package,
                    attributes: ['id_tp', 'description_tp']
                },
                {
                    model: Carrier,
                    attributes: ['name_carrier', 'last_name_carrier']
                }
            ]
        });
        // logger control proccess
        logger.info('Getpackages store successfuly');
        // Json setting response
        res.json({
            message: 'Getpackages store successfuly',
            result: 1,
            data: getPackages
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error getPackages: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}