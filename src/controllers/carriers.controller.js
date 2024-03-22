// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
// import personaly models
import { Carrier } from '../models/carriers.model.js';
import { Carrier_document } from '../models/carrier_documents.model.js';
import { Vehicle } from "../models/vehicles.model.js";
import { Vehicle_document } from "../models/vehicle_documents.model.js";
import { Evidence } from "../models/evidences.model.js";
import { Package } from "../models/packages.model.js";
import { Store } from "../models/stores.model.js";
import { City } from "../models/cities.model.js";
import { Central_warehouse } from "../models/central_warehouses.model.js";
import { Sequelize } from 'sequelize';
import { Department } from "../models/departments.model.js";
import { Status_history } from "../models/status_history.model.js";
// config dot env secret
dotenv.config();
// Firme private secret jwt
const secret = process.env.SECRET;
// capture the exact time in my time zone using the moment-timezone module, I do this capture outside the methods to reuse this variable
const bogotaTime = moment.tz('America/Bogota');
const formattedTime = bogotaTime.format('YYYY-MM-DD HH:mm:ss');

// method to register Carriers
export async function register(req, res) {
    // logger control proccess
    logger.info('enter the endpoint registerProduct');
    // I save the variables that come to me in the request in variables.
    const { number_document_carrier, name_carrier, last_name_carrier, phone_number_carrier, email_carrier, password_carrier, fk_id_city_carrier, fk_id_tc_carrier, fk_id_td_carrier } = req.body;
    // I validate req correct json
    if (!name_carrier || !last_name_carrier || !phone_number_carrier || !email_carrier || !password_carrier) return res.sendStatus(400);
    // I enclose everything in a try catch to control errors
    try {
        // I declare the create method with its respective definition of the object and my Carrier model in a variable taking into account the await
        let newCarrier = await Carrier.create({
            number_document_carrier,
            name_carrier,
            last_name_carrier,
            phone_number_carrier,
            email_carrier,
            password_carrier,
            status_carrier: 5,
            revenue_carrier: 0,
            debt_carrier: 0,
            fk_id_td_carrier,
            fk_id_city_carrier,
            fk_id_tc_carrier
        },
            {
                // I define the variables that I am going to insert into the database so that there are no conflicts with the definition of the id or the number of columns
                fields: ['number_document_carrier', 'name_carrier', 'last_name_carrier', 'phone_number_carrier', 'email_carrier', 'password_carrier', 'status_carrier', 'revenue_carrier', 'debt_carrier', 'fk_id_city_carrier', 'fk_id_tc_carrier', 'fk_id_td_carrier']
            });
        // valid if everything went well in the INSERT
        if (newCarrier) {
            // logger control proccess
            logger.info('Carrier registed successfully');
            // I return the json with the message I want
            return res.json({
                message: 'Carrier registed successfully',
                result: 1,
                data: newCarrier
            });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error registerCarrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// method to loaddocuments Carriers
export async function loadDocumentsCarrier(req, res) {
    // logger control proccess
    logger.info('enter the endpoint registerDocuments carrier');
    try {
        // I validate error file empty
        if (!req.files) return res.status(400).json({ error: 'No file provided' });
        // Extract id_carrier of req.body
        const { id_carrier } = req.body;
        let error = false;
        // Run files array and insert in database the documents
        req.files.forEach(async document => {
            // I declare the create method with its respective definition of the object and my Carrier model in a variable taking into account the await
            let newDocument = await Carrier_document.create({
                url_cd: "documents_carrier/" + document.filename,
                date_created_cd: formattedTime,
                fk_id_carrier_cd: id_carrier
            });
            if (!newDocument) error = true;
        });
        // valid if everything went well in the INSERT
        if (error) {
            // Devolver un JSON con un mensaje de error
            return res.status(400).json({
                message: 'Error load document carrier',
                result: 0
            });
        }
        // update status carrier
        const carrier = await Carrier.findOne({
            where: {
                id_carrier
            }
        });
        carrier.set({
            status_carrier: 4
        });
        await carrier.save();
        // logger control proccess
        logger.info('Carrier documents registed successfully');
        // I return the json with the message I want
        return res.json({
            message: 'Carrier documents registered successfully',
            result: 1,
            data: req.files.map(file => ({
                filename: file.filename,
                mimetype: file.mimetype
            }))
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error registerCarrierDocument: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// method to register vehicle Carriers
export async function registerVehicle(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint registerVehicle carrier with photo');
    try {
        // I validate error file empty
        if (!req.files) return res.status(400).json({ error: 'No photo provided' });
        // Extract id_carrier of req.body
        const { id_carrier, description_vehicle, class_vehicle, plate_vehicle, color_vehicle, brand_vehicle, line_vehicle, model_vehicle, cylinder_capacity_vehicle } = req.body;
        let error = false;
        // I declare the create method with its respective definition of the object and my vehcile model in a variable taking into account the await
        let newVehicle = await Vehicle.create({
            description_vehicle,
            class_vehicle,
            plate_vehicle,
            color_vehicle,
            brand_vehicle,
            line_vehicle,
            model_vehicle,
            cylinder_capacity_vehicle,
            url_image_vehicle: "documents_vehicle_carrier/" + req.files[0].filename,
            date_created_vehicle: formattedTime,
            fk_id_carrier_vehicle: id_carrier
        });
        if (!newVehicle) error = true;

        // valid if everything went well in the INSERT
        if (error) {
            // Devolver un JSON con un mensaje de error
            return res.status(400).json({
                message: 'Error load vehicle by carrier',
                result: 0
            });
        }
        // update status carrier
        const carrier = await Carrier.findOne({
            where: {
                id_carrier
            }
        });
        carrier.set({
            status_carrier: 3
        });
        await carrier.save();
        // logger control proccess
        logger.info('Vehicle registed and carrier asosiation successfully');
        // I return the json with the message I want
        return res.json({
            message: 'Vehicle registed and carrier asosiation successfully',
            result: 1,
            data: newVehicle
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error registerVehiculeCarrier: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// method to load vehicule documents Carriers
export async function loadDocumentsVehicle(req, res) {
    // logger control proccess
    logger.info('Enter the endpoint registerDocuments vehicle');
    try {
        // I validate error file empty
        if (!req.files) return res.status(400).json({ error: 'No file provided' });
        // Extract id_carrier of req.body
        const { id_carrier, id_vehicle } = req.body;
        let error = false;
        // Run files array and insert in database the documents
        req.files.forEach(async document => {
            // I declare the create method with its respective definition of the object and my Carrier model in a variable taking into account the await
            let newDocument = await Vehicle_document.create({
                url_document_vd: "documents_vehicle_carrier/" + document.filename,
                date_created_vd: formattedTime,
                fk_id_vehicle_vd: id_vehicle
            });
            if (!newDocument) error = true;
        });
        // valid if everything went well in the INSERT
        if (error) {
            // Devolver un JSON con un mensaje de error
            return res.status(400).json({
                message: 'Error load document vehicle',
                result: 0
            });
        }
        // update status carrier
        const carrier = await Carrier.findOne({
            where: {
                id_carrier
            }
        });
        carrier.set({
            status_carrier: 2
        });
        await carrier.save();
        // logger control proccess
        logger.info('vehicle documents registed successfully');
        // I return the json with the message I want
        return res.json({
            message: 'vehicle documents registered successfully',
            result: 1,
            data: req.files.map(file => ({
                filename: file.filename,
                mimetype: file.mimetype
            }))
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error registerCarrierDocument: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// Method login Carriers
export async function login(req, res) {
    // logger control proccess
    logger.info('enter the endpoint login');
    try {
        // capture the id that comes in the parameters of the req
        const { email_carrier, password_carrier } = req.body;
        // I validate req correct json
        if (!email_carrier || !password_carrier) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const loginCarrier = await Carrier.findAll({
            where: {
                email_carrier,
                password_carrier
            },
            attributes: ['id_carrier', 'name_carrier', 'email_carrier', 'status_carrier', 'last_login_carrier']
        });
        // I validate login exist
        if (loginCarrier.length > 0) {
            // realiazr la validacion si el usuario esta activado para poder hacer el login
            if (loginCarrier[0].status_carrier === 1) {
                // Token Payload
                const payload = {
                    id_carrier: loginCarrier[0].id_carrier,
                    name_carrier: loginCarrier[0].name_carrier,
                    exp: Date.now() + 60 * 1000 * 60
                };
                // I Create json web token for return him in json response
                const token = jwt.sign(payload, secret);
                // I go through the login data that I obtained and send the lastlogin to be updated
                loginCarrier.forEach(async loginCarrier => {
                    await loginCarrier.update({
                        last_login_carrier: formattedTime,
                    });
                });
                // logger control proccess
                logger.info('correct credentials, Started Sesion, token returned in response body data.');
                // The carrier exists and the credentials are correct
                res.json({
                    message: 'Successful login',
                    result: 1,
                    token,
                    data: loginCarrier
                });
            } else {
                // logger control proccess
                logger.info('User Disabled');
                // The credentials are incorrect
                res.status(401).json({
                    message: 'User Disabled',
                    result: 0,
                    status_carrier: loginCarrier[0].status_carrier
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
            data: {}
        });
    }
}

// Method master Carriers
export async function master(req, res) {
    // logger control proccess
    logger.info('enter the endpoint master');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const carrier_master = await Carrier.findAll({
            where: {
                id_carrier
            },
            attributes: ['id_carrier', 'name_carrier', 'revenue_carrier', 'debt_carrier']
        });
        // I validate login exist
        if (carrier_master.length > 0) {
            // I call and save the result of the findAll method, which is d sequelize
            const carrier_packages = await Package.findAll({
                where: {
                    fk_id_carrier_p: id_carrier,
                    confirmation_carrier_p: 0
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
            // Process data for JSON response
            const formattedDataPackages = carrier_packages.map(p => {
                // I validate type send package and decidate 1. Municipal send, 2. Inter-municipal send
                if (p.fk_id_tp_p == 1) {
                    // Definate response orden fine JSON
                    return {
                        id_p: p.id_p,
                        type_send: p.fk_id_tp_p,
                        status_p: p.status_p,
                        order_number: p.orden_p,
                        date_created_p: p.createdAt,
                        profit_for_carrier: p.profit_carrier_p,
                        total_price_p: p.total_price_p,
                        with_collection_p: p.with_collection_p,
                        name_department: p.store.city.department.name_d,
                        name_city: p.store.city.name_city,
                        address_store: p.store.direction_store,
                        name_central_warehouse: p.store.city.central_warehouses[0].name_cw,
                        address_central_warehouse: p.store.city.central_warehouses[0].direction_cw,
                        name_department_destiny: p.city.department.name_d,
                        name_city_destiny: p.city.name_city,
                        direction_client_p: p.direction_client_p,
                    };
                } else if (p.fk_id_tp_p == 2) {
                    //Definate response orden fine JSON
                    return {
                        id_p: p.id_p,
                        type_send: p.fk_id_tp_p,
                        status_p: p.status_p,
                        order_number: p.orden_p,
                        date_created_p: p.createdAt,
                        profit_for_carrier: p.profit_carrier_p,
                        total_price_p: p.total_price_p,
                        with_collection_p: p.with_collection_p,
                        name_department: p.store.city.department.name_d,
                        name_city_origin: p.store.city.name_city,
                        address_store_origin: p.store.direction_store,
                        name_central_warehouse_origin: p.store.city.central_warehouses[0].name_cw,
                        address_central_warehouse_origin: p.store.city.central_warehouses[0].direction_cw,
                        name_department_destiny: p.city.department.name_d,
                        name_city_destiny: p.city.name_city,
                        name_central_warehouse_destiny: p.city.central_warehouses[0].name_cw,
                        address_central_warehouse_destiny: p.city.central_warehouses[0].direction_cw,
                        direction_client_p: p.direction_client_p,
                    };
                }
            });
            // logger control proccess
            logger.info('Master successfuly');
            // The credentials are incorrect
            res.json({
                message: 'Master successfuly',
                result: 1,
                data_master: carrier_master,
                data_packages: formattedDataPackages
            });
        } else {
            // logger control proccess
            logger.info('Non-existent carrier');
            // The credentials are incorrect
            res.status(401).json({ message: 'Non-existent carrier' });
        }
    } catch (e) {
        // logger control proccess
        logger.info('Error Master: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// Method asignated packages Carriers
export async function asignatedPackages(req, res) {
    // logger control proccess
    logger.info('enter the endpoint asignated packages');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const carrier_packages = await Package.findAll({
            where: {
                fk_id_carrier_p: id_carrier,
                confirmation_carrier_p: 0,
                //status_p: {
                //    [Sequelize.Op.notIn]: [3, 5, 6]
                //}
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
            attributes: ['id_p', 'fk_id_tp_p', 'orden_p', 'guide_number_p', 'profit_carrier_p', 'status_p', 'direction_client_p', 'createdAt', 'total_price_p', 'with_collection_p'],
            order: [
                ['createdAt', 'ASC'] // Sort by column 'column_name' in ascending order
            ]
        });
        // Process data for JSON response
        const formattedDataPackages = carrier_packages.map(p => {
            // I validate type send package and decidate 1. Municipal send, 2. Inter-municipal send
            if (p.fk_id_tp_p == 1) {
                // Definate response orden fine JSON
                return {
                    id_p: p.id_p,
                    type_send: p.fk_id_tp_p,
                    status_p: p.status_p,
                    order_number: p.orden_p,
                    date_created_p: p.createdAt,
                    profit_for_carrier: p.profit_carrier_p,
                    total_price_p: p.total_price_p,
                    with_collection_p: p.with_collection_p,
                    name_department: p.store.city.department.name_d,
                    name_city: p.store.city.name_city,
                    address_store: p.store.direction_store,
                    name_central_warehouse: p.store.city.central_warehouses[0].name_cw,
                    address_central_warehouse: p.store.city.central_warehouses[0].direction_cw,
                    name_department_destiny: p.city.department.name_d,
                    name_city_destiny: p.city.name_city,
                    direction_client_p: p.direction_client_p
                };
            } else if (p.fk_id_tp_p == 2) {
                //Definate response orden fine JSON
                return {
                    id_p: p.id_p,
                    type_send: p.fk_id_tp_p,
                    status_p: p.status_p,
                    order_number: p.orden_p,
                    date_created_p: p.createdAt,
                    profit_for_carrier: p.profit_carrier_p,
                    total_price_p: p.total_price_p,
                    with_collection_p: p.with_collection_p,
                    name_department: p.store.city.department.name_d,
                    name_city_origin: p.store.city.name_city,
                    address_store_origin: p.store.direction_store,
                    name_central_warehouse_origin: p.store.city.central_warehouses[0].name_cw,
                    address_central_warehouse_origin: p.store.city.central_warehouses[0].direction_cw,
                    name_department_destiny: p.city.department.name_d,
                    name_city_destiny: p.city.name_city,
                    name_central_warehouse_destiny: p.city.central_warehouses[0].name_cw,
                    address_central_warehouse_destiny: p.city.central_warehouses[0].direction_cw,
                    direction_client_p: p.direction_client_p
                };
            }
        });
        // logger control proccess
        logger.info('Asignated packages successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Asignated packages successfuly',
            result: 1,
            data_packages: formattedDataPackages
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error asignated packages: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// Method to confirmate packages Carriers
export async function confirmatePackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint confirmate packages');
    try {
        // capture the id that comes in the parameters of the req
        const { id_p } = req.body;
        // I validate req correct json
        if (!id_p) return res.sendStatus(400);
        // I call and save the result of the findOne method, which is d sequelize
        const data_package = await Package.findOne({
            where: {
                id_p
            },
            attributes: ['id_p', 'status_p', 'fk_id_tp_p', 'confirmation_carrier_p', 'fk_id_carrier_p']
        });
        let data_p, newHistory; // Declare data_p at a higher scope
        const type_send = data_package.fk_id_tp_p; // Declare type_send at a higher scoper and simple writing in validations
        const id_carrier_asignate = data_package.fk_id_carrier_p;
        // Structure condition statys package and to change status baseded 1. type send municipal, 2- type send inter-municipal 
        //1.Bodega inicial 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destinal a bodego 5.En camino a entrega final 6. Entregado 7. En camino de bodega inicia central 
        if (type_send == 1) {
            switch (data_package.status_p) {
                case 1:
                    data_p = confirmAndStatus(id_p, 7)
                    // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
                    newHistory = await Status_history.create({
                        status_sh: 7,
                        comentary_sh: "En camino de bodega inicial a bodega central",
                        fk_id_carrier_asignated_sh: id_carrier_asignate,
                        fk_id_p_sh: id_p,
                    });
                    // logger control proccess
                    logger.info('History status registed successfully');
                    break;

                case 4:
                    data_p = confirmAndStatus(id_p, 5)
                    // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
                    newHistory = await Status_history.create({
                        status_sh: 5,
                        comentary_sh: "En camino a entrega final",
                        fk_id_carrier_asignated_sh: id_carrier_asignate,
                        fk_id_p_sh: id_p,
                    });
                    // logger control proccess
                    logger.info('History status registed successfully');
                    break;

                default:
                    break;
            }
        } else if (type_send == 2) {
            switch (data_package.status_p) {
                case 1:
                    data_p = confirmAndStatus(id_p, 7);
                    newHistory = await Status_history.create({
                        status_sh: 7,
                        comentary_sh: "En camino de bodega inicial a central de origen",
                        fk_id_carrier_asignated_sh: id_carrier_asignate,
                        fk_id_p_sh: id_p,
                    });
                    // logger control proccess
                    logger.info('History status registed successfully');
                    break;

                case 2:
                    data_p = confirmAndStatus(id_p, 3);
                    // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
                    newHistory = await Status_history.create({
                        status_sh: 3,
                        comentary_sh: "En camino entre bodegas centrales centrales diferentes",
                        fk_id_carrier_asignated_sh: id_carrier_asignate,
                        fk_id_p_sh: id_p,
                    });
                    // logger control proccess
                    logger.info('History status registed successfully');
                    break;

                case 4:
                    data_p = confirmAndStatus(id_p, 5);
                    // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
                    newHistory = await Status_history.create({
                        status_sh: 5,
                        comentary_sh: "En camino a entrega final",
                        fk_id_carrier_asignated_sh: id_carrier_asignate,
                        fk_id_p_sh: id_p,
                    });
                    // logger control proccess
                    logger.info('History status registed successfully');
                    break;

                default:
                    break;
            }
        }
        // logger control proccess
        logger.info('Confirmate packages successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Confirmate packages successfuly',
            result: 1,
            data: data_p
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error asignated packages: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// Method packages on the way Carriers
export async function onTheWayPackages(req, res) {
    // logger control proccess
    logger.info('enter the endpoint on the way packages');
    try {
        // capture the id that comes in the parameters of the req
        const { id_carrier } = req.body;
        // I validate req correct json
        if (!id_carrier) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        // 1.Bodega inicial 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino 5.En camino a entrega 6. Entregado 7. En camino de bodega inicial a bodega central 
        const onTheWayPackage = await Package.findAll({
            where: {
                fk_id_carrier_p: id_carrier,
                confirmation_carrier_p: 1,
                status_p: {
                    [Sequelize.Op.in]: [3, 5, 7]
                }
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
            attributes: ['id_p', 'fk_id_tp_p', 'orden_p', 'guide_number_p', 'profit_carrier_p', 'status_p', 'direction_client_p', 'createdAt', 'total_price_p', 'with_collection_p'],
            order: [
                ['createdAt', 'ASC'] // Sort by column 'column_name' in ascending order
            ]
        });
        // Process data for JSON response
        const formattedDataPackages = onTheWayPackage.map(p => {
            // I validate type send package and decidate 1. Municipal send, 2. Inter-municipal send
            if (p.fk_id_tp_p == 1) {
                // Definate response orden fine JSON
                return {
                    id_p: p.id_p,
                    type_send: p.fk_id_tp_p,
                    status_p: p.status_p,
                    order_number: p.orden_p,
                    date_created_p: p.createdAt,
                    profit_for_carrier: p.profit_carrier_p,
                    total_price_p: p.total_price_p,
                    with_collection_p: p.with_collection_p,
                    name_department: p.store.city.department.name_d,
                    name_city: p.store.city.name_city,
                    address_store: p.store.direction_store,
                    name_central_warehouse: p.store.city.central_warehouses[0].name_cw,
                    address_central_warehouse: p.store.city.central_warehouses[0].direction_cw,
                    name_department_destiny: p.city.department.name_d,
                    name_city_destiny: p.city.name_city,
                    direction_client_p: p.direction_client_p
                };
            } else if (p.fk_id_tp_p == 2) {
                //Definate response orden fine JSON
                return {
                    id_p: p.id_p,
                    type_send: p.fk_id_tp_p,
                    status_p: p.status_p,
                    order_number: p.orden_p,
                    date_created_p: p.createdAt,
                    profit_for_carrier: p.profit_carrier_p,
                    total_price_p: p.total_price_p,
                    with_collection_p: p.with_collection_p,
                    name_department: p.store.city.department.name_d,
                    name_city_origin: p.store.city.name_city,
                    address_store_origin: p.store.direction_store,
                    name_central_warehouse_origin: p.store.city.central_warehouses[0].name_cw,
                    address_central_warehouse_origin: p.store.city.central_warehouses[0].direction_cw,
                    name_department_destiny: p.city.department.name_d,
                    name_city_destiny: p.city.name_city,
                    name_central_warehouse_destiny: p.city.central_warehouses[0].name_cw,
                    address_central_warehouse_destiny: p.city.central_warehouses[0].direction_cw,
                    direction_client_p: p.direction_client_p
                };
            }
        });
        // logger control proccess
        logger.info('On the way packages successfuly');
        // The credentials are incorrect
        res.json({
            message: 'On the way packages successfuly',
            result: 1,
            data_packages: formattedDataPackages
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error on the way  packages: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// Method packages detail
export async function detailPackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint details packages');
    try {
        // capture the id that comes in the parameters of the req
        const { id_p } = req.body;
        // I validate req correct json
        if (!id_p) return res.sendStatus(400);
        // I call and save the result of the findAll method, which is d sequelize
        const detailPackage = await Package.findAll({
            where: {
                id_p,
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
            attributes: ['id_p', 'fk_id_tp_p', 'orden_p', 'name_client_p', 'phone_number_client_p', 'email_client_p', 'guide_number_p', 'profit_carrier_p', 'status_p', 'direction_client_p', 'createdAt', 'total_price_p', 'with_collection_p']
        });
        // Process data for JSON response
        const formattedDataPackages = detailPackage.map(p => {
            // I validate type send package and decidate 1. Municipal send, 2. Inter-municipal send
            if (p.fk_id_tp_p == 1) {
                // Definate response orden fine JSON
                return {
                    id_p: p.id_p,
                    type_send: p.fk_id_tp_p,
                    status_p: p.status_p,
                    order_number: p.orden_p,
                    date_created_p: p.createdAt,
                    profit_for_carrier: p.profit_carrier_p,
                    total_price_p: p.total_price_p,
                    with_collection_p: p.with_collection_p,
                    name_department: p.store.city.department.name_d,
                    name_city: p.store.city.name_city,
                    address_store: p.store.direction_store,
                    name_central_warehouse: p.store.city.central_warehouses[0].name_cw,
                    address_central_warehouse: p.store.city.central_warehouses[0].direction_cw,
                    name_department_destiny: p.city.department.name_d,
                    name_city_destiny: p.city.name_city,
                    name_client_p: p.name_client_p,
                    phone_number_client_p: p.phone_number_client_p,
                    email_client_p: p.email_client_p,
                    guide_number_p: p.guide_number_p,
                    direction_client_p: p.direction_client_p
                };
            } else if (p.fk_id_tp_p == 2) {
                //Definate response orden fine JSON
                return {
                    id_p: p.id_p,
                    type_send: p.fk_id_tp_p,
                    status_p: p.status_p,
                    order_number: p.orden_p,
                    date_created_p: p.createdAt,
                    profit_for_carrier: p.profit_carrier_p,
                    total_price_p: p.total_price_p,
                    with_collection_p: p.with_collection_p,
                    name_department: p.store.city.department.name_d,
                    name_city_origin: p.store.city.name_city,
                    address_store_origin: p.store.direction_store,
                    name_central_warehouse_origin: p.store.city.central_warehouses[0].name_cw,
                    address_central_warehouse_origin: p.store.city.central_warehouses[0].direction_cw,
                    name_department_destiny: p.city.department.name_d,
                    name_city_destiny: p.city.name_city,
                    name_central_warehouse_destiny: p.city.central_warehouses[0].name_cw,
                    address_central_warehouse_destiny: p.city.central_warehouses[0].direction_cw,
                    name_client_p: p.name_client_p,
                    phone_number_client_p: p.phone_number_client_p,
                    email_client_p: p.email_client_p,
                    guide_number_p: p.guide_number_p,
                    direction_client_p: p.direction_client_p
                };
            }
        });
        // logger control proccess
        logger.info('Details package successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Details package successfuly',
            result: 1,
            data_packages: formattedDataPackages
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error details package: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}

// Method to deliver packages Carriers
export async function deliverPackage(req, res) {
    // logger control proccess
    logger.info('enter the endpoint deliver packages');
    try {
        // I validate error file empty
        if (!req.files) return res.status(400).json({ error: 'No file provided' });
        // capture the id that comes in the parameters of the req
        const { id_p, type_evidence } = req.body;
        // I validate req correct json
        if (!id_p) return res.sendStatus(400);
        // I call and save the result of the findOne method, which is d sequelize
        const data_package = await Package.findOne({
            where: {
                id_p
            },
            attributes: ['id_p', 'status_p', 'fk_id_tp_p', 'confirmation_carrier_p', 'fk_id_carrier_p']
        });
        let data_p, data_e, newHistory; // Declare data_p at a higher scope
        const type_send = data_package.fk_id_tp_p; // Declare type_send at a higher scoper and simple writing in validations
        const id_carrier_asignate = data_package.fk_id_carrier_p;
        // Structure condition statys package and to change status baseded 1. type send municipal, 2- type send inter-municipal 
        // 1.Bodega inicial 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino 5.En camino a entrega 6. Entregado 7. En camino de bodega inicial a bodega central
        if (type_send == 1) {
            switch (data_package.status_p) {
                case 7:
                    data_e = loadEvidenceDataBase(req, id_p, type_evidence);
                    data_p = deliverPackageCarrierDataBase(id_p, 4);
                    // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
                    newHistory = await Status_history.create({
                        status_sh: 4,
                        comentary_sh: "Entregado a bodega central ciudad destino",
                        fk_id_carrier_asignated_sh: id_carrier_asignate,
                        fk_id_p_sh: id_p,
                    });
                    // logger control proccess
                    logger.info('History status registed successfully');

                    break;

                case 5:
                    data_e = loadEvidenceDataBase(req, id_p, type_evidence)
                    data_p = deliverPackageCarrierDataBase(id_p, 6)
                    // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
                    newHistory = await Status_history.create({
                        status_sh: 6,
                        comentary_sh: "Entregado al cliente",
                        fk_id_carrier_asignated_sh: id_carrier_asignate,
                        fk_id_p_sh: id_p,
                    });
                    // logger control proccess
                    logger.info('History status registed successfully');

                    break;

                default:
                    break;
            }
        } else if (type_send == 2) {
            switch (data_package.status_p) {
                case 7:
                    data_e = loadEvidenceDataBase(req, id_p, type_evidence)
                    data_p = deliverPackageCarrierDataBase(id_p, 2)
                    // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
                    newHistory = await Status_history.create({
                        status_sh: 2,
                        comentary_sh: "Entregado a bodega central ciudad origen",
                        fk_id_carrier_asignated_sh: id_carrier_asignate,
                        fk_id_p_sh: id_p,
                    });
                    // logger control proccess
                    logger.info('History status registed successfully');

                    break;

                case 3:
                    data_e = loadEvidenceDataBase(req, id_p, type_evidence)
                    data_p = deliverPackageCarrierDataBase(id_p, 4)
                    // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
                    newHistory = await Status_history.create({
                        status_sh: 4,
                        comentary_sh: "Entregado a bodega central ciudad destino",
                        fk_id_carrier_asignated_sh: id_carrier_asignate,
                        fk_id_p_sh: id_p,
                    });
                    // logger control proccess
                    logger.info('History status registed successfully');

                    break;

                case 5:
                    data_e = loadEvidenceDataBase(req, id_p, type_evidence)
                    data_p = deliverPackageCarrierDataBase(id_p, 6)
                    // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
                    newHistory = await Status_history.create({
                        status_sh: 6,
                        comentary_sh: "Entregado al cliente",
                        fk_id_carrier_asignated_sh: id_carrier_asignate,
                        fk_id_p_sh: id_p,
                    });
                    // logger control proccess
                    logger.info('History status registed successfully');
                    break;

                default:
                    break;
            }
        }
        // logger control proccess
        logger.info('Deliver packages successfuly');
        // The credentials are incorrect
        res.json({
            message: 'Deliver packages successfuly',
            result: 1,
            data_e,
            data_p
        });
    } catch (e) {
        // logger control proccess
        logger.info('Error asignated packages: ' + e);
        // I return the status 500 and the message I want
        res.status(500).json({
            message: 'Something goes wrong',
            data: {}
        });
    }
}
/*===========================================================================================
                                    Assistent Methods
===========================================================================================*/
// Method that helps me change the carrier confirmation flags and the status of the package
async function confirmAndStatus(id_p, status) {
    // I call and save the result of the findOne method, which is d sequelize
    const data_package = await Package.findOne({
        where: {
            id_p
        },
        attributes: ['id_p', 'status_p', 'confirmation_carrier_p']
    });

    data_package.set({
        confirmation_carrier_p: 1,
        status_p: status
    });
    await data_package.save();
    //return result
    return data_package
}

// Method that helps me change the carrier confirmation flags and the status of the package
async function deliverPackageCarrierDataBase(id_p, status) {
    // I call and save the result of the findOne method, which is d sequelize
    const data_package = await Package.findOne({
        where: {
            id_p
        },
        attributes: ['id_p', 'status_p', 'confirmation_carrier_p']
    });

    data_package.set({
        confirmation_carrier_p: 0,
        status_p: status,
        fk_id_carrier_p: null
    });
    await data_package.save();
    //return result
    return data_package;
}

// Method that helps me change the carrier confirmation flags and the status of the package
async function loadEvidenceDataBase(req, id_p, type_evidence) {
    let error = false;
    let newEvidence;
    // Run files array and insert in database the documents
    req.files.forEach(async evidence => {
        // I declare the create method with its respective definition of the object and my Carrier model in a variable taking into account the await
        newEvidence = await Evidence.create({
            url_image_evidence: "evidences_packages/" + evidence.filename,
            date_created_evidence: formattedTime,
            fk_id_p_evidence: id_p,
            fk_id_type_evidence_evidence: type_evidence
        });
        if (!newEvidence) error = true;
    });
    // valid if everything went well in the INSERT
    if (error) {
        // Devolver un JSON con un mensaje de error
        return res.status(400).json({
            message: 'Error load evidence package',
            result: 0
        });
    }
    //return result
    return newEvidence;
}