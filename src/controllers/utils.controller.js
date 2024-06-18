// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
// import personaly models
import { Department } from "../models/departments.model.js";
import { City } from "../models/cities.model.js";
import { Type_document } from "../models/type_document.model.js";
import { Type_carrier } from "../models/types_carrier.model.js";
// config dot env secret
dotenv.config();
// Firme private secret jwt
const secret = process.env.SECRET;
// capture the exact time in my time zone using the moment-timezone module, I do this capture outside the methods to reuse this variable
const bogotaTime = moment.tz('America/Bogota');
const formattedTime = bogotaTime.format('YYYY-MM-DD HH:mm:ss');

// method to get type documents
export async function getTypeDocument(req, res) {
    // logger control proccess
    logger.info('enter the endpoint get types document');
    // I enclose everything in a try catch to control errors
    try {
        const typeDocuments = await Type_document.findAll();
        // valid if everything went well in the INSERT
        if (typeDocuments) {
            // logger control proccess
            logger.info('Get typeDocuments successfully');
            // I return the json with the message I want
            return res.json({
                message: 'Get typeDocuments successfully',
                result: 1,
                data: typeDocuments
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error get typeDocuments: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// method to get departments
export async function getDepartments(req, res) {
    // logger control proccess
    logger.info('enter the endpoint get departments');
    // I enclose everything in a try catch to control errors
    try {
        const departments = await Department.findAll();
        // valid if everything went well in the INSERT
        if (departments) {
            // logger control proccess
            logger.info('Get departments successfully');
            // I return the json with the message I want
            return res.json({
                message: 'Get departments successfully',
                result: 1,
                data: departments
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error getDepartments: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// method to get cities by department
export async function getCities(req, res) {
    // logger control proccess
    logger.info('enter the endpoint get cities');
    // I save the variables that come to me in the request in variables.
    const { fk_id_d_city } = req.body;
    // I validate req correct json
    if (!fk_id_d_city) return res.sendStatus(400);
    // I enclose everything in a try catch to control errors
    try {
        const cities = await City.findAll({
            where:{
                fk_id_d_city
            }
        });
        // valid if everything went well in the INSERT
        if (cities) {
            // logger control proccess
            logger.info('Get cities successfully');
            // I return the json with the message I want
            return res.json({
                message: 'Get cities successfully',
                result: 1,
                data: cities
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error getCities: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// method to get type documents
export async function getTypeCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint get types Carrier');
    // I enclose everything in a try catch to control errors
    try {
        const typesCarrier = await Type_carrier.findAll();
        // valid if everything went well in the INSERT
        if (typesCarrier) {
            // logger control proccess
            logger.info('Get typesCarrier successfully');
            // I return the json with the message I want
            return res.json({
                message: 'Get typesCarrier successfully',
                result: 1,
                data: typesCarrier
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error get typesCarrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}
/**
 =======================================================================================================================

                                                    ROUTE CRON JOB

 =======================================================================================================================
 */

// method to get cities by department
export async function CronJobPackages(req, res) {
    // I save the variables that come to me in the request in variables.
    const { data } = req.body;
    // logger control proccess
    logger.info('enter the endpoint get cron job package');
    return res.json({
        result: 1
    })
    // I enclose everything in a try catch to control errors
    try {
        const formatResponse = await Promise.all(data.orders.map(async element => {
            // I capture id order
            let id_shopify = element.id;

            // I find the city with validation departament
            const getPackage = await Package.findOne({
                where: {
                    id_shopify,
                }
            });
            if (!getPackage) {
                // variables for to create package paky
                let orden_p = element.order_number;
                let name_client_p = `${element.customer.first_name} ${element.customer.last_name}`;
                let phone_number_client_p = element.billing_address.phone;
                let email_client_p = element.customer.email;
                let direction_client_p = `${element.billing_address.address1} ${element.billing_address.address2}`;
                let comments_p = element.note;
                let guide_number_p = element.fulfillments.tracking_number;
                let status_p = 1;
                let profit_carrier_p = element.current_total_tax;
                let profit_carrier_inter_city_p = 10000;
                let profit_dropshipper_p = 0;
                let with_collection_p = 1;
                let total_price_p = element.current_total_price;
                let createdAt = element.created_at;
                let confirmation_carrier_p = 0;
                let confirmation_dropshipper_p = 0;
                let fk_id_store_p = 2; // dalta implementar
                let fk_id_tp_p = 1;
                let fk_id_destiny_city_p = 0;
                let department = element.billing_address.province;
                let city = element.billing_address.city;
                // Variables products package.

                // I find the city with validation departament
                const getCity = await City.findOne({
                    where: {
                        name_city: city,
                    },
                    include: {
                        model: Department,
                        where: {
                            name_d: department
                        }
                    }
                });
                // valid if everything went well in the Select
                if (getCity) {
                    fk_id_destiny_city_p = getCity.id_city;
                }

                console.log(id_shopify + " linea 220")


                // I create package
                const newPackage = await Package.create({
                    id_shopify,
                    orden_p,
                    guide_number_p,
                    with_collection_p,
                    profit_carrier_p,
                    profit_carrier_inter_city_p,
                    profit_dropshipper_p,
                    total_price_p,
                    name_client_p,
                    phone_number_client_p,
                    direction_client_p,
                    email_client_p,
                    comments_p,
                    createdAt,
                    fk_id_store_p,
                    fk_id_destiny_city_p,
                    fk_id_tp_p,
                    status_p,
                    confirmation_carrier_p,
                    confirmation_dropshipper_p
                });
                // valid if everything went well in the INSERT
                if (newPackage) {
                    // I capture the ID new package
                    //const newPackageId = newPackage.id_p;
                }

                //return {
                //    id_p,
                //    order_number,
                //    name_client_p,
                //    phone_number_client_p,
                //    email_client,
                //    direction_client_p,
                //    comments_p,
                //    guide_number_p,
                //    status_p,
                //    profit_carrier_p,
                //    profit_carrier_inter_city_p,
                //    profit_dropshipper_p,
                //    with_collection_p,
                //    total_price_p,
                //    created_at,
                //    confirmation_carrier_p,
                //    confirmation_dropshipper_p,
                //    fk_id_store_p,
                //    fk_id_destiny_city_p,
                //    fk_id_tp_p,
                //}
            }
        }));
        // logger control proccess
        logger.info('Cronjob new ordes shopify successfully');
        // I return the json with the message I want
        return res.json({
            message: 'Cronjob new ordes shopify successfully',
            result: 1,
            //data: formatResponse
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error Cronjob new ordes shopify: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}