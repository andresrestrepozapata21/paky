// I import the modules that need to be customized like the models or installed with npm
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
// import personaly models
import { Package } from '../models/packages.model.js';
import { Store } from "../models/stores.model.js";
import { City } from "../models/cities.model.js";
import { Central_warehouse } from "../models/central_warehouses.model.js";
import { Department } from "../models/departments.model.js";
import { PackageProduct } from '../models/packages_products.model.js';
import { Product } from '../models/products.model.js';
import { Carrier } from '../models/carriers.model.js';
import { Type_package } from '../models/types_package.model.js';
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
                    model: Carrier,
                    attributes: ['id_carrier', 'name_carrier', 'last_name_carrier', 'phone_number_carrier']
                },
                {
                    model: Type_package,
                    attributes: ['id_tp', 'description_tp']
                },
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
                },
                {
                    model: PackageProduct,
                    attributes: ['id_pp', 'cuantity_pp', 'createdAt'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id_product', 'name_product', 'description_product', 'price_sale_product', 'price_cost_product', 'size_product']
                        }
                    ]
                }
            ],
            attributes: ['id_p', 'fk_id_tp_p', 'orden_p', 'guide_number_p', 'profit_carrier_p', 'total_price_p', 'with_collection_p', 'status_p', 'direction_client_p', 'createdAt', 'phone_number_client_p', 'name_client_p'],
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
            logger.info('Not found packages');
            // The credentials are incorrect
            res.status(404).json({
                message: 'Not found packages',
                result: 404
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