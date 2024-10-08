// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import { Sequelize, Op } from "sequelize";
// import personaly models
import { Dropshipper } from '../models/dropshippers.model.js';
import { Package } from "../models/packages.model.js";
import { PackageProduct } from "../models/packages_products.model.js";
import { Product } from "../models/products.model.js";
import { Store } from "../models/stores.model.js";
import { Status_history } from "../models/status_history.model.js";
import { Carrier } from "../models/carriers.model.js";
import { Type_package } from "../models/types_package.model.js";
import { City } from "../models/cities.model.js";
import { Central_warehouse } from "../models/central_warehouses.model.js";
import { Department } from "../models/departments.model.js";
import { Dropshipper_bank_account } from "../models/dropshipper_bank_accounts.model.js";
import { Dropshipper_payment_request } from "../models/dropshipper_payment_requests.model.js";
import { Portfolios_history_dropshipper } from "../models/portfolio_history_dropshipper.model.js";
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
        const { email_dropshipper, password_dropshipper } = req.body;
        // I validate req correct json
        if (!email_dropshipper || !password_dropshipper) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const loginDropshipper = await Dropshipper.findAll({
            where: {
                email_dropshipper,
                password_dropshipper
            },
            attributes: ['id_dropshipper', 'name_dropshipper', 'email_dropshipper', 'status_dropshipper', 'last_login_dropshipper']
        });
        // I validate login exist
        if (loginDropshipper.length > 0) {
            // realiazr la validacion si el usuario esta activado para poder hacer el login
            // 1. activo, 0. desactivado
            if (loginDropshipper[0].status_dropshipper === 1) {
                // Token Payload
                const payload = {
                    id_dropshipper: loginDropshipper[0].id_dropshipper,
                    name_dropshipper: loginDropshipper[0].name_dropshipper,
                    exp: Date.now() + 60 * 1000 * 60 * 4
                };
                // I Create json web token for return him in json response
                const token = jwt.sign(payload, secret);
                // I go through the login data that I obtained and send the lastlogin to be updated
                loginDropshipper.forEach(async loginDropshipper => {
                    await loginDropshipper.update({
                        last_login_dropshipper: formattedTime,
                    });
                });
                // logger control proccess
                logger.info('correct credentials, Started Sesion, token returned in response body data.');
                // The carrier exists and the credentials are correct
                res.json({
                    message: 'Successful login dropshipper',
                    result: 1,
                    token,
                    data: loginDropshipper
                });
            } else {
                // logger control proccess
                logger.info('User Disabled');
                // The credentials are incorrect
                res.status(401).json({
                    message: 'User Disabled',
                    result: 0,
                    status_dropshipper: loginDropshipper[0].status_dropshipper
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

// Method master dropshipper
export async function master(req, res) {
    // logger control proccess
    logger.info('enter the endpoint master dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_dropshipper } = req.body;
        // I validate req correct json
        if (!id_dropshipper) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const infoDropshipper = await Dropshipper.findAll({
            where: {
                id_dropshipper
            },
            attributes: ['id_dropshipper', 'status_dropshipper', 'name_dropshipper', 'last_name_dropshipper', 'phone_number_dropshipper', 'email_dropshipper', 'wallet_dropshipper', 'total_sales_dropshipper', 'last_login_dropshipper'],
        });
        // I find if exist package by dropshipper
        const infoStorePackage = await Store.findAll({
            where: {
                fk_id_dropshipper_store: id_dropshipper
            },
            attributes: ['id_store', 'direction_store', 'phone_number_store', 'capacity_store', 'fk_id_city_store', 'fk_id_dropshipper_store'],
            include: [
                {
                    model: City,
                    attributes: ['id_city', 'name_city'],
                    include: [
                        {
                            model: Department,
                            attributes: ['id_d', 'name_d']
                        }
                    ]
                },
                {
                    model: Package,
                    attributes: ['id_p', 'orden_p', 'status_p', 'fk_id_tp_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'phone_number_client_p', 'direction_client_p', 'guide_number_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'createdAt'],
                }
            ]
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (infoDropshipper.length > 0 && infoStorePackage.length > 0) {
            const total_stores_drop = infoStorePackage.length;
            let total_packages_drop = 0;
            let total_city_package = 0;
            let total_intercity_package = 0;
            // Process data for JSON response
            const masterPackages = infoStorePackage.map(p => {
                // I declarate variables i need, stadystics packages
                let total_cuantity_packages = p.packages.length;
                // Variables contability
                let total_cuantity_cityPackages = 0;
                let cityPackage_inStoreDrop = 0;
                let cityPackage_inCentralStore = 0;
                let cityPackage_inWayClient = 0;
                let cityPackage_Delived = 0;
                let cityPackage_inWayCentralStore = 0;
                let total_cuantity_intercityPackages = 0;
                let intercityPackage_inStoreDrop = 0;
                let intercityPackage_inCentralStoreOrigin = 0;
                let intercityPackage_inWayCetralsStores = 0;
                let intercityPackage_inCentralStoreDestine = 0;
                let intercityPackage_inWayClient = 0;
                let intercityPackage_delived = 0;
                let intercityPackage_inWayCentralStoreOrigin = 0;
                // I run package by store
                p.packages.forEach(pkg => {
                    // Add 1 by package by dropshipper
                    total_packages_drop++;
                    // Condition city package or inter city package
                    if (pkg.fk_id_tp_p === 1) {
                        total_city_package++;
                        // Add variable i need
                        total_cuantity_cityPackages++;
                        // Condition structure status packages
                        // 1.Bodega Comercio 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino 5.En camino a entrega final 6. Entregado 7. En camino de bodega Comercio a bodega central
                        if (pkg.status_p === 1) {
                            cityPackage_inStoreDrop++;
                        } else if (pkg.status_p == 4) {
                            cityPackage_inCentralStore++;
                        } else if (pkg.status_p == 5) {
                            cityPackage_inWayClient++;
                        } else if (pkg.status_p == 6) {
                            cityPackage_Delived++;
                        } else if (pkg.status_p == 7) {
                            cityPackage_inWayCentralStore++;
                        }
                    } else if (pkg.fk_id_tp_p === 2) {
                        total_intercity_package++;
                        // Add variable i need
                        total_cuantity_intercityPackages++;
                        // Condition structure status packages
                        // 1.Bodega Comercio 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino 5.En camino a entrega final 6. Entregado 7. En camino de bodega Comercio a bodega central
                        if (pkg.status_p === 1) {
                            intercityPackage_inStoreDrop++;
                        } else if (pkg.status_p == 2) {
                            intercityPackage_inCentralStoreOrigin++;
                        } else if (pkg.status_p == 3) {
                            intercityPackage_inWayCetralsStores++;
                        } else if (pkg.status_p == 4) {
                            intercityPackage_inCentralStoreDestine++;
                        } else if (pkg.status_p == 5) {
                            intercityPackage_inWayClient++;
                        } else if (pkg.status_p == 6) {
                            intercityPackage_delived++;
                        } else if (pkg.status_p == 7) {
                            intercityPackage_inWayCentralStoreOrigin++;
                        }
                    }
                });
                // Definate response orden fine JSON
                return {
                    id_store: p.id_store,
                    direction_store: p.direction_store,
                    city_store: p.city.name_city,
                    department_store: p.city.department.name_d,
                    total_cuantity_packages,
                    total_cuantity_cityPackages,
                    cityPackage_inStoreDrop,
                    cityPackage_inCentralStore,
                    cityPackage_inWayClient,
                    cityPackage_Delived,
                    cityPackage_inWayCentralStore,
                    total_cuantity_intercityPackages,
                    intercityPackage_inStoreDrop,
                    intercityPackage_inCentralStoreOrigin,
                    intercityPackage_inWayCetralsStores,
                    intercityPackage_inCentralStoreDestine,
                    intercityPackage_inWayClient,
                    intercityPackage_delived,
                    intercityPackage_inWayCentralStoreOrigin,
                    pkg: p.packages
                };
            });
            // Declarate objet info dropshipper
            const masterDropshipper = {
                id_dropshipper: infoDropshipper[0].id_dropshipper,
                status_dropshipper: infoDropshipper[0].status_dropshipper,
                name_dropshipper: infoDropshipper[0].name_dropshipper,
                last_name_dropshipper: infoDropshipper[0].last_name_dropshipper,
                wallet_dropshipper: infoDropshipper[0].wallet_dropshipper,
                total_sales_dropshipper: infoDropshipper[0].total_sales_dropshipper,
                last_login_dropshipper: infoDropshipper[0].last_login_dropshipper,
                total_stores_drop,
                total_packages_drop,
                total_city_package,
                total_intercity_package,
            }
            // logger control proccess
            logger.info('Master Dropshipper successfuly');
            // The credentials are incorrect
            res.json({
                message: 'Master Dropshipper successfuly',
                result: 1,
                data: masterDropshipper,
                data_by_store: masterPackages
            });
        } else {
            // logger control proccess
            logger.info('Non-existent dropshipper or not found packages');
            // The credentials are incorrect
            res.status(401).json({
                message: 'Non-existent dropshipper or not found packages',
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

// Method getpackages dropshipper
export async function getpackages(req, res) {
    // logger control proccess
    logger.info('enter the endpoint getpackages dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_dropshipper } = req.body;
        // I validate req correct json
        if (!id_dropshipper) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const infoStorePackage = await Store.findAll({
            where: {
                fk_id_dropshipper_store: id_dropshipper
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
                name_client_p: p.name_client_p,
                address_client_p: p.direction_client_p,
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

// Method filterByDate dropshipper
export async function filterByDate(req, res) {
    // logger control proccess
    logger.info('enter the endpoint filterByDate dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_dropshipper, startDate, endDate } = req.body;
        // I validate req correct json
        if (!id_dropshipper) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const infoStorePackage = await Store.findAll({
            where: {
                fk_id_dropshipper_store: id_dropshipper
            },
            attributes: ['id_store'],
            include: [
                {
                    model: Package,
                    where: {
                        createdAt: {
                            [Sequelize.Op.between]: [startDate, endDate]
                        }
                    },
                    attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'direction_client_p', 'guide_number_p', 'status_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'confirmation_dropshipper_p', 'createdAt', 'fk_id_tp_p', 'fk_id_carrier_p'],
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
        // I validate exist  infoDropshipper and infoStorePackage
        if (infoStorePackage.length > 0) {
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
            logger.info('filterByDate Dropshipper successfuly');
            // The credentials are incorrect
            res.json({
                message: 'filterByDate Dropshipper successfuly',
                result: 1,
                data: packages
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
        logger.info('Error filterByDate: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method downloadExcelpackagesDate dropshipper
export async function downloadExcelpackagesDate(req, res) {
    // logger control proccess
    logger.info('enter the endpoint downloadExcelpackagesDate dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_dropshipper, startDate, endDate } = req.body;
        // I validate req correct json
        if (!id_dropshipper) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const infoStorePackage = await Store.findAll({
            where: {
                fk_id_dropshipper_store: id_dropshipper
            },
            attributes: ['id_store'],
            include: [
                {
                    model: Package,
                    where: {
                        createdAt: {
                            [Sequelize.Op.between]: [startDate, endDate]
                        }
                    },
                    attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'direction_client_p', 'guide_number_p', 'status_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'confirmation_dropshipper_p', 'createdAt', 'fk_id_tp_p', 'fk_id_carrier_p'],
                }
            ]
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (infoStorePackage.length > 0) {
            let dataForExcel = [];
            // Process data for JSON response
            const getPackages = infoStorePackage.map(p => {
                p.packages.forEach(e => {
                    // 
                    let statusText;
                    switch (e.status_p) {
                        case 1:
                            statusText = "Bodega Comercio";
                            break;
                        case 2:
                            statusText = "Bodega central origen";
                            break;
                        case 3:
                            statusText = "En camino entre bodegas centrales";
                            break;
                        case 4:
                            statusText = "En bodega central destino";
                            break;
                        case 5:
                            statusText = "En camino a entrega final";
                            break;
                        case 6:
                            statusText = "Entregado";
                            break;
                        case 7:
                            statusText = "En camino de bodega Comercio a bodega central";
                            break;
                    }
                    dataForExcel.push({ id_p: e.id_p, orden_p: e.orden_p, name_client_p: e.name_client_p, phone_number_client_p: e.phone_number_client_p, email_client_p: e.email_client_p, direction_client_p: e.direction_client_p, guide_number_p: e.guide_number_p, status_p: statusText, profit_dropshipper_p: e.profit_dropshipper_p, with_collection_p: e.with_collection_p, total_price_p: e.total_price_p, confirmation_dropshipper_p: e.confirmation_dropshipper_p, createdAt: e.createdAt, fk_id_tp_p: e.fk_id_tp_p, fk_id_carrier_p: e.fk_id_carrier_p });
                })
            });
            // Creación de un libro y una hoja de Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Mis Datos');

            // Definición de las columnas
            worksheet.columns = [
                { header: 'ID', key: 'id_p', width: 10 },
                { header: '# Orden', key: 'orden_p', width: 20 },
                { header: 'Nombre Cliente', key: 'name_client_p', width: 30 },
                { header: 'Teléfono cliente Cliente', key: 'phone_number_client_p', width: 30 },
                { header: 'Email Cliente', key: 'email_client_p', width: 30 },
                { header: 'Dirección Entrega Cliente', key: 'direction_client_p', width: 30 },
                { header: 'Número Guía', key: 'guide_number_p', width: 30 },
                { header: 'Estado', key: 'status_p', width: 30 },
                { header: 'Ganancia Dropshipper', key: 'profit_dropshipper_p', width: 30 },
                { header: 'Con Recaudo', key: 'with_collection_p', width: 30 },
                { header: 'Confirmación Dropshipper', key: 'confirmation_dropshipper_p', width: 30 },
                { header: 'Fecha Creación', key: 'createdAt', width: 30 },
                { header: 'Tipo Paquete', key: 'fk_id_tp_p', width: 30 },
                { header: 'Transportista Actual', key: 'fk_id_carrier_p', width: 30 },
            ];

            // Agregando los datos a la hoja
            dataForExcel.forEach(item => {
                worksheet.addRow(item);
            });

            // Configuración de los headers para descargar el archivo
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="reporte_paquetes.xlsx"');

            // Escribir y enviar el archivo
            await workbook.xlsx.write(res);
            // logger control proccess
            logger.info('downloadExcelpackagesDate Dropshipper successfuly');
            res.end();
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
        logger.info('Error downloadExcelpackagesDate: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method corfirmatePackage dropshipper
export async function corfirmatePackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint confirmate packages dropshipper');
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
            attributes: ['id_p', 'confirmation_dropshipper_p']
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (getPackage) {
            // Set the flag confirmation flag dropshipper pakcges
            getPackage.set({
                confirmation_dropshipper_p: 1
            });
            // .save() for update confirmation dropshipper from package
            await getPackage.save();
            // I validate all ok
            if (!getPackage) {
                // I return the status 500 and the message I want
                res.status(500).json({
                    message: 'Something goes wrong',
                    result: 0
                });
            }
            // logger control proccess
            logger.info('Confirmate packages Dropshipper successfuly');
            // The credentials are incorrect
            res.json({
                message: 'Confirmate packages Dropshipper successfuly',
                result: 1,
                data: getPackage
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
        logger.info('Error confirmate packages Dropshipper: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}

// Method detailPackage dropshipper
export async function detailPackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint detailPackage dropshipper');
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
            attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'direction_client_p', 'guide_number_p', 'status_p', 'profit_carrier_p', 'profit_carrier_inter_city_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'does_shopify_p', 'send_cost_shopify_p', 'send_priority_shopify_p', 'total_price_shopify_p', 'confirmation_dropshipper_p', 'createdAt', 'fk_id_tp_p'],
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
                attributes: ['id_sh', 'status_sh', 'comentary_sh', 'details_sh', 'evidence_sh', 'createdAt'],
                include: [
                    {
                        model: Carrier,
                        attributes: ['id_carrier', 'name_carrier', 'last_name_carrier', 'phone_number_carrier']
                    },
                ],
                order: [['createdAt', 'ASC']]
            });
            // logger control proccess
            logger.info('detailPackage Dropshipper successfuly');
            // The credentials are incorrect
            res.json({
                message: 'detailPackage Dropshipper successfuly',
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

// Method editPackage dropshipper
export async function editPackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint edit package dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_p } = req.params;
        //const { orden_p, name_client_p, phone_number_client_p, email_client_p, direction_client_p, guide_number_p, status_p, with_collection_p, createdAt, fk_id_store_p, fk_id_carrier_p, fk_id_tp_p, fk_id_destiny_city_p } = req.body;
        // I validate req correct json
        if (!id_p) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const getPackage = await Package.findOne({
            where: {
                id_p
            }
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (getPackage) {
            getPackage.set(req.body);
            getPackage.save()
            // logger control proccess
            logger.info('edit package Dropshipper successfuly');
            // The credentials are incorrect
            res.json({
                message: 'edit package Dropshipper successfuly',
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

// Method deletePackage dropshipper
export async function deletePackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint delete package');
    try {
        // capture the id that comes in the parameters of the req
        const { id_p } = req.body;
        // I validate req correct json
        if (!id_p) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const getPackage = await Package.findOne({
            where: {
                id_p
            }
        });
        getPackage.set({
            status_p: 0
        });
        getPackage.save();
        // logger control proccess
        logger.info('delete package Dropshipper successfuly');
        // The credentials are incorrect
        res.json({
            message: 'delete package Dropshipper successfuly',
            result: 1,
        });
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

// Method addBankAccount dropshipper
export async function addBankAccount(req, res) {
    // logger control proccess
    logger.info('enter the endpoint Create bank account dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { number_dba, type_dba, bank_dba, description_dba, fk_id_dropshipper_dba } = req.body;

        // I validate req correct json
        if (!number_dba || !type_dba || !bank_dba || !description_dba || !fk_id_dropshipper_dba) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const newBankAccount = await Dropshipper_bank_account.create(req.body);
        // logger control proccess
        logger.info('Create bank account dropshipper successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Create bank account dropshipper successfuly',
            result: 1,
            newBankAccount
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error Create bank account dropshipper: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method getBankAccount dropshipper
export async function getBankAccount(req, res) {
    // logger control proccess
    logger.info('enter the endpoint getBankAccount dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_dropshipper } = req.body;
        // I validate req correct json
        if (!id_dropshipper) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const getBankAccount = await Dropshipper_bank_account.findAll({
            where: {
                fk_id_dropshipper_dba: id_dropshipper
            },
            attributes: ['id_dba', 'number_dba', 'type_dba', 'bank_dba', 'description_dba', 'fk_id_dropshipper_dba'],
        });
        // I validate exist  infoDropshipper and getBankAccount
        if (getBankAccount.length > 0) {
            // logger control proccess
            logger.info('getBankAccount Dropshipper successfuly');
            // The credentials are incorrect
            res.json({
                message: 'getBankAccount Dropshipper successfuly',
                result: 1,
                data: getBankAccount
            });
        } else {
            // logger control proccess
            logger.info('Not found getBankAccount');
            // The credentials are incorrect
            res.status(401).json({
                message: 'Not found getBankAccount',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error getBankAccount: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method deleteBankAccount dropshipper
export async function deleteBankAccount(req, res) {
    // logger control proccess
    logger.info('enter the endpoint deleteBankAccount dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_dba } = req.body;
        // I validate req correct json
        if (!id_dba) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const deleteBankAccount = await Dropshipper_bank_account.destroy({
            where: {
                id_dba
            }
        });
        // logger control proccess
        logger.info('Delete deleteBankAccount Dropshipper successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Delete deleteBankAccount Dropshipper successfuly',
            result: 1,
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error Delete deleteBankAccount: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method addPaymentRequest dropshipper
export async function addPaymentRequest(req, res) {
    // logger control proccess
    logger.info('enter the endpoint addPaymentRequest dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { quantity_requested_dpr, fk_id_dba_drp } = req.body;
        // I validate req correct json
        if (!quantity_requested_dpr || !fk_id_dba_drp) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const getDropshipper = await Dropshipper_bank_account.findAll({
            where: {
                id_dba: fk_id_dba_drp
            },
            include: [
                {
                    model: Dropshipper,
                    attributes: ['id_dropshipper', 'wallet_dropshipper'],
                }
            ],
            attributes: ['id_dba', 'fk_id_dropshipper_dba']
        });
        // I validate login exist
        if (getDropshipper.length > 0) {
            if (getDropshipper[0].dropshipper.wallet_dropshipper >= quantity_requested_dpr && quantity_requested_dpr > 0) {
                // I find if exist package by dropshipper
                const newPaymentRequest = await Dropshipper_payment_request.create(req.body);
                // I generate number ramdom 
                const min = 100000;
                const max = 999999;
                const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                /* 
                    Here Code SMS or email that to send verification pin
                */
                // To update flag payment request verification pin request
                // 0. rejected 1. accepted 2. pending 3. pin verification
                newPaymentRequest.set({
                    status_dpr: 3,
                    verification_pin_request: randomNumber
                })
                newPaymentRequest.save();
                // logger control proccess
                logger.info('AddPaymentRequest dropshipper successfuly');
                // The credentials are incorrect
                res.json({
                    message: 'AddPaymentRequest dropshipper successfuly',
                    result: 1,
                    newPaymentRequest
                });
            } else {
                // logger control proccess
                logger.info('Requesting a value greater than what it has or Requesting a value negative.');
                // I return the status 500 and the message I want
                res.status(200).json({
                    message: 'Requesting a value greater than what it has or Requesting a value negative.',
                    result: 5
                });
            }
        } else {
            // I return the status 500 and the message I want
            res.status(404).json({
                message: 'The dropshipper non-existing',
                result: 404
            });
        }

    } catch (e) {
        // logger control proccess
        logger.info('Error AddPaymentRequest dropshipper: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method editPackage getDropshipper
export async function validateVerificationPin(req, res) {
    // logger control proccess
    logger.info('enter the endpoint validateVerificationPin dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_dpr, verification_pin_request } = req.body;
        //const { orden_p, name_client_p, phone_number_client_p, email_client_p, direction_client_p, guide_number_p, status_p, with_collection_p, createdAt, fk_id_store_p, fk_id_carrier_p, fk_id_tp_p, fk_id_destiny_city_p } = req.body;
        // I validate req correct json
        if (!id_dpr || !verification_pin_request) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const getPayment = await Dropshipper_payment_request.findOne({
            where: {
                id_dpr
            },
            attributes: ['id_dpr', 'status_dpr', 'verification_pin_request', 'quantity_requested_dpr'],
            include: [
                {
                    model: Dropshipper_bank_account,
                    attributes: ['fk_id_dropshipper_dba'],
                    include: [
                        {
                            model: Dropshipper,
                            attributes: ['id_dropshipper', 'wallet_dropshipper'],
                        }
                    ],
                }
            ]
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (getPayment) {
            let quantity_requested_dpr = getPayment.quantity_requested_dpr;
            if (getPayment.dropshipper_bank_account.dropshipper.wallet_dropshipper >= quantity_requested_dpr && quantity_requested_dpr > 0) {
                //I capture variables relevants
                let newBalance = getPayment.dropshipper_bank_account.dropshipper.wallet_dropshipper - getPayment.quantity_requested_dpr;
                let id_dropshipper = getPayment.dropshipper_bank_account.dropshipper.id_dropshipper;
                if (getPayment.verification_pin_request === verification_pin_request) {
                    getPayment.set({
                        status_dpr: 2
                    });
                    getPayment.save();
                    // I find carrier and update revenue carrier
                    let updateBalance = await Dropshipper.findOne({
                        where: {
                            id_dropshipper
                        }
                    });
                    // Valid carrier found!
                    if (updateBalance) {
                        // Setting new balance
                        updateBalance.set({
                            wallet_dropshipper: newBalance
                        });
                        // Save the setting revenue
                        updateBalance.save();
                    }
                    // logger control proccess
                    logger.info('ValidateVerificationPin Dropshipper successfuly');
                    // The credentials are incorrect
                    res.json({
                        message: 'ValidateVerificationPin Dropshipper successfuly',
                        result: 1,
                        newWallet: updateBalance.wallet_dropshipper
                    });
                } else {
                    // logger control proccess
                    logger.info('Requesting a value greater than what it has or Requesting a value negative.');
                    // I return the status 500 and the message I want
                    res.status(200).json({
                        message: 'Requesting a value greater than what it has or Requesting a value negative.',
                        result: 5
                    });
                }
            } else {
                // The credentials are incorrect
                res.json({
                    message: 'Verification PIN incorrect!',
                    result: 0,
                });
            }
        } else {
            // logger control proccess
            logger.info('Not found payment resquest');
            // The credentials are incorrect
            res.status(404).json({
                message: 'Not found payment resquest',
                result: 404
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error validateVerificationPin: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
        });
    }
}

// Method getPortfolio dropshipper
export async function getPortfolio(req, res) {
    // logger control proccess
    logger.info('enter the endpoint getPortfolio dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_dropshipper } = req.body;
        // I validate req correct json
        if (!id_dropshipper) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const getPortfolio = await Portfolios_history_dropshipper.findAll({
            where: {
                fk_id_dropshipper_phd: id_dropshipper
            },
            include: [
                {
                    model: Dropshipper,
                    attributes: ['id_dropshipper', 'status_dropshipper', 'name_dropshipper', 'last_name_dropshipper', 'phone_number_dropshipper', 'email_dropshipper']
                }
            ]
        });
        // logger control proccess
        logger.info('getPortfolio Dropshipper successfuly');
        // The credentials are incorrect
        res.json({
            message: 'getPortfolio Dropshipper successfuly',
            result: 1,
            data: getPortfolio
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error getPorfolio: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method downloadExcelPortfolio dropshipper
export async function downloadExcelPortfolio(req, res) {
    // logger control proccess
    logger.info('enter the endpoint downloadExcelPortfolio dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_dropshipper, startDate, endDate } = req.body;
        // I validate req correct json
        if (!id_dropshipper) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const infoPortfolio = await Portfolios_history_dropshipper.findAll({
            where: {
                fk_id_dropshipper_phd: id_dropshipper,
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: Dropshipper,
                    attributes: ['tipo_documento', 'numero_documento', 'name_dropshipper', 'last_name_dropshipper', 'phone_number_dropshipper', 'email_dropshipper']
                }
            ]
        });
        // I validate exist  infoDropshipper and infoPortfolio
        if (infoPortfolio.length > 0) {
            let dataForExcel = [];
            // Process data for JSON response
            const getPortfolios = infoPortfolio.map(p => {
                dataForExcel.push({ id_phd: p.id_phd, type_phd: p.type_phd, monto_phd: p.monto_phd, description_phd: p.description_phd, createdAt: p.createdAt, tipo_documento: p.dropshipper.tipo_documento, numero_documento: p.dropshipper.numero_documento, name_dropshipper: p.dropshipper.name_dropshipper, last_name_dropshipper: p.dropshipper.last_name_dropshipper, phone_number_dropshipper: p.dropshipper.phone_number_dropshipper, email_dropshipper: p.dropshipper.email_dropshipper });
            });
            // Creación de un libro y una hoja de Excel
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Mis Datos');

            // Definición de las columnas
            worksheet.columns = [
                { header: 'ID', key: 'id_phd', width: 10 },
                { header: 'tipo', key: 'type_phd', width: 20 },
                { header: 'Monto', key: 'monto_phd', width: 30 },
                { header: 'Descripción', key: 'description_phd', width: 30 },
                { header: 'Fecha', key: 'createdAt', width: 30 },
                { header: 'Tipo Documento Dropshipper', key: 'tipo_documento', width: 30 },
                { header: 'Número Documento Dropshipper', key: 'numero_documento', width: 30 },
                { header: 'Nombres Dropshipper', key: 'name_dropshipper', width: 30 },
                { header: 'Apellidos Dropshipper', key: 'last_name_dropshipper', width: 30 },
                { header: 'Teléfono Dropshipper', key: 'phone_number_dropshipper', width: 30 },
                { header: 'Email Dropshipper', key: 'email_dropshipper', width: 30 }
            ];

            // Agregando los datos a la hoja
            dataForExcel.forEach(item => {
                worksheet.addRow(item);
            });

            // Configuración de los headers para descargar el archivo
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="reporte_historial_cartera_dropshipper.xlsx"');

            // Escribir y enviar el archivo
            await workbook.xlsx.write(res);
            // logger control proccess
            logger.info('downloadExcelPortfolio Dropshipper successfuly');
            res.end();
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
        logger.info('Error downloadExcelPortfolio: ' + e);
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
            attributes: ['id_carrier', 'status_carrier', 'number_document_carrier', 'name_carrier', 'last_name_carrier', 'phone_number_carrier', 'email_carrier', 'fk_id_tc_carrier', 'fk_id_city_carrier'],
            where: {
                status_carrier: 1,
                fk_id_tc_carrier: 1,
                fk_id_city_carrier: city
            }
        });
        // logger control proccess
        logger.info('Get carriers successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Get carriers successfuly',
            result: 1,
            data: getCarriers
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

// Method editProductPackage dropshipper
export async function editProductPackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint edit product package cuantity dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_pp } = req.params;
        //const { orden_p, name_client_p, phone_number_client_p, email_client_p, direction_client_p, guide_number_p, status_p, with_collection_p, createdAt, fk_id_store_p, fk_id_carrier_p, fk_id_tp_p, fk_id_destiny_city_p } = req.body;
        // I validate req correct json
        if (!id_pp) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const getPackage = await PackageProduct.findOne({
            where: {
                id_pp
            }
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (getPackage) {
            getPackage.set(req.body);
            getPackage.save()
            // logger control proccess
            logger.info('edit product package cuantity dropshipper successfuly');
            // The credentials are incorrect
            res.json({
                message: 'edit product package cuantity dropshipper successfuly',
                result: 1,
                getPackage
            });
        } else {
            // logger control proccess
            logger.info('Not found edit product package cuantity dropshipper');
            // The credentials are incorrect
            res.status(401).json({
                message: 'Not found edit product package cuantity dropshipper',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error edit product package cuantity dropshipper: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get carriers city
export async function getPayments(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint get payments');
    try {
        // capture the id that comes in the parameters of the req
        const { id_dropshipper } = req.body;
        // I validate req correct json
        if (!id_dropshipper) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const getPayments = await Dropshipper_payment_request.findAll({
            attributes: ['id_dpr', 'quantity_requested_dpr', 'status_dpr', 'verification_pin_request', 'createdAt'],
            include: [
                {
                    model: Dropshipper_bank_account,
                    where: {
                        fk_id_dropshipper_dba: id_dropshipper
                    }
                }
            ]
        });
        // I run payments for build my accept JSON
        const payments = getPayments.map(p => {
            let status = p.status_dpr;
            let statusReal;
            if (status == 1) {
                statusReal = "PAGADA";
            } else if (status == 2) {
                statusReal = "PENDIENTE";
            } else if (status == 3) {
                statusReal = "EN VERIFICACION DE PIN";
            } else if (status == 0) {
                statusReal = "RECHAZADA";
            }
            return {
                id_dpr: p.id_dpr,
                quantity_requested_dpr: p.quantity_requested_dpr,
                statusReal,
                createdAt: p.createdAt,
            }
        })
        // logger control proccess
        logger.info('Get payments request successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Get payments request successfuly',
            result: 1,
            data: payments
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error payments request: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0
        });
    }
}

// Method deletePaymentRequest dropshipper
export async function deletePaymentRequest(req, res) {
    // logger control proccess
    logger.info('enter the endpoint deletePaymentRequest dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_dpr } = req.body;
        // I validate req correct json
        if (!id_dpr) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const deletePaymentRequest = await Dropshipper_payment_request.destroy({
            where: {
                id_dpr
            }
        });
        // logger control proccess
        logger.info('Delete deletePaymentRequest Dropshipper successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Delete deletePaymentRequest Dropshipper successfuly',
            result: 1,
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error Delete deletePaymentRequest: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}

// Method get addPackage
export async function editProductToPackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint addProductToPackage');
    try {
        // capture the id that comes in the parameters of the req
        const { products, fk_id_p_pp } = req.body;
        // I validate req correct json
        if (!products || !fk_id_p_pp) return res.sendStatus(400);
        // I find if exist package
        const findDestroy = await PackageProduct.destroy({
            where: {
                fk_id_p_pp
            }
        });
        // Run files array and update in database
        products.forEach(async item => {
            // I find if exist package
            const addProductToPackage = await PackageProduct.create({
                cuantity_pp: item.cuantity_pp,
                fk_id_p_pp,
                fk_id_product_pp: item.id_producto
            });
        });
        // logger control proccess
        logger.info('addProductToPackage successfuly');
        // Json reponse setting
        res.json({
            message: 'addProductToPackage successfuly',
            result: 1
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error addProductToPackage: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
        });
    }
}
