// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import { Sequelize, Op } from "sequelize";
// import personaly models
import { Router_user } from '../models/router_users.model.js';
import { Package } from '../models/packages.model.js';
import { PackageProduct } from "../models/packages_products.model.js";
import { Product } from "../models/products.model.js";
import { Carrier } from "../models/carriers.model.js";
import { Vehicle } from "../models/vehicles.model.js";
import { Type_document } from "../models/type_document.model.js";
import { Store } from "../models/stores.model.js";
// config dot env secret
dotenv.config();
// Firme private secret jwt
const secret = process.env.SECRET;
// capture the exact time in my time zone using the moment-timezone module, I do this capture outside the methods to reuse this variable
const bogotaTime = moment.tz('America/Bogota');
const formattedTime = bogotaTime.format('YYYY-MM-DD HH:mm:ss');

// Method login user router
export async function login(req, res) {
    // logger control proccess
    logger.info('enter the endpoint login user router');
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
            attributes: ['id_ru', 'name_ru', 'email_ru', 'status_ru', 'last_login_ru', 'fk_id_city_ru']
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
                    exp: Date.now() + 60 * 1000 * 60 * 4
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
        // capture the id that comes in the parameters of the req
        const { city } = req.body;
        // I validate req correct json
        if (!city) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const getCityPackages = await Package.findAll({
            where: {
                status_p: {
                    [Sequelize.Op.notIn]: [6]
                },
                fk_id_tp_p: 1,
                confirmation_dropshipper_p: 1
            },
            attributes: ['id_p', 'fk_id_tp_p', 'orden_p', 'guide_number_p', 'profit_carrier_p', 'total_price_p', 'with_collection_p', 'status_p', 'direction_client_p', 'createdAt'],
            include: [
                {
                    model: Store,
                    where: {
                        fk_id_city_store: city
                    },
                    attributes: ['fk_id_city_store']
                }
            ]
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

// Method get products packages city
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
                    attributes: ['id_pp', 'cuantity_pp', 'createdAt'],
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
            attributes: ['id_carrier', 'status_carrier', 'number_document_carrier', 'name_carrier', 'last_name_carrier', 'phone_number_carrier', 'email_carrier', 'fk_id_tc_carrier', 'fk_id_city_carrier'],
            where: {
                status_carrier: 1,
                fk_id_tc_carrier: 1,
                fk_id_city_carrier: city
            },
            include: [
                {
                    model: Type_document,
                    attributes: ['description_td']
                }
            ]
        });
        let numberOfRecords, capacityVehicle, status_capacity;
        // Process data for JSON response and promise.all for await all promise it is executing
        const formattedDataPackages = await Promise.all(getCarriers.map(async c => {
            // I call and save the result of the findAll method, which is d sequelize
            const getPackages = await Package.findAll({
                where: {
                    fk_id_carrier_p: c.id_carrier
                },
                attributes: ['id_p']
            });
            // I call and save the result of the findAll method, which is d sequelize
            const getVehicle = await Vehicle.findOne({
                where: {
                    fk_id_carrier_vehicle: c.id_carrier
                },
                attributes: ['id_vehicle', 'capacity_vehicle']
            });
            // To capture variables needed
            numberOfRecords = getPackages.length;
            capacityVehicle = getVehicle.capacity_vehicle;
            // Structure condition status ocupation
            if (numberOfRecords == 0) {
                status_capacity = "Libre";
            } else if (numberOfRecords < capacityVehicle) {
                status_capacity = "Parcial";
            } else if (numberOfRecords == capacityVehicle) {
                status_capacity = "Ocupado";
            }
            return {
                id_carrier: c.id_carrier,
                status_carrier: c.status_carrier,
                type_document: c.types_document.description_td,
                number_document_carrier: c.number_document_carrier,
                name_carrier: c.name_carrier,
                last_name_carrier: c.last_name_carrier,
                phone_number_carrier: c.phone_number_carrier,
                email_carrier: c.email_carrier,
                status_capacity
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

// Method get packages carriers city
export async function getPackagesCarrier(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint get packages carrier');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const getPackagesCarrier = await Package.findAll({
            where: {
                fk_id_carrier_p: id_carrier
            },
            attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'guide_number_p', 'status_p', 'with_collection_p', 'total_price_p']
        });
        // logger control proccess
        logger.info('Get packages carrier successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Get packages carrier successfuly',
            result: 1,
            data: getPackagesCarrier
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error packages carrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}

// Method get detail carrier, vehicle and package enables for asignate
export async function getDetailAsignate(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint get detail asignate');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const getDetailAsignate = await Carrier.findOne({
            where: {
                id_carrier
            },
            attributes: ['id_Carrier', 'name_carrier', 'last_name_carrier', 'phone_number_carrier', 'email_carrier', 'fk_id_city_carrier'],
            include: [
                {
                    model: Vehicle,
                    attributes: ['capacity_vehicle', 'description_vehicle', 'class_vehicle', 'plate_vehicle', 'color_vehicle', 'brand_vehicle', 'line_vehicle', 'model_vehicle', 'cylinder_capacity_vehicle']
                }
            ]
        });
        // I capture city by conditions later
        let city_carrier = getDetailAsignate.fk_id_city_carrier;
        // I call and save the result of the findAll method, which is d sequelize
        const getAsignatedPackage = await Package.findAll({
            where: {
                fk_id_carrier_p: id_carrier,
                status_p: {
                    [Sequelize.Op.notIn]: [6]
                }
            },
            attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'guide_number_p', 'status_p', 'with_collection_p', 'total_price_p', 'createdAt'],
        });
        // I call and save the result of the findAll method, which is d sequelize
        const getPackage = await Package.findAll({
            where: {
                fk_id_carrier_p: null,
                status_p: {
                    [Sequelize.Op.notIn]: [2, 3, 5, 6, 7]
                },
                confirmation_dropshipper_p: 1
            },
            attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'guide_number_p', 'status_p', 'with_collection_p', 'total_price_p', 'fk_id_destiny_city_p', 'fk_id_tp_p'],
            include: [
                {
                    model: Store,
                    where: {
                        fk_id_city_store: city_carrier
                    },
                    attributes: ['fk_id_city_store']
                }
            ]
        });
        // Validate the case status 4 packages nacionals and carrier city not access asignate
        const formattedDataPackages = getPackage.map(p => {
            let type_package = p.fk_id_tp_p;
            // Validate city carrier with city destiny package for status = 4
            if (type_package == 1) {
                return {
                    id_p: p.id_p,
                    orden_p: p.orden_p,
                    name_client_p: p.name_client_p,
                    phone_number_client_p: p.phone_number_client_p,
                    guide_number_p: p.guide_number_p,
                    status_p: p.status_p,
                    with_collection_p: p.with_collection_p,
                    total_price_p: p.total_price_p,
                    store: p.store
                }
            } else if (type_package == 2) {
                if (p.status_p == 1 || (p.status_p == 2 && city_carrier == p.fk_id_destiny_city_p)) {
                    return {
                        id_p: p.id_p,
                        orden_p: p.orden_p,
                        name_client_p: p.name_client_p,
                        phone_number_client_p: p.phone_number_client_p,
                        guide_number_p: p.guide_number_p,
                        status_p: p.status_p,
                        with_collection_p: p.with_collection_p,
                        total_price_p: p.total_price_p,
                        store: p.store
                    }
                }
            }
            return null;
        }).filter(item => item !== null);
        // logger control proccess
        logger.info('Get detail asignate successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Get detail asignate successfuly',
            result: 1,
            data_carrier: getDetailAsignate,
            data_asignated_packages: getAsignatedPackage,
            data_free_packages: formattedDataPackages
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error detail asignate: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}

// Method to asignate package carrier city
export async function toAsignatePackages(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint to asignate packages');
    try {
        // Extract id_carrier of req.body
        const { id_carrier, ids_p } = req.body;
        // I validate req correct json
        if (!ids_p || !id_carrier) return res.sendStatus(400);
        let error = false;
        // Run files array and update in database
        ids_p.forEach(async id_p => {
            // I declare the create method with its respective definition of the object and my Package  model in a variable taking into account the await
            let asignatePackage = await Package.findOne({
                where: {
                    id_p
                }
            });
            asignatePackage.set({
                fk_id_carrier_p: id_carrier
            });
            await asignatePackage.save();
            if (!asignatePackage) error = true;
        });
        // valid if everything went well in the udpate
        if (error) {
            // Devolver un JSON con un mensaje de error
            return res.status(400).json({
                message: 'Error to asignate a package',
                result: 0
            });
        }
        // logger control proccess
        logger.info('Packages asignated successfuly');
        // The credentials are incorrect
        res.json({
            message: 'To asignate asignated successfuly',
            result: 1,
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error to asignate packages: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}

// Method get inter city packages
export async function getInterCityPackages(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint get inter_city packages');
    try {
        // capture the id that comes in the parameters of the req
        const { city } = req.body;
        // I validate req correct json
        if (!city) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const getCityPackages = await Package.findAll({
            where: {
                status_p: {
                    [Sequelize.Op.notIn]: [6]
                },
                fk_id_tp_p: 2,
                confirmation_dropshipper_p: 1
            },
            attributes: ['id_p', 'fk_id_tp_p', 'orden_p', 'guide_number_p', 'profit_carrier_p', 'total_price_p', 'with_collection_p', 'status_p', 'direction_client_p', 'createdAt'],
            include: [
                {
                    model: Store,
                    where: {
                        fk_id_city_store: city
                    },
                    attributes: ['fk_id_city_store']
                }
            ]
        });
        // logger control proccess
        logger.info('Get inter_city packages successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Get inter_city packages successfuly',
            result: 1,
            data: getCityPackages
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error inter_city packages: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}

// Method get inter city carriers
export async function getCarriersInter(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint get carriers Inter_city');
    try {
        // capture the id that comes in the parameters of the req
        const { city } = req.body;
        // I validate req correct json
        if (!city) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const getCarriers = await Carrier.findAll({
            where: {
                status_carrier: 1,
                fk_id_tc_carrier: 2,
                fk_id_city_carrier: city
            },
            attributes: ['id_carrier', 'status_carrier', 'number_document_carrier', 'name_carrier', 'last_name_carrier', 'phone_number_carrier', 'email_carrier', 'fk_id_tc_carrier', 'fk_id_city_carrier'],
            include: [
                {
                    model: Type_document,
                    attributes: ['description_td']
                }
            ]
        });
        let numberOfRecords, capacityVehicle, status_capacity, type_carrier;
        // Process data for JSON response and promise.all for await all promise it is executing
        const formattedDataPackages = await Promise.all(getCarriers.map(async c => {
            // I call and save the result of the findAll method, which is d sequelize
            const getPackages = await Package.findAll({
                where: {
                    fk_id_carrier_p: c.id_carrier
                },
                attributes: ['id_p']
            });
            // I call and save the result of the findAll method, which is d sequelize
            const getVehicle = await Vehicle.findOne({
                where: {
                    fk_id_carrier_vehicle: c.id_carrier
                },
                attributes: ['id_vehicle', 'capacity_vehicle']
            });
            // To capture variables needed
            numberOfRecords = getPackages.length;
            capacityVehicle = getVehicle.capacity_vehicle;
            // Structure condition status ocupation
            if (numberOfRecords == 0) {
                status_capacity = "Libre";
            } else if (numberOfRecords < capacityVehicle) {
                status_capacity = "Parcial";
            } else if (numberOfRecords == capacityVehicle) {
                status_capacity = "Ocupado";
            }
            // Structure condition type carrier
            if (c.fk_id_tc_carrier == 1) {
                type_carrier = "Municipal";
            } else if (c.fk_id_tc_carrier == 2) {
                type_carrier = "Inter Municipal";
            }
            return {
                id_carrier: c.id_carrier,
                status_carrier: c.status_carrier,
                type_document: c.types_document.description_td,
                number_document_carrier: c.number_document_carrier,
                name_carrier: c.name_carrier,
                last_name_carrier: c.last_name_carrier,
                phone_number_carrier: c.phone_number_carrier,
                email_carrier: c.email_carrier,
                status_capacity,
                type_carrier
            }
        }));
        // logger control proccess
        logger.info('Get carriers Inter_city successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Get carriers Inter_citysuccessfuly',
            result: 1,
            data: formattedDataPackages
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error carriers Inter_city: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}

// Method get detail inter city carrier, vehicle and package enables for asignate
export async function getDetailAsignateInter(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint get detail asignate inter_city');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const getDetailAsignate = await Carrier.findOne({
            where: {
                id_carrier
            },
            attributes: ['id_Carrier', 'name_carrier', 'last_name_carrier', 'phone_number_carrier', 'email_carrier', 'fk_id_city_carrier'],
            include: [
                {
                    model: Vehicle,
                    attributes: ['capacity_vehicle', 'description_vehicle', 'class_vehicle', 'plate_vehicle', 'color_vehicle', 'brand_vehicle', 'line_vehicle', 'model_vehicle', 'cylinder_capacity_vehicle']
                }
            ]
        });
        // I capture city by conditions later
        let city_carrier = getDetailAsignate.fk_id_city_carrier;
        console.log(city_carrier)
        // I call and save the result of the findAll method, which is d sequelize
        const getAsignatedPackage = await Package.findAll({
            where: {
                fk_id_carrier_p: id_carrier,
                status_p: {
                    [Sequelize.Op.notIn]: [6]
                },
                fk_id_tp_p: 2
            },
            attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'guide_number_p', 'status_p', 'with_collection_p', 'total_price_p']
        });
        // I call and save the result of the findAll method, which is d sequelize
        const getPackage = await Package.findAll({
            where: {
                fk_id_carrier_p: null,
                status_p: {
                    [Sequelize.Op.notIn]: [1, 3, 4, 5, 6, 7]
                },
                fk_id_tp_p: 2,
                confirmation_dropshipper_p: 1
            },
            attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'guide_number_p', 'status_p', 'with_collection_p', 'total_price_p'],
            include: [
                {
                    model: Store,
                    where: {
                        fk_id_city_store: city_carrier
                    },
                    attributes: ['fk_id_city_store']
                }
            ]
        });
        // logger control proccess
        logger.info('Get detail asignate inter_city successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Get detail asignate inter_city successfuly',
            result: 1,
            data_carrier: getDetailAsignate,
            data_asignated_packages: getAsignatedPackage,
            data_free_packages: getPackage
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error detail asignate: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}