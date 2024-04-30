// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import { Sequelize, Op } from "sequelize";
// import personaly models
import { StoreUser } from '../models/store_users.model.js';
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
            attributes: ['id_su', 'name_su', 'email_su', 'status_su', 'last_login_su']
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

// Method getpackages dropshipper
export async function getpackages(req, res) {
    // logger control proccess
    logger.info('enter the endpoint getpackages dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_su } = req.body;
        // I validate req correct json
        if (!id_su) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const infoStorePackage = await Store.findAll({
            where: {
                fk_id_su_store: id_su
            },
            attributes: ['id_store'],
            include: [
                {
                    model: City,
                    attributes: ['name_city'],
                    include: [
                        {
                            model: Department,
                            attributes: ['name_d']
                        }
                    ]
                },
                {
                    model: Package,
                    attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'direction_client_p', 'guide_number_p', 'status_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'confirmation_dropshipper_p', 'fk_id_tp_p', 'fk_id_carrier_p', 'createdAt'],
                    include: [
                        {
                            model: Type_package,
                            attributes: ['id_tp', 'description_tp']
                        },
                        {
                            model: Carrier,
                            attributes: ['name_carrier', 'last_name_carrier']
                        },
                        {
                            model: Store,
                            attributes: ['direction_store'],
                            include: [
                                {
                                    model: City,
                                    attributes: ['name_city'],
                                    include: [
                                        {
                                            model: Department,
                                            attributes: ['name_d']
                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                }
            ]
        });
        // Process data for JSON response
        const getPackages = infoStorePackage.flatMap(p => p.packages);
        // I run packages for build my accept JSON
        const packages = getPackages.map(p => {
            let warehouse = p.store.direction_store + " - " + p.store.city.name_city + " - " + p.store.city.department.name_d;
            let carrier;
            if (p.carrier) {
                carrier = p.carrier.name_carrier + " " + p.carrier.last_name_carrier;
            } else {
                carrier = 'N/A'
            }
            return {
                id_p: p.id_p,
                orden_p: p.orden_p,
                createdAt: p.createdAt,
                client_p: p.name_client_p + " - " + p.direction_client_p,
                warehouse,
                type_send: p.types_package.description_tp,
                status_p: p.status_p,
                carrier,
                confirmation_dropshipper_p: p.confirmation_dropshipper_p
            }
        })
        // logger control proccess
        logger.info('Getpackages Dropshipper successfuly');
        // Json setting response
        res.json({
            message: 'Getpackages Dropshipper successfuly',
            result: 1,
            data: packages
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
