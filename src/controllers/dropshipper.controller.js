// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import ExcelJS from 'exceljs';
import { Sequelize } from "sequelize";
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
                    exp: Date.now() + 60 * 1000 * 60
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
                    model: Package,
                    attributes: ['id_p', 'orden_p', 'status_p', 'fk_id_tp_p'],
                }
            ]
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (infoDropshipper.length > 0 && infoStorePackage.length > 0) {
            const total_stores_drop = infoStorePackage.length;
            let total_packages_drop = 0;
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
                        // Add variable i need
                        total_cuantity_cityPackages++;
                        // Condition structure status packages
                        // 1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino 5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a bodega central
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
                    } else if (pkg.status_p === 2) {
                        // Add variable i need
                        total_cuantity_intercityPackages++;
                        // Condition structure status packages
                        // 1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino 5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a bodega central
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
                    intercityPackage_inWayCentralStoreOrigin
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
                    model: Package,
                    attributes: ['id_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'direction_client_p', 'guide_number_p', 'status_p', 'profit_dropshipper_p', 'with_collection_p', 'total_price_p', 'confirmation_dropshipper_p', 'fk_id_tp_p', 'fk_id_carrier_p'],
                }
            ]
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (infoStorePackage.length > 0) {
            // Process data for JSON response
            const getPackages = infoStorePackage.flatMap(p => p.packages);
            // logger control proccess
            logger.info('Getpackages Dropshipper successfuly');
            // Json setting response
            res.json({
                message: 'Getpackages Dropshipper successfuly',
                result: 1,
                data: getPackages
            });
        } else {
            // logger control proccess
            logger.info('Not found packages');
            // Json response non existing packages
            res.status(401).json({
                message: 'Not found packages',
                result: 1
            });
        }
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
                }
            ]
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (infoStorePackage.length > 0) {
            // Process data for JSON response
            const getPackages = infoStorePackage.flatMap(p => p.packages);
            // logger control proccess
            logger.info('filterByDate Dropshipper successfuly');
            // The credentials are incorrect
            res.json({
                message: 'filterByDate Dropshipper successfuly',
                result: 1,
                data: getPackages
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
                            statusText = "Bodega dropshipper";
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
                            statusText = "En camino de bodega dropshipper a bodega central";
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
        const { id_p, confirmation_dropshipper_p } = req.body;
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
                confirmation_dropshipper_p
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
    logger.info('enter the endpoint detailPackage dropshipper');
    try {
        // capture the id that comes in the parameters of the req
        const { id_p } = req.body;
        // I validate req correct json
        if (!id_p) return res.sendStatus(400);
        // I find if exist package by dropshipper
        const getPackage = await Package.destroy({
            where: {
                id_p
            }
        });
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
            attributes: ['number_dba', 'type_dba', 'bank_dba', 'description_dba', 'fk_id_dropshipper_dba'],
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
            status_cpr: 3,
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

// Method editPackage dropshipper
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
            attributes: ['id_dpr', 'status_dpr', 'verification_pin_request']
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (getPayment) {
            if (getPayment.verification_pin_request === verification_pin_request) {
                getPayment.set({
                    status_dpr: 2
                });
                getPayment.save();
                // logger control proccess
                logger.info('ValidateVerificationPin Dropshipper successfuly');
                // The credentials are incorrect
                res.json({
                    message: 'ValidateVerificationPin Dropshipper successfuly',
                    result: 1,
                    getPayment
                });
            } else {
                // The credentials are incorrect
                res.json({
                    message: 'Verification PIN incorrect!',
                    result: 0,
                    getPayment
                });
            }
        } else {
            // logger control proccess
            logger.info('Not found payment resquest');
            // The credentials are incorrect
            res.status(401).json({
                message: 'Not found payment resquest',
                result: 1
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error validateVerificationPin: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            result: 0,
            data: {}
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
            }
        });
        // I validate exist  infoDropshipper and infoStorePackage
        if (getPortfolio.length > 0) {
            // logger control proccess
            logger.info('getPortfolio Dropshipper successfuly');
            // The credentials are incorrect
            res.json({
                message: 'getPortfolio Dropshipper successfuly',
                result: 1,
                data: getPortfolio
            });
        } else {
            // logger control proccess
            logger.info('Not found getPortfolio');
            // The credentials are incorrect
            res.status(401).json({
                message: 'Not found getPortfolio',
                result: 1
            });
        }
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
                fk_id_dropshipper_phd: id_dropshipper
            }
        });
        // I validate exist  infoDropshipper and infoPortfolio
        if (infoPortfolio.length > 0) {
            let dataForExcel = [];
            // Process data for JSON response
            const getPortfolios = infoPortfolio.map(p => {
                dataForExcel.push({ id_phd: p.id_phd, type_phd: p.type_phd, monto_phd: p.monto_phd, description_phd: p.description_phd, createdAt: p.createdAt, fk_id_dropshipper_phd: p.fk_id_dropshipper_phd });
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
                { header: 'Dropshipper', key: 'fk_id_dropshipper_phd', width: 30 }
            ];

            // Agregando los datos a la hoja
            dataForExcel.forEach(item => {
                worksheet.addRow(item);
            });

            // Configuración de los headers para descargar el archivo
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="reporte_historial_cartera.xlsx"');

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