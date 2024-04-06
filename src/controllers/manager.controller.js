// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import { Sequelize } from "sequelize";
// import personaly models
import { Manager } from '../models/managers.model.js';
import { City } from '../models/cities.model.js';
import { Store } from '../models/stores.model.js';
import { Package } from '../models/packages.model.js';
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
    logger.info('enter the endpoint login manager');
    try {
        // capture the id that comes in the parameters of the req
        const { email_manager, password_manager } = req.body;
        // I validate req correct json
        if (!email_manager || !password_manager) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const loginManager = await Manager.findAll({
            where: {
                email_manager,
                password_manager
            },
            attributes: ['id_manager', 'name_manager', 'email_manager', 'status_manager', 'last_login_manager']
        });
        // I validate login exist
        if (loginManager.length > 0) {
            // realiazr la validacion si el usuario esta activado para poder hacer el login
            if (loginManager[0].status_manager === 1) {
                // Token Payload
                const payload = {
                    id_manager: loginManager[0].id_manager,
                    name_manager: loginManager[0].name_manager,
                    exp: Date.now() + 60 * 1000 * 60
                };
                // I Create json web token for return him in json response
                const token = jwt.sign(payload, secret);
                // I go through the login data that I obtained and send the lastlogin to be updated
                loginManager.forEach(async loginManager => {
                    await loginManager.update({
                        last_login_manager: formattedTime,
                    });
                });
                // logger control proccess
                logger.info('correct credentials, Started Sesion, token returned in response body data.');
                // The manager exists and the credentials are correct
                res.json({
                    message: 'Successful login',
                    result: 1,
                    token,
                    data: loginManager
                });
            } else {
                // logger control proccess
                logger.info('User Disabled');
                // The credentials are incorrect
                res.status(401).json({
                    message: 'User Disabled',
                    result: 0,
                    status_manager: loginManager[0].status_carrier
                });
            }
        } else {
            // logger control proccess
            logger.info('Incorrect credentials or non-existent credenciales');
            // The credentials are incorrect
            res.status(401).json({ message: 'Incorrect credentials or non-existent credenciales', result: 0 });
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

// Method master manager
export async function master(req, res) {
    // logger control proccess
    logger.info('enter the endpoint master manager');
    try {
        // capture the id that comes in the parameters of the req
        const { id_manager } = req.body;
        // I validate req correct json
        if (!id_manager) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const infoManager = await Manager.findAll({
            where: {
                id_manager
            },
            attributes: ['id_manager', 'status_manager', 'name_manager', 'last_name_manager', 'phone_number_manager', 'email_manager', 'debt_dropshipper_manager', 'debt_carrier_manager', 'last_login_manager'],
        });
        // I find if exist package by dropshipper
        const infoStorePackageCity = await City.findAll({
            attributes: ['id_city', 'name_city'],
            include: [
                {
                    model: Store,
                    attributes: ['id_store', 'direction_store'],
                    include: [
                        {
                            model: Package,
                            attributes: ['id_p', 'orden_p']
                        }
                    ]
                }
            ]
        });
        // I validate exist  infoManager and infoStorePackageCity
        if (infoManager.length > 0 && infoStorePackageCity.length > 0) {
            // Declarate objet info manager
            const masterManager = {
                id_manager: infoManager[0].id_manager,
                status_manager: infoManager[0].status_manager,
                name_manager: infoManager[0].name_manager,
                last_name_manager: infoManager[0].last_name_manager,
                phone_number_manager: infoManager[0].phone_number_manager,
                email_manager: infoManager[0].email_manager,
                debt_dropshipper_manager: infoManager[0].debt_dropshipper_manager,
                debt_carrier_manager: infoManager[0].debt_carrier_manager,
                last_login_manager: infoManager[0].last_login_manager,
            }
            // logger control proccess
            logger.info('Master manager successfuly');
            // The credentials are incorrect
            res.json({
                message: 'Master manager successfuly',
                result: 1,
                data: masterManager,
                data_by_store: infoStorePackageCity
            });
        } else {
            // logger control proccess
            logger.info('Non-existent manager or not found packages');
            // The credentials are incorrect
            res.status(401).json({
                message: 'Non-existent manager or not found packages',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error Master: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}
