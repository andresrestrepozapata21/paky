// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
// import personaly models
import { Op } from 'sequelize';
import { Department } from "../models/departments.model.js";
import { City } from "../models/cities.model.js";
import { Type_document } from "../models/type_document.model.js";
import { Type_carrier } from "../models/types_carrier.model.js";
import { Package } from "../models/packages.model.js";
import { Product } from "../models/products.model.js";
import { PackageProduct } from "../models/packages_products.model.js";
import { Store } from "../models/stores.model.js";
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
            where: {
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
    const { id_dropshipper, id_store, data } = req.body;
    // logger control proccess
    logger.info('enter the endpoint get cron job package:');
    // I enclose everything in a try catch to control errors
    try {
        // I capture id order
        let id_shopify = data.id;
        // I find the city with validation departament
        const getPackage = await Package.findOne({
            where: {
                id_shopify,
            }
        });
        // valid if everything went well in the Select
        if (!getPackage) {
            // variables for to create package paky
            let orden_p = data.order_number;
            let name_client_p = `${data.customer.first_name} ${data.customer.last_name}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
            let phone_number_client_p = data.billing_address.phone;
            let email_client_p = data.customer.email;
            let direction_client_p = `${data.billing_address.address1} ${data.billing_address.address2}`;
            let comments_p = data.note;
            let guide_number_p = data.fulfillments.tracking_number;
            let status_p = 1;
            let profit_carrier_p = 9000; // Ganancia Transportistas Locales
            let profit_carrier_inter_city_p = 10000; // Ganancia Transportistas Nacionales
            let profit_dropshipper_p = 0;
            let with_collection_p = 1;
            let total_price_p = data.current_total_price;
            let does_shopify_p = 1;
            let send_cost_shopify_p = data.total_shipping_price_set.shop_money.amount
            let total_price_shopify_p = data.current_total_price;
            let createdAt = data.created_at;
            let confirmation_carrier_p = 0;
            let confirmation_dropshipper_p = 0;
            let fk_id_store_p = id_store;
            let fk_id_tp_p;
            let fk_id_destiny_city_p = 0;
            let department = data.billing_address.province;
            let city = data.billing_address.city;

            if (city.toLowerCase() === "cali") {
                city = "cali";
                // I find the city with validation departament
                const getCity = await City.findOne({
                    where: {
                        name_city: city
                    },
                    include: {
                        model: Department,
                        where: {
                            name_d: {
                                [Op.like]: `%${department}%`
                            }
                        }
                    }
                });
                // valid if everything went well in the Select
                if (getCity) {
                    fk_id_destiny_city_p = getCity.id_city;
                    // I find the city of the store
                    const getStoreCity = await Store.findOne({
                        where: {
                            id_store,
                        }
                    });
                    // valid if everything went well in the Select
                    if (getStoreCity) {
                        const storeCity = getStoreCity.fk_id_city_store;
                        // compare if the store city is the same as the destination city
                        if (storeCity === fk_id_destiny_city_p) {
                            fk_id_tp_p = 1; // local package
                        } else {
                            fk_id_tp_p = 2; // national package
                        }
                    }
                }
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
                    does_shopify_p,
                    send_cost_shopify_p,
                    total_price_shopify_p,
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
                    const newPackageId = newPackage.id_p;
                    console.log("id package: " + newPackageId);
                    let total_price_products = 0;
                    let send_priority_shopify_p = 0;
                    // I capture the line items
                    const line_items = data.line_items;
                    // I go through the line items
                    for (const line_item of line_items) {
                        // I capture the quantity of the product
                        const quantity = line_item.quantity;
                        // I capture the id of the product
                        const id_product_shopify = line_item.product_id;
                        // I find the city with validation departament
                        const getProduct = await Product.findOne({
                            where: {
                                id_product_shopify,
                            }
                        });
                        // valid if everything went well in the Select
                        if (!getProduct) {
                            // I capture the variables needed to create the product
                            const name_product = line_item.name
                            const description_product = "Producto registrado por Shopify";
                            const price_sale_product = line_item.price;
                            const price_cost_product = 0;
                            const size_product = "Mediano";
                            // I validate if the product is not the shipping priority
                            if (name_product != "ENVÍO PRIORITARIO") {
                                // I create product
                                const newProduct = await Product.create({
                                    id_product_shopify,
                                    name_product,
                                    description_product,
                                    price_sale_product,
                                    price_cost_product,
                                    size_product,
                                    fk_id_dropshipper_product: id_dropshipper
                                });
                                // valid if everything went well in the INSERT
                                if (newProduct) {
                                    // To update total price products
                                    total_price_products += line_item.price;
                                    // I capture the ID new package
                                    const newProductId = newProduct.id_product;
                                    console.log("id product: " + newProductId)
                                    // I create product
                                    const newPackageProduct = await PackageProduct.create({
                                        cuantity_pp: quantity,
                                        fk_id_p_pp: newPackageId,
                                        fk_id_product_pp: newProductId
                                    });
                                }
                            } else {
                                // To update total price products
                                send_priority_shopify_p = line_item.price
                            }
                        } else {
                            // I capture the ID new package
                            const id_product = getProduct.id_product;
                            // To update total price products
                            total_price_products += (line_item.price * quantity);
                            // I create product
                            const newPackageProduct = await PackageProduct.create({
                                cuantity_pp: quantity,
                                fk_id_p_pp: newPackageId,
                                fk_id_product_pp: id_product
                            });
                        }
                    }
                    // Update total price package with total price products
                    newPackage.set({
                        total_price_p: total_price_products,
                        send_priority_shopify_p
                    });
                    await newPackage.save();
                }
            } else {
                // logger control proccess
                logger.info('Cronjob new ordes shopify successfully');
                // I return the json with the message I want
                return res.json({
                    message: 'City different from Cali',
                    result: 1,
                    //data: formatResponse
                });
            }
        }
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