// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
// import personaly models
import { Package } from '../models/packages.model.js';
import { Store } from "../models/stores.model.js";
import { City } from "../models/cities.model.js";
import { Central_warehouse } from "../models/central_warehouses.model.js";
import { Department } from "../models/departments.model.js";
// config dot env secret
dotenv.config();
// Firme private secret jwt
const secret = process.env.SECRET;
// capture the exact time in my time zone using the moment-timezone module, I do this capture outside the methods to reuse this variable
const bogotaTime = moment.tz('America/Bogota');
const formattedTime = bogotaTime.format('YYYY-MM-DD HH:mm:ss');

// Method getPackageGuide
export async function getPackageGuide(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint getPackageGuide');
    try {
        // capture the id that comes in the parameters of the req
        const { guide_number_p } = req.body;
        // I validate req correct json
        if (!guide_number_p) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const getPackage = await Package.findOne({
            where: {
                guide_number_p
            },
            include: [
                {
                    model: Store,
                    attributes: ['id_store', 'direction_store'],
                    include: [
                        {
                            model: City,
                            attributes: ['id_city', 'name_city'],
                            include: [
                                {
                                    model: Central_warehouse,
                                    attributes: ['id_cw', 'name_cw', 'direction_cw'],
                                },
                                {
                                    model: Department,
                                    attributes: ['id_d', 'name_d'],
                                }
                            ]
                        }
                    ]
                },
                {
                    model: City,
                    attributes: ['id_city', 'name_city'],
                    include: [
                        {
                            model: Central_warehouse,
                            attributes: ['id_cw', 'name_cw', 'direction_cw'],
                        },
                        {
                            model: Department,
                            attributes: ['id_d', 'name_d'],
                        }
                    ]
                }
            ],
            attributes: ['id_p', 'fk_id_tp_p', 'orden_p', 'guide_number_p', 'profit_carrier_p', 'total_price_p', 'with_collection_p', 'status_p', 'direction_client_p', 'createdAt'],
            order: [
                ['createdAt', 'ASC'] // Sort by column 'column_name' in ascending order
            ]
        });
        // I validate exist getPackage
        if (getPackage) {
            // logger control proccess
            logger.info('Get package successfuly');
            // The credentials are incorrect
            res.json({
                message: 'Get package successfuly',
                result: 1,
                data: getPackage
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
        logger.info('Error city packages: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}