// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import { Sequelize } from "sequelize";
// import personaly models
import { Manager } from '../models/managers.model.js';
import { City } from '../models/cities.model.js';
import { Department } from '../models/departments.model.js';
import { Store } from '../models/stores.model.js';
import { Package } from '../models/packages.model.js';
import { Carrier } from '../models/carriers.model.js';
import { Type_package } from "../models/types_package.model.js";
import { Central_warehouse } from "../models/central_warehouses.model.js";
import { PackageProduct } from "../models/packages_products.model.js";
import { Product } from "../models/products.model.js";
import { Status_history } from "../models/status_history.model.js";
import { Type_carrier } from "../models/types_carrier.model.js";
import { Carrier_document } from "../models/carrier_documents.model.js";
import { Vehicle } from "../models/vehicles.model.js";
import { Vehicle_document } from "../models/vehicle_documents.model.js";
import { Carrier_payment_request } from "../models/carrier_payment_requests.model.js";
import { Carrier_bank_account } from "../models/carrier_bank_accounts.model.js";
import { Portfolio_history_carrier } from '../models/portfolio_history_carrier.model.js'
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

// Method get city packages
export async function getCityPackages(req, res) {
    // logger control proccess
    logger.info('enter the endpoint get city packages');
    try {
        // I find if exist package
        const getCityPackages = await Package.findAll({
            where: {
                fk_id_tp_p: 1
            },
            attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'direction_client_p', 'guide_number_p', 'status_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'confirmation_dropshipper_p', 'fk_id_tp_p', 'fk_id_carrier_p'],
            include: [
                {
                    model: Carrier,
                    attributes: ['id_carrier', 'name_carrier', 'last_name_carrier']
                }
            ]
        });
        // logger control proccess
        logger.info('GetCitypackages successfuly');
        // Json reponse setting
        res.json({
            message: 'GetCitypackages successfuly',
            result: 1,
            data: getCityPackages
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error GetCitypackages: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get inter city packages
export async function getInterCityPackages(req, res) {
    // logger control proccess
    logger.info('enter the endpoint get city packages');
    try {
        // I find if exist package
        const getCityPackages = await Package.findAll({
            where: {
                fk_id_tp_p: 2
            },
            attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'direction_client_p', 'guide_number_p', 'status_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'confirmation_dropshipper_p', 'fk_id_tp_p', 'fk_id_carrier_p'],
            include: [
                {
                    model: Carrier,
                    attributes: ['id_carrier', 'name_carrier', 'last_name_carrier']
                }
            ]
        });
        // logger control proccess
        logger.info('GetCitypackages successfuly');
        // Json reponse setting
        res.json({
            message: 'GetCitypackages successfuly',
            result: 1,
            data: getCityPackages
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error GetCitypackages: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method detailPackage
export async function detailPackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint detailPackage manager');
    try {
        // capture the id that comes in the parameters of the req
        const { id_p } = req.body;
        // I validate req correct json
        if (!id_p) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const getPackage = await Package.findOne({
            where: {
                id_p
            },
            attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'direction_client_p', 'guide_number_p', 'status_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'confirmation_dropshipper_p', 'createdAt'],
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
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (getPackage) {
            // I find if exist package by dropshipper
            const getHistory = await Status_history.findAll({
                where: {
                    fk_id_p_sh: id_p
                },
                attributes: ['id_sh', 'status_sh', 'comentary_sh', 'evidence_sh', 'createdAt'],
                include: [
                    {
                        model: Carrier,
                        attributes: ['id_carrier', 'name_carrier', 'last_name_carrier', 'phone_number_carrier']
                    },
                ],
                order: [['createdAt', 'ASC']]
            });
            // logger control proccess
            logger.info('detailPackage successfuly');
            // The credentials are incorrect
            res.json({
                message: 'detailPackage successfuly',
                result: 1,
                data: getPackage,
                data_history: getHistory
            });
        } else {
            // logger control proccess
            logger.info('Not found packages');
            // The credentials are incorrect
            res.status(401).json({
                message: 'Not found packages',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error detailPackage: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method editPackage
export async function editPackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint edit package');
    try {
        // capture the id that comes in the parameters of the req
        const { id_p } = req.params;
        //const { orden_p, name_client_p, phone_number_client_p, email_client_p, direction_client_p, guide_number_p, status_p, with_collection_p, createdAt, fk_id_store_p, fk_id_carrier_p, fk_id_tp_p, fk_id_destiny_city_p } = req.body;
        // I validate req correct json
        if (!id_p) return res.sendStatus(400);
        // I find if exist package by
        const getPackage = await Package.findOne({
            where: {
                id_p
            }
        });
        // I validate exist  inf and infoStorePackage
        if (getPackage) {
            getPackage.set(req.body);
            getPackage.save()
            // logger control proccess
            logger.info('edit package successfuly');
            // The credentials are incorrect
            res.json({
                message: 'edit package successfuly',
                result: 1,
                getPackage
            });
        } else {
            // logger control proccess
            logger.info('Not found packages');
            // The credentials are incorrect
            res.status(401).json({
                message: 'Not found packages',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error edit package: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method deletePackage
export async function deletePackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint delete package');
    try {
        // capture the id that comes in the parameters of the req
        const { id_p } = req.body;
        // I validate req correct json
        if (!id_p) return res.sendStatus(400);
        // I find if exist package
        const getPackage = await Package.destroy({
            where: {
                id_p
            }
        });
        if (getPackage) {
            // logger control proccess
            logger.info('delete package successfuly');
            // The credentials are incorrect
            res.json({
                message: 'delete package successfuly',
                result: 1,
            });
        } else {
            // logger control proccess
            logger.info('Not found carrier');
            // Json reponse setting non existing packages
            res.status(401).json({
                message: 'Not found carrier',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error delete package: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get request carrier
export async function getCarrierPeticions(req, res) {
    // logger control proccess
    logger.info('enter the endpoint get city packages');
    try {
        // I find if exist package
        const getCarrierPeticions = await Carrier.findAll({
            where: {
                status_carrier: {
                    [Sequelize.Op.in]: [2]
                }
            },
            attributes: ['id_carrier', 'status_carrier', 'name_carrier', 'revenue_carrier', 'debt_carrier', 'url_QR_carrier', 'bancolombia_number_account_carrier', 'nequi_carrier', 'daviplata_carrier'],
            include: [
                {
                    model: Type_carrier,
                    attributes: ['id_tc', 'description_tc']
                }
            ]
        });
        // logger control proccess
        logger.info('getCarrierPeticions successfuly');
        // Json reponse setting
        res.json({
            message: 'getCarrierPeticions successfuly',
            result: 1,
            data: getCarrierPeticions
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error getCarrierPeticions: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get details carrier
export async function getDetailCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint getDetailCarrier');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I find if exist package
        const getDetailCarrier = await Carrier.findAll({
            where: {
                id_carrier
            },
            attributes: ['id_carrier', 'status_carrier', 'rejected_carrier', 'name_carrier', 'revenue_carrier', 'debt_carrier', 'url_QR_carrier', 'bancolombia_number_account_carrier', 'nequi_carrier', 'daviplata_carrier'],
            include: [
                {
                    model: Type_carrier,
                    attributes: ['id_tc', 'description_tc']
                },
                {
                    model: Carrier_document
                },
                {
                    model: Vehicle,
                    include: [
                        {
                            model: Vehicle_document
                        }
                    ]
                }
            ]
        });
        // I validate exist getDetailCarrier
        if (getDetailCarrier.length > 0) {

            // logger control proccess
            logger.info('getDetailCarrier successfuly');
            // Json reponse setting
            res.json({
                message: 'getDetailCarrier successfuly',
                result: 1,
                data: getDetailCarrier
            });
        } else {
            // logger control proccess
            logger.info('Not found getDetailCarrier');
            // Json reponse setting non existing packages
            res.status(401).json({
                message: 'Not found getDetailCarrier',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error getDetailCarrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method to agree carriers
export async function agreeCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint to agree carrier packages');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I find if exist package
        const getDetailCarrier = await Carrier.findOne({
            where: {
                id_carrier
            },
            attributes: ['id_carrier', 'name_carrier', 'last_name_carrier']
        });
        // I validate exist getDetailCarrier
        if (getDetailCarrier) {
            getDetailCarrier.set({
                status_carrier: 1
            });
            getDetailCarrier.save();
            // logger control proccess
            logger.info('To agree carrier successfuly');
            // Json reponse setting
            res.json({
                message: 'To agree carrier successfuly',
                result: 1,
                data: getDetailCarrier
            });
        } else {
            // logger control proccess
            logger.info('Not found to agree carrier');
            // Json reponse setting non existing packages
            res.status(401).json({
                message: 'Not found to agree carrier',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error to agree carrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method to reject carriers
export async function rejectCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint to reject carrier packages');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I find if exist package
        const getDetailCarrier = await Carrier.findOne({
            where: {
                id_carrier
            },
            attributes: ['id_carrier', 'name_carrier', 'last_name_carrier']
        });
        // I validate exist getDetailCarrier
        if (getDetailCarrier) {
            getDetailCarrier.set({
                rejected_carrier: 1
            });
            getDetailCarrier.save();
            // logger control proccess
            logger.info('To reject carrier successfuly');
            // Json reponse setting
            res.json({
                message: 'To reject carrier successfuly',
                result: 1,
                data: getDetailCarrier
            });
        } else {
            // logger control proccess
            logger.info('Not found to reject carrier');
            // Json reponse setting non existing packages
            res.status(401).json({
                message: 'Not found to reject carrier',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error to reject carrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get Carriers
export async function getCarriers(req, res) {
    // logger control proccess
    logger.info('enter the endpoint get getCarriers');
    try {
        // I find if exist package
        const getCarriers = await Carrier.findAll({
            where: {
                status_carrier: 1,
            },
            attributes: ['id_carrier', 'status_carrier', 'name_carrier', 'revenue_carrier', 'debt_carrier', 'url_QR_carrier', 'bancolombia_number_account_carrier', 'nequi_carrier', 'daviplata_carrier'],
            include: [
                {
                    model: Type_carrier,
                    attributes: ['id_tc', 'description_tc']
                }
            ]
        });
        // I validate exist getCarriers
        if (getCarriers.length > 0) {
            // logger control proccess
            logger.info('getCarriers successfuly');
            // Json reponse setting
            res.json({
                message: 'getCarriers successfuly',
                result: 1,
                data: getCarriers
            });
        } else {
            // logger control proccess
            logger.info('Not found getCarriers');
            // Json reponse setting non existing packages
            res.status(401).json({
                message: 'Not found getCarriers',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error getCarriers: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get details carrier
export async function detailCarrierAndHistory(req, res) {
    // logger control proccess
    logger.info('enter the endpoint detailCarrierAndHistory');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I find carrier
        const getDetailCarrier = await Carrier.findAll({
            where: {
                id_carrier
            },
            attributes: ['id_carrier', 'status_carrier', 'rejected_carrier', 'name_carrier', 'revenue_carrier', 'debt_carrier', 'url_QR_carrier', 'bancolombia_number_account_carrier', 'nequi_carrier', 'daviplata_carrier'],
            include: [
                {
                    model: Type_carrier,
                    attributes: ['id_tc', 'description_tc']
                },
                {
                    model: Carrier_document
                },
                {
                    model: Vehicle,
                    include: [
                        {
                            model: Vehicle_document
                        }
                    ]
                }
            ]
        });
        // I validate exist getDetailCarrier
        if (getDetailCarrier.length > 0) {
            // I find carrier
            const getHistory = await Status_history.findAll({
                where: {
                    fk_id_carrier_asignated_sh: id_carrier
                },
                attributes: ['id_sh', 'status_sh', 'comentary_sh', 'evidence_sh', 'details_sh', 'fk_id_carrier_asignated_sh', 'fk_id_p_sh'],
                include: [
                    {
                        model: Package,
                        attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'direction_client_p', 'guide_number_p', 'status_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'confirmation_dropshipper_p', 'fk_id_tp_p', 'fk_id_carrier_p']
                    },
                ]
            });
            // logger control proccess
            logger.info('getDetailCarrier successfuly');
            // Json reponse setting
            res.json({
                message: 'getDetailCarrier successfuly',
                result: 1,
                data: getDetailCarrier,
                data_history: getHistory
            });
        } else {
            // logger control proccess
            logger.info('Not found getDetailCarrier');
            // Json reponse setting non existing packages
            res.status(401).json({
                message: 'Not found getDetailCarrier',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error getDetailCarrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method edit carrier
export async function editCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint edit carrier');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.params;
        //const { orden_p, name_client_p, phone_number_client_p, email_client_p, direction_client_p, guide_number_p, status_p, with_collection_p, createdAt, fk_id_store_p, fk_id_carrier_p, fk_id_tp_p, fk_id_destiny_city_p } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I find if exist package by 
        const getCarrier = await Carrier.findOne({
            where: {
                id_carrier
            }
        });
        // I validate exist info and infoStorePackage
        if (getCarrier) {
            getCarrier.set(req.body);
            getCarrier.save()
            // logger control proccess
            logger.info('edit carrier successfuly');
            // The credentials are incorrect
            res.json({
                message: 'edit carrier successfuly',
                result: 1,
                getCarrier
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
        logger.info('Error edit package: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method deleteCarrier
export async function deleteCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint delete carrier');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I find if exist package
        const deleteCarrier = await Carrier.destroy({
            where: {
                id_carrier
            }
        });
        if (deleteCarrier) {
            // logger control proccess
            logger.info('Delete carrier successfuly');
            // The credentials are incorrect
            res.json({
                message: 'Delete carrier successfuly',
                result: 1,
            });
        } else {
            // logger control proccess
            logger.info('Not found carrier');
            // Json reponse setting non existing packages
            res.status(401).json({
                message: 'Not found carrier',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error delete carrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method deleteCarrier
export async function deleteHistory(req, res) {
    // logger control proccess
    logger.info('enter the endpoint delete history');
    try {
        // capture the id that comes in the parameters of the req
        const { id_sh } = req.body;
        // I validate req correct json
        if (!id_sh) return res.sendStatus(400);
        // I find if exist package
        const deleteHistory = await Status_history.destroy({
            where: {
                id_sh
            }
        });
        if (deleteHistory) {
            // logger control proccess
            logger.info('Delete history successfuly');
            // The credentials are incorrect
            res.json({
                message: 'Delete history successfuly',
                result: 1,
            });
        } else {
            // logger control proccess
            logger.info('Not found history');
            // Json reponse setting non existing packages
            res.status(401).json({
                message: 'Not found history',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error delete history: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get type Carriers
export async function getTypeCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint getTypeCarrier');
    try {
        // I find if exist package
        const getTypeCarrier = await Type_carrier.findAll({
            attributes: ['id_tc', 'description_tc']
        });
        // I validate exist getTypeCarrier
        if (getTypeCarrier.length > 0) {
            // logger control proccess
            logger.info('getTypeCarrier successfuly');
            // Json reponse setting
            res.json({
                message: 'getTypeCarrier successfuly',
                result: 1,
                data: getTypeCarrier
            });
        } else {
            // logger control proccess
            logger.info('Not found getTypeCarrier');
            // Json reponse setting non existing packages
            res.status(401).json({
                message: 'Not found getTypeCarrier',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error getTypeCarrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get typer package
export async function getTypePackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint getTypePackage');
    try {
        // I find if exist package
        const getTypePackage = await Type_package.findAll({
            attributes: ['id_tp', 'description_tp']
        });
        // I validate exist getTypePackage
        if (getTypePackage.length > 0) {
            // logger control proccess
            logger.info('getTypePackage successfuly');
            // Json reponse setting
            res.json({
                message: 'getTypePackage successfuly',
                result: 1,
                data: getTypePackage
            });
        } else {
            // logger control proccess
            logger.info('Not found getTypePackage');
            // Json reponse setting non existing packages
            res.status(401).json({
                message: 'Not found getTypePackage',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error getTypePackage: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get payments request carrier
export async function getPaymentsRequestCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint getPaymentsRequestCarrier');
    try {
        // I find if exist package
        // 1. payment made 2. Pending
        const getPaymentsRequestCarrier = await Carrier_payment_request.findAll({
            where: {
                status_cpr: 2
            },
            attributes: ['id_cpr', 'quantity_requested_cpr', 'status_cpr', 'createdAt', 'fk_id_cba_cpr'],
            include: [
                {
                    model: Carrier_bank_account,
                    include: [
                        {
                            model: Carrier,
                            attributes: ['id_carrier', 'status_carrier', 'name_carrier', 'revenue_carrier', 'debt_carrier', 'url_QR_carrier', 'bancolombia_number_account_carrier', 'nequi_carrier', 'daviplata_carrier']
                        }
                    ]
                }
            ]
        });
        // logger control proccess
        logger.info('getPaymentsRequestCarrier successfuly');
        // Json reponse setting
        res.json({
            message: 'getPaymentsRequestCarrier successfuly',
            result: 1,
            data: getPaymentsRequestCarrier
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error getPaymentsRequestCarrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get payments request carrier
export async function detailPaymentRequestCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint getPaymentsRequestCarrier');
    try {
        // capture the id that comes in the parameters of the req
        const { id_cpr } = req.body;
        // I validate req correct json
        if (!id_cpr) return res.sendStatus(400);
        // I find if exist package
        const getPaymentsRequestCarrier = await Carrier_payment_request.findAll({
            where: {
                id_cpr
            },
            attributes: ['id_cpr', 'quantity_requested_cpr', 'status_cpr', 'createdAt', 'fk_id_cba_cpr'],
            include: [
                {
                    model: Carrier_bank_account,
                    include: [
                        {
                            model: Carrier,
                            attributes: ['id_carrier', 'status_carrier', 'name_carrier', 'revenue_carrier', 'debt_carrier', 'url_QR_carrier', 'bancolombia_number_account_carrier', 'nequi_carrier', 'daviplata_carrier']
                        }
                    ]
                }
            ]
        });
        const id_carrier = getPaymentsRequestCarrier[0].carrier_bank_account.carrier.id_carrier;
        // I find carrier
        const getHistory = await Status_history.findAll({
            where: {
                fk_id_carrier_asignated_sh: id_carrier
            },
            attributes: ['id_sh', 'status_sh', 'comentary_sh', 'evidence_sh', 'details_sh', 'fk_id_carrier_asignated_sh', 'fk_id_p_sh'],
            include: [
                {
                    model: Package,
                    attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'direction_client_p', 'guide_number_p', 'status_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'confirmation_dropshipper_p', 'fk_id_tp_p', 'fk_id_carrier_p']
                },
            ]
        });
        // logger control proccess
        logger.info('getPaymentsRequestCarrier successfuly');
        // Json reponse setting
        res.json({
            message: 'getPaymentsRequestCarrier successfuly',
            result: 1,
            data: getPaymentsRequestCarrier,
            data_history: getHistory
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error getPaymentsRequestCarrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method to pay carrier
export async function toPayCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint to pay carrier');
    try {
        // capture the id that comes in the parameters of the req
        const { id_cpr } = req.body;
        // I validate req correct json
        if (!id_cpr) return res.sendStatus(400);
        // I find if exist package by 
        const getPaymentsRequestCarrier = await Carrier_payment_request.findOne({
            where: {
                id_cpr
            },
            attributes: ['id_cpr', 'quantity_requested_cpr', 'status_cpr', 'fk_id_cba_cpr'],
            include: [
                {
                    model: Carrier_bank_account,
                    attributes: ['fk_id_carrier_cba']
                }
            ]
        });
        // I validate exist getPaymentsRequestCarrier
        if (getPaymentsRequestCarrier) {
            // Capture id carrier
            const id_carrier = getPaymentsRequestCarrier.carrier_bank_account.fk_id_carrier_cba;
            const quantity_requested_cpr = getPaymentsRequestCarrier.quantity_requested_cpr;
            // I find carrier
            const getCarrier = await Carrier.findOne({
                where: {
                    id_carrier
                },
                attributes: ['id_carrier', 'revenue_carrier']
            });
            if (getCarrier.revenue_carrier >= quantity_requested_cpr) {
                // Setting and save new revenue carrier
                getCarrier.set({
                    revenue_carrier: getCarrier.revenue_carrier - quantity_requested_cpr
                });
                getCarrier.save();
                // Setting and save status cpr
                // 1. payment made 2. Pending
                getPaymentsRequestCarrier.set({
                    status_cpr: 1
                });
                getPaymentsRequestCarrier.save();
                const postPortfolioCarrier = Portfolio_history_carrier.create({
                    type_phc: "Pago al transportista",
                    Quantity_pay_phc: quantity_requested_cpr,
                    description_phc: "Pago al transportista",
                    fk_id_carrier_phc: id_carrier
                })
                // logger control proccess
                logger.info('To pay carrier successfuly');
                // The credentials are incorrect
                res.json({
                    message: 'To pay carrier successfuly',
                    result: 1
                });
            } else {
                // logger control proccess
                logger.info('Quantity requested invalidated');
                // The credentials are incorrect
                res.status(401).json({
                    message: 'Quantity requested invalidated',
                    result: 0
                });
            }
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
        logger.info('Error To pay package: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}