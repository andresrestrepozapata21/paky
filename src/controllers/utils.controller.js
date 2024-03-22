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