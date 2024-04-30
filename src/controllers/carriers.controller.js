// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import moment from "moment-timezone";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Sequelize, where } from "sequelize";
// import personaly models
import { Carrier } from "../models/carriers.model.js";
import { Carrier_document } from "../models/carrier_documents.model.js";
import { Carrier_bank_account } from "../models/carrier_bank_accounts.model.js";
import { Vehicle } from "../models/vehicles.model.js";
import { Vehicle_document } from "../models/vehicle_documents.model.js";
import { Evidence } from "../models/evidences.model.js";
import { Package } from "../models/packages.model.js";
import { Store } from "../models/stores.model.js";
import { City } from "../models/cities.model.js";
import { Central_warehouse } from "../models/central_warehouses.model.js";
import { Department } from "../models/departments.model.js";
import { Status_history } from "../models/status_history.model.js";
import { Carrier_payment_request } from "../models/carrier_payment_requests.model.js";
import { Dropshipper } from "../models/dropshippers.model.js";
import { Portfolios_history_dropshipper } from "../models/portfolio_history_dropshipper.model.js";
// config dot env secret
dotenv.config();
// Firme private secret jwt
const secret = process.env.SECRET;
// capture the exact time in my time zone using the moment-timezone module, I do this capture outside the methods to reuse this variable
const bogotaTime = moment.tz("America/Bogota");
const formattedTime = bogotaTime.format("YYYY-MM-DD HH:mm:ss");

// method to register Carriers
export async function register(req, res) {
  // logger control proccess
  logger.info("enter the endpoint register carrier");
  // I save the variables that come to me in the request in variables.
  const {
    number_document_carrier,
    name_carrier,
    last_name_carrier,
    phone_number_carrier,
    email_carrier,
    password_carrier,
    fk_id_city_carrier,
    fk_id_tc_carrier,
    fk_id_td_carrier,
  } = req.body;
  // I validate req correct json
  if (
    !name_carrier ||
    !last_name_carrier ||
    !phone_number_carrier ||
    !email_carrier ||
    !password_carrier
  )
    return res.sendStatus(400);
  // I enclose everything in a try catch to control errors
  try {
    // I declare the create method with its respective definition of the object and my Carrier model in a variable taking into account the await
    let newCarrier = await Carrier.create(
      {
        number_document_carrier,
        name_carrier,
        last_name_carrier,
        phone_number_carrier,
        email_carrier,
        password_carrier,
        status_carrier: 6,
        revenue_carrier: 0,
        debt_carrier: 0,
        fk_id_td_carrier,
        fk_id_city_carrier,
        fk_id_tc_carrier,
      },
      {
        // I define the variables that I am going to insert into the database so that there are no conflicts with the definition of the id or the number of columns
        fields: [
          "number_document_carrier",
          "name_carrier",
          "last_name_carrier",
          "phone_number_carrier",
          "email_carrier",
          "password_carrier",
          "status_carrier",
          "revenue_carrier",
          "debt_carrier",
          "fk_id_city_carrier",
          "fk_id_tc_carrier",
          "fk_id_td_carrier",
        ],
      }
    );
    // valid if everything went well in the INSERT
    if (newCarrier) {
      // logger control proccess
      logger.info("Carrier registed successfully");
      // I return the json with the message I want
      return res.json({
        message: "Carrier registed successfully",
        result: 1,
        data: newCarrier,
      });
    }
  } catch (e) {
    // logger control proccess
    logger.info("Error registerCarrier: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// method to loaddocuments Carriers
export async function loadDocumentsCarrier(req, res) {
  // logger control proccess
  logger.info("enter the endpoint registerDocuments carrier");
  try {
    // I validate error file empty
    if (!req.files) return res.status(400).json({ error: "No file provided" });
    // Extract id_carrier of req.body
    const { id_carrier } = req.body;
    let error = false;
    // Run files array and insert in database the documents
    req.files.forEach(async (document) => {
      // I declare the create method with its respective definition of the object and my Carrier model in a variable taking into account the await
      let newDocument = await Carrier_document.create({
        url_cd: "documents_carrier/" + document.filename,
        date_created_cd: formattedTime,
        fk_id_carrier_cd: id_carrier,
      });
      if (!newDocument) error = true;
    });
    // valid if everything went well in the INSERT
    if (error) {
      // Devolver un JSON con un mensaje de error
      return res.status(400).json({
        message: "Error load document carrier",
        result: 0,
      });
    }
    // update status carrier
    const carrier = await Carrier.findOne({
      where: {
        id_carrier,
      },
    });
    carrier.set({
      status_carrier: 5,
    });
    await carrier.save();
    // logger control proccess
    logger.info("Carrier documents registed successfully");
    // I return the json with the message I want
    return res.json({
      message: "Carrier documents registered successfully",
      result: 1,
      data: req.files.map((file) => ({
        filename: file.filename,
        mimetype: file.mimetype,
      })),
    });
  } catch (e) {
    // logger control proccess
    logger.info("Error registerCarrierDocument: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// method to register Carriers
export async function registerBankAccountCarrier(req, res) {
  // logger control proccess
  logger.info("enter the endpoint register carrier bank account");
  // I save the variables that come to me in the request in variables.
  const { number_cba, type_cba, bank_cba, description_cba, fk_id_carrier_cba } =
    req.body;
  // I validate req correct json
  if (
    !number_cba ||
    !type_cba ||
    !bank_cba ||
    !description_cba ||
    !fk_id_carrier_cba
  )
    return res.sendStatus(400);
  // I enclose everything in a try catch to control errors
  try {
    // I declare the create method with its respective definition of the object and my Carrier model in a variable taking into account the await
    let newBankAccount = await Carrier_bank_account.create(
      {
        number_cba,
        type_cba,
        bank_cba,
        description_cba,
        fk_id_carrier_cba,
      },
      {
        // I define the variables that I am going to insert into the database so that there are no conflicts with the definition of the id or the number of columns
        fields: [
          "number_cba",
          "type_cba",
          "bank_cba",
          "description_cba",
          "fk_id_carrier_cba",
        ],
      }
    );
    // valid if everything went well in the INSERT
    if (newBankAccount) {
      // update status carrier
      const carrier = await Carrier.findOne({
        where: {
          id_carrier: fk_id_carrier_cba,
        },
      });
      carrier.set({
        status_carrier: 4,
      });
      await carrier.save();
      // logger control proccess
      logger.info("Carrier bank account registed successfully");
      // I return the json with the message I want
      return res.json({
        message: "Carrier bank account registed successfully",
        result: 1,
        data: newBankAccount,
      });
    }
  } catch (e) {
    // logger control proccess
    logger.info("Error register carrier bank account: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// method to register vehicle Carriers
export async function registerVehicle(req, res) {
  // logger control proccess
  logger.info("Enter the endpoint registerVehicle carrier with photo");
  try {
    // I validate error file empty
    if (!req.files) return res.status(400).json({ error: "No photo provided" });
    // Extract id_carrier of req.body
    const {
      id_carrier,
      description_vehicle,
      class_vehicle,
      plate_vehicle,
      color_vehicle,
      brand_vehicle,
      line_vehicle,
      model_vehicle,
      cylinder_capacity_vehicle,
    } = req.body;
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
      fk_id_carrier_vehicle: id_carrier,
    });
    if (!newVehicle) error = true;

    // valid if everything went well in the INSERT
    if (error) {
      // Devolver un JSON con un mensaje de error
      return res.status(400).json({
        message: "Error load vehicle by carrier",
        result: 0,
      });
    }
    // update status carrier
    const carrier = await Carrier.findOne({
      where: {
        id_carrier,
      },
    });
    carrier.set({
      status_carrier: 3,
    });
    await carrier.save();
    // logger control proccess
    logger.info("Vehicle registed and carrier asosiation successfully");
    // I return the json with the message I want
    return res.json({
      message: "Vehicle registed and carrier asosiation successfully",
      result: 1,
      data: newVehicle,
    });
  } catch (e) {
    // logger control proccess
    logger.info("Error registerVehiculeCarrier: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// method to load vehicule documents Carriers
export async function loadDocumentsVehicle(req, res) {
  // logger control proccess
  logger.info("Enter the endpoint registerDocuments vehicle");
  try {
    // I validate error file empty
    if (!req.files) return res.status(400).json({ error: "No file provided" });
    // Extract id_carrier of req.body
    const { id_carrier, id_vehicle } = req.body;
    let error = false;
    // Run files array and insert in database the documents
    req.files.forEach(async (document) => {
      // I declare the create method with its respective definition of the object and my Carrier model in a variable taking into account the await
      let newDocument = await Vehicle_document.create({
        url_document_vd: "documents_vehicle_carrier/" + document.filename,
        date_created_vd: formattedTime,
        fk_id_vehicle_vd: id_vehicle,
      });
      if (!newDocument) error = true;
    });
    // valid if everything went well in the INSERT
    if (error) {
      // Devolver un JSON con un mensaje de error
      return res.status(400).json({
        message: "Error load document vehicle",
        result: 0,
      });
    }
    // update status carrier
    const carrier = await Carrier.findOne({
      where: {
        id_carrier,
      },
    });
    carrier.set({
      status_carrier: 2,
    });
    await carrier.save();
    // logger control proccess
    logger.info("vehicle documents registed successfully");
    // I return the json with the message I want
    return res.json({
      message: "vehicle documents registered successfully",
      result: 1,
      data: req.files.map((file) => ({
        filename: file.filename,
        mimetype: file.mimetype,
      })),
    });
  } catch (e) {
    // logger control proccess
    logger.info("Error registerCarrierDocument: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// Method login Carriers
export async function login(req, res) {
  // logger control proccess
  logger.info("enter the endpoint login");
  try {
    // capture the id that comes in the parameters of the req
    const { email_carrier, password_carrier } = req.body;
    // I validate req correct json
    if (!email_carrier || !password_carrier) return res.sendStatus(400);
    // I call and save the result of the findAll method, which is d sequelize
    const loginCarrier = await Carrier.findAll({
      where: {
        email_carrier,
        password_carrier,
      },
      attributes: [
        "id_carrier",
        "name_carrier",
        "email_carrier",
        "status_carrier",
        "last_login_carrier",
      ],
    });
    // I validate login exist
    if (loginCarrier.length > 0) {
      // realiazr la validacion si el usuario esta activado para poder hacer el login
      if (loginCarrier[0].status_carrier === 1) {
        // Token Payload
        const payload = {
          id_carrier: loginCarrier[0].id_carrier,
          name_carrier: loginCarrier[0].name_carrier,
          exp: Date.now() + 60 * 1000 * 60 * 4,
        };
        // I Create json web token for return him in json response
        const token = jwt.sign(payload, secret);
        // I go through the login data that I obtained and send the lastlogin to be updated
        loginCarrier.forEach(async (loginCarrier) => {
          await loginCarrier.update({
            last_login_carrier: formattedTime,
          });
        });
        // logger control proccess
        logger.info(
          "correct credentials, Started Sesion, token returned in response body data."
        );
        // The carrier exists and the credentials are correct
        res.json({
          message: "Successful login",
          result: 1,
          token,
          data: loginCarrier,
        });
      } else {
        // logger control proccess
        logger.info("User Disabled");
        // The credentials are incorrect
        res.status(401).json({
          message: "User Disabled",
          result: 0,
          status_carrier: loginCarrier[0].status_carrier,
        });
      }
    } else {
      // logger control proccess
      logger.info("Incorrect credentials or non-existent credenciales");
      // The credentials are incorrect
      res.status(401).json({
        message: "Incorrect credentials or non-existent credenciales",
        result: 0,
      });
    }
  } catch (e) {
    // logger control proccess
    logger.info("Error Login: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// Method master Carriers
export async function master(req, res) {
  // logger control proccess
  logger.info("enter the endpoint master");
  try {
    // capture the id that comes in the parameters of the req
    const { id_carrier } = req.body;
    // I validate req correct json
    if (!id_carrier) return res.sendStatus(400);
    // I call and save the result of the findAll method, which is d sequelize
    const carrier_master = await Carrier.findAll({
      where: {
        id_carrier,
      },
      attributes: [
        "id_carrier",
        "name_carrier",
        "email_carrier",
        "revenue_carrier",
        "debt_carrier",
        "url_QR_carrier",
        "bancolombia_number_account_carrier",
        "nequi_carrier",
        "daviplata_carrier",
      ],
      include: [
        {
          model: Carrier_bank_account,
          attributes: ["id_cba", "bank_cba"],
        },
      ],
    });
    // I validate login exist
    if (carrier_master.length > 0) {
      // I call and save the result of the findAll method, which is d sequelize
      const carrier_packages = await Package.findAll({
        where: {
          fk_id_carrier_p: id_carrier,
          confirmation_carrier_p: 0,
          status_p: {
            [Sequelize.Op.notIn]: [3, 5, 6, 7],
          },
        },
        include: [
          {
            model: Store,
            attributes: ["id_store", "direction_store"],
            include: [
              {
                model: City,
                attributes: ["id_city", "name_city"],
                include: [
                  {
                    model: Central_warehouse,
                    attributes: ["id_cw", "name_cw", "direction_cw"],
                  },
                  {
                    model: Department,
                    attributes: ["id_d", "name_d"],
                  },
                ],
              },
            ],
          },
          {
            model: City,
            attributes: ["id_city", "name_city"],
            include: [
              {
                model: Central_warehouse,
                attributes: ["id_cw", "name_cw", "direction_cw"],
              },
              {
                model: Department,
                attributes: ["id_d", "name_d"],
              },
            ],
          },
        ],
        attributes: [
          "id_p",
          "fk_id_tp_p",
          "orden_p",
          "guide_number_p",
          "profit_carrier_p",
          "total_price_p",
          "with_collection_p",
          "status_p",
          "direction_client_p",
          "createdAt",
        ],
        order: [
          ["createdAt", "ASC"], // Sort by column 'column_name' in ascending order
        ],
      });
      // Process data for JSON response
      const formattedDataPackages = carrier_packages.map((p) => {
        // I validate type send package and decidate 1. Municipal send, 2. Inter-municipal send
        if (p.fk_id_tp_p == 1) {
          let type_send = p.fk_id_tp_p == 1 ? "Municipal" : "Nacional";
          let statusText;
          //1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino  5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a central
          switch (p.status_p) {
            case 1:
              statusText = "Bodega dropshipper";
              // Convertir la fecha a una cadena ISO si es un objeto Date
              var fechaISO =
                p.createdAt instanceof Date
                  ? p.createdAt.toISOString()
                  : p.createdAt;
              // Ahora sí, formatear la cadena
              var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
              // Definate response orden fine JSON
              return {
                id_p: p.id_p,
                type_send,
                status_p: statusText,
                order_number: p.orden_p,
                date_created_p,
                profit_for_carrier: p.profit_carrier_p,
                total_price_p: p.total_price_p,
                with_collection_p: p.with_collection_p,
                address_origin:
                  p.store.direction_store +
                  " - " +
                  p.store.city.name_city +
                  " - " +
                  p.store.city.department.name_d,
                address_destiny:
                  p.city.central_warehouses[0].direction_cw +
                  " - " +
                  p.city.name_city +
                  " - " +
                  p.city.department.name_d,
              };
              break;
            case 4:
              statusText = "En bodega central destino";
              // Convertir la fecha a una cadena ISO si es un objeto Date
              var fechaISO =
                p.createdAt instanceof Date
                  ? p.createdAt.toISOString()
                  : p.createdAt;
              // Ahora sí, formatear la cadena
              var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
              // Definate response orden fine JSON
              return {
                id_p: p.id_p,
                type_send,
                status_p: statusText,
                order_number: p.orden_p,
                date_created_p,
                profit_for_carrier: p.profit_carrier_p,
                total_price_p: p.total_price_p,
                with_collection_p: p.with_collection_p,
                address_origin:
                  p.city.central_warehouses[0].direction_cw +
                  " - " +
                  p.city.name_city +
                  " - " +
                  p.city.department.name_d,
                address_destiny:
                  p.direction_client_p +
                  " - " +
                  p.city.name_city +
                  " - " +
                  p.city.department.name_d,
              };
              break;
          }
        } else if (p.fk_id_tp_p == 2) {
          let type_send = p.fk_id_tp_p == 1 ? "Municipal" : "Nacional";
          let statusText;
          //1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino  5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a central
          switch (p.status_p) {
            case 1:
              statusText = "En bodega dropshipper";
              // Convertir la fecha a una cadena ISO si es un objeto Date
              var fechaISO =
                p.createdAt instanceof Date
                  ? p.createdAt.toISOString()
                  : p.createdAt;
              // Ahora sí, formatear la cadena
              var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
              // Definate response orden fine JSON
              return {
                id_p: p.id_p,
                type_send,
                status_p: statusText,
                order_number: p.orden_p,
                date_created_p,
                profit_for_carrier: p.profit_carrier_p,
                total_price_p: p.total_price_p,
                with_collection_p: p.with_collection_p,
                address_origin:
                  p.store.direction_store +
                  " - " +
                  p.store.city.name_city +
                  " - " +
                  p.store.city.department.name_d,
                address_destiny:
                  p.store.city.central_warehouses[0].direction_cw +
                  " - " +
                  p.store.city.name_city +
                  " - " +
                  p.store.city.department.name_d,
              };
              break;
            case 2:
              statusText = "En bodega central origen";
              // Convertir la fecha a una cadena ISO si es un objeto Date
              var fechaISO =
                p.createdAt instanceof Date
                  ? p.createdAt.toISOString()
                  : p.createdAt;
              // Ahora sí, formatear la cadena
              var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
              // Definate response orden fine JSON
              return {
                id_p: p.id_p,
                type_send,
                status_p: statusText,
                order_number: p.orden_p,
                date_created_p,
                profit_for_carrier: p.profit_carrier_p,
                total_price_p: p.total_price_p,
                with_collection_p: p.with_collection_p,
                address_origin:
                  p.store.city.central_warehouses[0].direction_cw +
                  " - " +
                  p.store.city.name_city +
                  " - " +
                  p.store.city.department.name_d,
                address_destiny:
                  p.city.central_warehouses[0].direction_cw +
                  " - " +
                  p.city.name_city +
                  " - " +
                  p.city.department.name_d,
              };
              break;
            case 4:
              statusText = "En bodega central destino";
              // Convertir la fecha a una cadena ISO si es un objeto Date
              var fechaISO =
                p.createdAt instanceof Date
                  ? p.createdAt.toISOString()
                  : p.createdAt;
              // Ahora sí, formatear la cadena
              var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
              // Definate response orden fine JSON
              return {
                id_p: p.id_p,
                type_send,
                status_p: statusText,
                order_number: p.orden_p,
                date_created_p,
                profit_for_carrier: p.profit_carrier_p,
                total_price_p: p.total_price_p,
                with_collection_p: p.with_collection_p,
                address_origin:
                  p.city.central_warehouses[0].direction_cw +
                  " - " +
                  p.city.name_city +
                  " - " +
                  p.city.department.name_d,
                address_destiny:
                  p.direction_client_p +
                  " - " +
                  p.city.name_city +
                  " - " +
                  p.city.department.name_d,
              };
              break;
          }
        }
      });
      // logger control proccess
      logger.info("Master successfuly");
      // The credentials are incorrect
      res.json({
        message: "Master successfuly",
        result: 1,
        data_master: carrier_master,
        data_packages: formattedDataPackages,
      });
    } else {
      // logger control proccess
      logger.info("Non-existent carrier");
      // The credentials are incorrect
      res.status(401).json({ message: "Non-existent carrier" });
    }
  } catch (e) {
    // logger control proccess
    logger.info("Error Master: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// Method asignated packages Carriers
export async function asignatedPackages(req, res) {
  // logger control proccess
  logger.info("enter the endpoint asignated packages");
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
        status_p: {
          [Sequelize.Op.notIn]: [3, 5, 6, 7],
        },
      },
      include: [
        {
          model: Store,
          attributes: ["id_store", "direction_store"],
          include: [
            {
              model: City,
              attributes: ["id_city", "name_city"],
              include: [
                {
                  model: Central_warehouse,
                  attributes: ["id_cw", "name_cw", "direction_cw"],
                },
                {
                  model: Department,
                  attributes: ["id_d", "name_d"],
                },
              ],
            },
          ],
        },
        {
          model: City,
          attributes: ["id_city", "name_city"],
          include: [
            {
              model: Central_warehouse,
              attributes: ["id_cw", "name_cw", "direction_cw"],
            },
            {
              model: Department,
              attributes: ["id_d", "name_d"],
            },
          ],
        },
      ],
      attributes: [
        "id_p",
        "fk_id_tp_p",
        "orden_p",
        "guide_number_p",
        "profit_carrier_p",
        "profit_carrier_inter_city_p",
        "status_p",
        "direction_client_p",
        "createdAt",
        "total_price_p",
        "with_collection_p",
      ],
      order: [
        ["createdAt", "ASC"], // Sort by column 'column_name' in ascending order
      ],
    });
    // Process data for JSON response
    const formattedDataPackages = carrier_packages.map((p) => {
      // I validate type send package and decidate 1. Municipal send, 2. Inter-municipal send
      if (p.fk_id_tp_p == 1) {
        let type_send = p.fk_id_tp_p == 1 ? "Municipal" : "Nacional";
        let statusText;
        //1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino  5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a central
        switch (p.status_p) {
          case 1:
            statusText = "Bodega dropshipper";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              address_origin:
                p.store.direction_store +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
          case 4:
            statusText = "En bodega central destino";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              address_origin:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
              address_destiny:
                p.direction_client_p +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
        }
      } else if (p.fk_id_tp_p == 2) {
        let type_send = p.fk_id_tp_p == 1 ? "Municipal" : "Nacional";
        let statusText;
        //1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino  5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a central
        switch (p.status_p) {
          case 1:
            statusText = "En bodega dropshipper";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              address_origin:
                p.store.direction_store +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
            };
            break;
          case 2:
            statusText = "En bodega central origen";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_inter_city_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              address_origin:
                p.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
          case 4:
            statusText = "En bodega central destino";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              address_origin:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
              address_destiny:
                p.direction_client_p +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
        }
      }
    });
    // logger control proccess
    logger.info("Asignated packages successfuly");
    // The credentials are incorrect
    res.json({
      message: "Asignated packages successfuly",
      result: 1,
      data_packages: formattedDataPackages,
    });
  } catch (e) {
    // logger control proccess
    logger.info("Error asignated packages: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// Method to confirmate packages Carriers
export async function confirmatePackage(req, res) {
  // logger control proccess
  logger.info("enter the endpoint confirmate packages");
  try {
    // capture the id that comes in the parameters of the req
    const { id_p } = req.body;
    // I validate req correct json
    if (!id_p) return res.sendStatus(400);
    // I call and save the result of the findOne method, which is d sequelize
    const data_package = await Package.findOne({
      where: {
        id_p,
      },
      attributes: [
        "id_p",
        "status_p",
        "fk_id_tp_p",
        "confirmation_carrier_p",
        "fk_id_carrier_p",
      ],
    });
    let data_p, newHistory; // Declare data_p at a higher scope
    const type_send = data_package.fk_id_tp_p; // Declare type_send at a higher scoper and simple writing in validations
    const id_carrier_asignate = data_package.fk_id_carrier_p;
    // Structure condition statys package and to change status baseded 1. type send municipal, 2- type send inter-municipal
    //1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino  5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a central
    if (type_send == 1) {
      switch (data_package.status_p) {
        case 1:
          data_p = confirmAndStatus(id_p, 7);
          // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
          newHistory = await Status_history.create({
            status_sh: 7,
            comentary_sh: "En camino de bodega dropshipper a bodega central",
            fk_id_carrier_asignated_sh: id_carrier_asignate,
            fk_id_p_sh: id_p,
          });
          // logger control proccess
          logger.info("History status registed successfully");
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
          logger.info("History status registed successfully");
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
            comentary_sh: "En camino de bodega dropshipper a central de origen",
            fk_id_carrier_asignated_sh: id_carrier_asignate,
            fk_id_p_sh: id_p,
          });
          // logger control proccess
          logger.info("History status registed successfully");
          break;

        case 2:
          data_p = confirmAndStatus(id_p, 3);
          // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
          newHistory = await Status_history.create({
            status_sh: 3,
            comentary_sh:
              "En camino entre bodegas centrales centrales diferentes",
            fk_id_carrier_asignated_sh: id_carrier_asignate,
            fk_id_p_sh: id_p,
          });
          // logger control proccess
          logger.info("History status registed successfully");
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
          logger.info("History status registed successfully");
          break;

        default:
          break;
      }
    }
    // logger control proccess
    logger.info(`Confirmate packages successfuly, results> ${data_p}`);
    // The credentials are incorrect
    res.json({
      message: "Confirmate packages successfuly",
      result: 1,
    });
  } catch (e) {
    // logger control proccess
    logger.info("Error asignated packages: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
    });
  }
}

// Method packages on the way Carriers
export async function onTheWayPackages(req, res) {
  // logger control proccess
  logger.info("enter the endpoint on the way packages");
  try {
    // capture the id that comes in the parameters of the req
    const { id_carrier } = req.body;
    // I validate req correct json
    if (!id_carrier) return res.sendStatus(400);
    // I call and save the result of the findAll method, which is d sequelize
    // 1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino 5.En camino a entrega 6. Entregado 7. En camino de bodega dropshipper a bodega central
    const onTheWayPackage = await Package.findAll({
      where: {
        fk_id_carrier_p: id_carrier,
        confirmation_carrier_p: 1,
        status_p: {
          [Sequelize.Op.in]: [3, 5, 7],
        },
      },
      include: [
        {
          model: Store,
          attributes: ["id_store", "direction_store"],
          include: [
            {
              model: City,
              attributes: ["id_city", "name_city"],
              include: [
                {
                  model: Central_warehouse,
                  attributes: ["id_cw", "name_cw", "direction_cw"],
                },
                {
                  model: Department,
                  attributes: ["id_d", "name_d"],
                },
              ],
            },
          ],
        },
        {
          model: City,
          attributes: ["id_city", "name_city"],
          include: [
            {
              model: Central_warehouse,
              attributes: ["id_cw", "name_cw", "direction_cw"],
            },
            {
              model: Department,
              attributes: ["id_d", "name_d"],
            },
          ],
        },
      ],
      attributes: [
        "id_p",
        "fk_id_tp_p",
        "orden_p",
        "guide_number_p",
        "profit_carrier_p",
        "profit_carrier_inter_city_p",
        "status_p",
        "direction_client_p",
        "createdAt",
        "total_price_p",
        "with_collection_p",
      ],
      order: [
        ["createdAt", "ASC"], // Sort by column 'column_name' in ascending order
      ],
    });
    // Process data for JSON response
    const formattedDataPackages = onTheWayPackage.map((p) => {
      // I validate type send package and decidate 1. Municipal send, 2. Inter-municipal send
      if (p.fk_id_tp_p == 1) {
        let type_send = p.fk_id_tp_p == 1 ? "Municipal" : "Nacional";
        let statusText;
        //1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino  5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a central
        switch (p.status_p) {
          case 7:
            statusText = "En camino de bodega dropshipper a central";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              address_origin:
                p.store.direction_store +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
          case 5:
            statusText = "En camino a entrega final";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              address_origin:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
              address_destiny:
                p.direction_client_p +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
        }
      } else if (p.fk_id_tp_p == 2) {
        let type_send = p.fk_id_tp_p == 1 ? "Municipal" : "Nacional";
        let statusText;
        //1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino  5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a central
        switch (p.status_p) {
          case 7:
            statusText = "En camino de bodega dropshipper a central";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              address_origin:
                p.store.direction_store +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
            };
            break;
          case 3:
            statusText = "En camino entre bodegas centrales";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_inter_city_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              address_origin:
                p.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
          case 5:
            statusText = "En camino a entrega final";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              address_origin:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
              address_destiny:
                p.direction_client_p +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
        }
      }
    });
    // logger control proccess
    logger.info("On the way packages successfuly");
    // The credentials are incorrect
    res.json({
      message: "On the way packages successfuly",
      result: 1,
      data_packages: formattedDataPackages,
    });
  } catch (e) {
    // logger control proccess
    logger.info("Error on the way  packages: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// Method packages detail
export async function detailPackage(req, res) {
  // logger control proccess
  logger.info("enter the endpoint details packages");
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
          attributes: ["id_store", "direction_store"],
          include: [
            {
              model: City,
              attributes: ["id_city", "name_city"],
              include: [
                {
                  model: Central_warehouse,
                  attributes: ["id_cw", "name_cw", "direction_cw"],
                },
                {
                  model: Department,
                  attributes: ["id_d", "name_d"],
                },
              ],
            },
          ],
        },
        {
          model: City,
          attributes: ["id_city", "name_city"],
          include: [
            {
              model: Central_warehouse,
              attributes: ["id_cw", "name_cw", "direction_cw"],
            },
            {
              model: Department,
              attributes: ["id_d", "name_d"],
            },
          ],
        },
      ],
      attributes: [
        "id_p",
        "fk_id_tp_p",
        "orden_p",
        "name_client_p",
        "phone_number_client_p",
        "email_client_p",
        "guide_number_p",
        "profit_carrier_p",
        "profit_carrier_inter_city_p",
        "status_p",
        "direction_client_p",
        "createdAt",
        "total_price_p",
        "with_collection_p",
        "comments_p",
      ],
    });
    // Process data for JSON response
    const formattedDataPackages = detailPackage.map((p) => {
      // I validate type send package and decidate 1. Municipal send, 2. Inter-municipal send
      if (p.fk_id_tp_p == 1) {
        let type_send = p.fk_id_tp_p == 1 ? "Municipal" : "Nacional";
        let statusText;
        //1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino  5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a central
        switch (p.status_p) {
          case 1:
            statusText = "Bodega dropshipper";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              name_client_p: p.name_client_p,
              phone_number_client_p: p.phone_number_client_p,
              email_client_p: p.email_client_p,
              comments: p.comments_p,
              address_origin:
                p.store.direction_store +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
          case 7:
            statusText = "En camino de bodega dropshipper a central";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              name_client_p: p.name_client_p,
              phone_number_client_p: p.phone_number_client_p,
              email_client_p: p.email_client_p,
              comments: p.comments_p,
              address_origin:
                p.store.direction_store +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
          case 4:
            statusText = "En bodega central destino";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              name_client_p: p.name_client_p,
              phone_number_client_p: p.phone_number_client_p,
              email_client_p: p.email_client_p,
              comments: p.comments_p,
              address_origin:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
              address_destiny:
                p.direction_client_p +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
          case 5:
            statusText = "En camino a entrega final";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              name_client_p: p.name_client_p,
              phone_number_client_p: p.phone_number_client_p,
              email_client_p: p.email_client_p,
              comments: p.comments_p,
              address_origin:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
              address_destiny:
                p.direction_client_p +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
        }
      } else if (p.fk_id_tp_p == 2) {
        let type_send = p.fk_id_tp_p == 1 ? "Municipal" : "Nacional";
        let statusText;
        //1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino  5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a central
        switch (p.status_p) {
          case 1:
            statusText = "En bodega dropshipper";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              name_client_p: p.name_client_p,
              phone_number_client_p: p.phone_number_client_p,
              email_client_p: p.email_client_p,
              comments: p.comments_p,
              address_origin:
                p.store.direction_store +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
            };
            break;
          case 7:
            statusText = "En camino de bodega dropshipper a central";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              name_client_p: p.name_client_p,
              phone_number_client_p: p.phone_number_client_p,
              email_client_p: p.email_client_p,
              with_collection_p: p.with_collection_p,
              comments: p.comments_p,
              address_origin:
                p.store.direction_store +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
            };
            break;
          case 2:
            statusText = "En bodega central origen";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_inter_city_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              name_client_p: p.name_client_p,
              phone_number_client_p: p.phone_number_client_p,
              email_client_p: p.email_client_p,
              comments: p.comments_p,
              address_origin:
                p.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
          case 3:
            statusText = "En camino entre bodegas centrales";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_inter_city_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              name_client_p: p.name_client_p,
              phone_number_client_p: p.phone_number_client_p,
              email_client_p: p.email_client_p,
              comments: p.comments_p,
              address_origin:
                p.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.store.city.name_city +
                " - " +
                p.store.city.department.name_d,
              address_destiny:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
          case 4:
            statusText = "En bodega central destino";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              name_client_p: p.name_client_p,
              phone_number_client_p: p.phone_number_client_p,
              email_client_p: p.email_client_p,
              comments: p.comments_p,
              address_origin:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
              address_destiny:
                p.direction_client_p +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
          case 5:
            statusText = "En camino a entrega final";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.createdAt instanceof Date
                ? p.createdAt.toISOString()
                : p.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_p: p.id_p,
              type_send,
              status_p: statusText,
              order_number: p.orden_p,
              date_created_p,
              profit_for_carrier: p.profit_carrier_p,
              total_price_p: p.total_price_p,
              with_collection_p: p.with_collection_p,
              name_client_p: p.name_client_p,
              phone_number_client_p: p.phone_number_client_p,
              email_client_p: p.email_client_p,
              comments: p.comments_p,
              address_origin:
                p.city.central_warehouses[0].direction_cw +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
              address_destiny:
                p.direction_client_p +
                " - " +
                p.city.name_city +
                " - " +
                p.city.department.name_d,
            };
            break;
        }
      }
    });
    // logger control proccess
    logger.info("Details package successfuly");
    // The credentials are incorrect
    res.json({
      message: "Details package successfuly",
      result: 1,
      data_packages: formattedDataPackages,
    });
  } catch (e) {
    // logger control proccess
    logger.info("Error details package: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// Method to deliver packages Carriers
export async function deliverPackage(req, res) {
  // logger control proccess
  logger.info("Enter the endpoint deliver packages");
  try {
    // I validate error file empty
    if (!req.files) return res.status(400).json({ error: "No file provided" });
    // capture the id that comes in the parameters of the req
    const { id_p, type_evidence } = req.body;
    // I validate req correct json
    if (!id_p) return res.sendStatus(400);
    // I call and save the result of the findOne method, which is d sequelize
    const data_package = await Package.findOne({
      where: {
        id_p,
      },
      attributes: [
        "id_p",
        "status_p",
        "fk_id_tp_p",
        "confirmation_carrier_p",
        "fk_id_carrier_p",
        "profit_carrier_p",
        "profit_carrier_inter_city_p",
        "profit_dropshipper_p",
        "with_collection_p",
        "fk_id_store_p",
        "total_price_p",
      ],
      include: [
        {
          model: Store,
          attributes: ["id_store", "direction_store"],
          include: [
            {
              model: Dropshipper,
              attributes: ["id_dropshipper"],
            },
          ],
        },
      ],
    });
    let data_p, data_e, data_g, newHistory, newPortfolioDropshipper; // Declare data_p at a higher scope
    const type_send = data_package.fk_id_tp_p; // Declare type_send at a higher scoper and simple writing in validations
    const id_carrier_asignate = data_package.fk_id_carrier_p;
    // I capture the variables i need.
    let profit_carrier_p = data_package.profit_carrier_p;
    let profit_carrier_inter_city_p = data_package.profit_carrier_inter_city_p;
    let profit_dropshipper_p = data_package.profit_dropshipper_p;
    let with_collection_p = data_package.with_collection_p;
    let fk_id_store_p = data_package.fk_id_store_p;
    let total_price_p = data_package.total_price_p;
    let id_dropshipper = data_package.store.dropshipper.id_dropshipper;
    // Structure condition statys package and to change status baseded 1. type send municipal, 2- type send inter-municipal
    // 1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino 5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a bodega central
    if (type_send == 1) {
      switch (data_package.status_p) {
        case 7:
          data_e = loadEvidenceDataBase(req, id_p, type_evidence);
          data_p = deliverPackageCarrierDataBase(id_p, 4);
          data_g = accounting(
            id_carrier_asignate,
            4,
            profit_carrier_p,
            profit_dropshipper_p,
            with_collection_p,
            fk_id_store_p,
            total_price_p
          );
          // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
          newHistory = await Status_history.create({
            status_sh: 4,
            comentary_sh: "Entregado a bodega central ciudad destino",
            evidence_sh: "evidences_packages/" + req.files[0].filename,
            fk_id_carrier_asignated_sh: id_carrier_asignate,
            fk_id_p_sh: id_p,
          });
          // logger control proccess
          logger.info("Entregado a bodega central ciudad destino");

          break;

        case 5:
          data_e = loadEvidenceDataBase(req, id_p, type_evidence);
          data_p = deliverPackageCarrierDataBase(id_p, 6);
          data_g = accounting(
            id_carrier_asignate,
            6,
            profit_carrier_p,
            profit_dropshipper_p,
            with_collection_p,
            fk_id_store_p,
            total_price_p
          );
          // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
          newHistory = await Status_history.create({
            status_sh: 6,
            comentary_sh: "Entregado al cliente",
            evidence_sh: "evidences_packages/" + req.files[0].filename,
            fk_id_carrier_asignated_sh: id_carrier_asignate,
            fk_id_p_sh: id_p,
          });
          // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
          newPortfolioDropshipper = await Portfolios_history_dropshipper.create(
            {
              type_phd: "ENTRADA",
              monto_phd: total_price_p,
              description_phd: "Venta producto se entrega precio total",
              fk_id_dropshipper_phd: id_dropshipper,
            }
          );
          // logger control proccess
          logger.info("Entregado al cliente");

          break;

        default:
          break;
      }
    } else if (type_send == 2) {
      switch (data_package.status_p) {
        case 7:
          data_e = loadEvidenceDataBase(req, id_p, type_evidence);
          data_p = deliverPackageCarrierDataBase(id_p, 2);
          data_g = accounting(
            id_carrier_asignate,
            2,
            profit_carrier_p,
            profit_dropshipper_p,
            with_collection_p,
            fk_id_store_p,
            total_price_p
          );
          // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
          newHistory = await Status_history.create({
            status_sh: 2,
            comentary_sh: "Entregado a bodega central ciudad origen",
            evidence_sh: "evidences_packages/" + req.files[0].filename,
            fk_id_carrier_asignated_sh: id_carrier_asignate,
            fk_id_p_sh: id_p,
          });
          // logger control proccess
          logger.info("Entregado a bodega central ciudad origen");

          break;

        case 3:
          data_e = loadEvidenceDataBase(req, id_p, type_evidence);
          data_p = deliverPackageCarrierDataBase(id_p, 4);
          data_g = accounting(
            id_carrier_asignate,
            4,
            profit_carrier_inter_city_p,
            profit_dropshipper_p,
            with_collection_p,
            fk_id_store_p,
            total_price_p
          );
          // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
          newHistory = await Status_history.create({
            status_sh: 4,
            comentary_sh: "Entregado a bodega central ciudad destino",
            evidence_sh: "evidences_packages/" + req.files[0].filename,
            fk_id_carrier_asignated_sh: id_carrier_asignate,
            fk_id_p_sh: id_p,
          });
          // logger control proccess
          logger.info("Entregado a bodega central ciudad destino");

          break;

        case 5:
          data_e = loadEvidenceDataBase(req, id_p, type_evidence);
          data_p = deliverPackageCarrierDataBase(id_p, 6);
          data_g = accounting(
            id_carrier_asignate,
            6,
            profit_carrier_p,
            profit_dropshipper_p,
            with_collection_p,
            fk_id_store_p,
            total_price_p
          );
          // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
          newHistory = await Status_history.create({
            status_sh: 6,
            comentary_sh: "Entregado al cliente",
            evidence_sh: "evidences_packages/" + req.files[0].filename,
            fk_id_carrier_asignated_sh: id_carrier_asignate,
            fk_id_p_sh: id_p,
          });
          // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
          newPortfolioDropshipper = await Portfolios_history_dropshipper.create(
            {
              type_phd: "ENTRADA",
              monto_phd: total_price_p,
              description_phd: "Venta producto se entrega precio total",
              fk_id_dropshipper_phd: id_dropshipper,
            }
          );
          // logger control proccess
          logger.info("Entregado al cliente");
          break;

        default:
          break;
      }
    }
    // logger control proccess
    logger.info(
      `Deliver packages successfuly, Results: ${data_e}, ${data_p}, ${data_g}`
    );
    // The credentials are incorrect
    res.json({
      message: "Deliver packages successfuly",
      result: 1,
    });
  } catch (e) {
    // logger control proccess
    logger.info("Error deliver packages: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
    });
  }
}

// Method to report problem packages Carriers
export async function reportProblemPackage(req, res) {
  // logger control proccess
  logger.info("enter the endpoint report problem packages");
  try {
    // I validate error file empty
    if (!req.files) return res.status(400).json({ error: "No file provided" });
    // capture the id that comes in the parameters of the req
    const { id_p, type_evidence, comentary_sh, details_sh } = req.body;
    // I validate req correct json
    if (!id_p) return res.sendStatus(400);
    // I call and save the result of the findOne method, which is d sequelize
    const data_package = await Package.findOne({
      where: {
        id_p,
      },
      attributes: [
        "id_p",
        "status_p",
        "fk_id_tp_p",
        "confirmation_carrier_p",
        "fk_id_carrier_p",
      ],
    });
    if (data_package) {
      let data_p, data_e, newHistory; // Declare data_p at a higher scope
      const type_send = data_package.fk_id_tp_p; // Declare type_send at a higher scoper and simple writing in validations
      const id_carrier_asignate = data_package.fk_id_carrier_p;
      // Structure condition statys package and to change status baseded 1. type send municipal, 2- type send inter-municipal
      // 1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino 5.En camino a entrega 6. Entregado 7. En camino de bodega dropshipper a bodega central 0.cancelado
      if (type_send == 1) {
        data_e = loadEvidenceDataBase(req, id_p, type_evidence);
        data_p = deliverPackageCarrierDataBase(id_p, 0);
        // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
        // same status package, added 0. canceled
        newHistory = await Status_history.create({
          status_sh: 0,
          comentary_sh,
          details_sh,
          fk_id_carrier_asignated_sh: id_carrier_asignate,
          fk_id_p_sh: id_p,
        });
        // logger control proccess
        logger.info("History status registed successfully");
      } else if (type_send == 2) {
        data_e = loadEvidenceDataBase(req, id_p, type_evidence);
        data_p = deliverPackageCarrierDataBase(id_p, 0);
        // I declare the create method with its respective definition of the object and my history model in a variable taking into account the await
        newHistory = await Status_history.create({
          status_sh: 0,
          comentary_sh,
          details_sh,
          fk_id_carrier_asignated_sh: id_carrier_asignate,
          fk_id_p_sh: id_p,
        });
        // logger control proccess
        logger.info("History status registed successfully");
      }
      // logger control proccess
      logger.info("report problem registed successfuly");
      // The credentials are incorrect
      res.json({
        message: "report problem registed successfuly",
        result: 1,
      });
    } else {
      // logger control proccess
      logger.info("package not found");
      // I return the status 500 and the message I want
      res.status(404).json({
        message: "Not Found",
        result: 404,
      });
    }
  } catch (e) {
    // logger control proccess
    logger.info("Error report problem packages: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// method to payments request Carriers
export async function registerCarrierPaymentsRequest(req, res) {
  // logger control proccess
  logger.info("enter the endpoint register carrier payments request");
  // I save the variables that come to me in the request in variables.
  const { quantity_requested_cpr, fk_id_cba_cpr } = req.body;
  // I validate req correct json
  if (!quantity_requested_cpr || !fk_id_cba_cpr) return res.sendStatus(400);
  // I enclose everything in a try catch to control errors
  try {
    // I call and save the result of the findAll method, which is d sequelize
    const getCarrier = await Carrier_bank_account.findAll({
      where: {
        id_cba: fk_id_cba_cpr,
      },
      include: [
        {
          model: Carrier,
          attributes: ["id_carrier", "revenue_carrier", "debt_carrier"],
        },
      ],
      attributes: ["id_cba", "fk_id_carrier_cba"],
    });
    // I validate login exist
    if (getCarrier.length > 0) {
      if (getCarrier[0].carrier.debt_carrier == 0) {
        if (
          getCarrier[0].carrier.revenue_carrier >= quantity_requested_cpr &&
          quantity_requested_cpr > 0
        ) {
          //I capture variables relevants
          let newBalance =
            getCarrier[0].carrier.revenue_carrier - quantity_requested_cpr;
          let id_carrier = getCarrier[0].carrier.id_carrier;
          // I declare the create method with its respective definition of the object and my Carrier model in a variable taking into account the await
          // 1. Pagada 2. pendiente 3. rechazada
          let newRequest = await Carrier_payment_request.create(
            {
              quantity_requested_cpr,
              status_cpr: 2,
              date_created_cba: formattedTime,
              fk_id_cba_cpr,
            },
            {
              // I define the variables that I am going to insert into the database so that there are no conflicts with the definition of the id or the number of columns
              fields: [
                "quantity_requested_cpr",
                "status_cpr",
                "date_created_cba",
                "fk_id_cba_cpr",
              ],
            }
          );
          // valid if everything went well in the INSERT
          if (newRequest) {
            // I find carrier and update revenue carrier
            let updateBalance = await Carrier.findOne({
              where: {
                id_carrier,
              },
            });
            // Valid carrier found!
            if (updateBalance) {
              // Setting new balance
              updateBalance.set({
                revenue_carrier: newBalance,
              });
              // Save the setting revenue
              updateBalance.save();
            }
            // logger control proccess
            logger.info("Carrier payments request registed successfully");
            // I return the json with the message I want
            return res.json({
              message: "Carrier payments request registed successfully",
              result: 1,
              data: {
                newBalance,
              },
            });
          }
        } else {
          // logger control proccess
          logger.info(
            "Requesting a value greater than what it has or Requesting a value negative."
          );
          // I return the status 500 and the message I want
          res.status(200).json({
            message:
              "Requesting a value greater than what it has or Requesting a value negative.",
            result: 5,
          });
        }
      } else {
        // I return the status 500 and the message I want
        res.status(200).json({
          message: "The carrier has debt",
          result: 6,
        });
      }
    } else {
      // I return the status 500 and the message I want
      res.status(404).json({
        message: "The carrier non-existing",
        result: 7,
      });
    }
  } catch (e) {
    // logger control proccess
    logger.info("Error registerCarrier: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
    });
  }
}

// Method get history Carriers
export async function getHistory(req, res) {
  // logger control proccess
  logger.info("enter the endpoint carrier history");
  try {
    // capture the id that comes in the parameters of the req
    const { id_carrier } = req.body;
    // I validate req correct json
    if (!id_carrier) return res.sendStatus(400);
    // I call and save the result of the findAll method, which is d sequelize
    const getHistory = await Status_history.findAll({
      where: {
        fk_id_carrier_asignated_sh: id_carrier,
      },
      attributes: ["id_sh", "status_sh", "comentary_sh"],
      include: [
        {
          model: Package,
          attributes: [
            "id_p",
            "orden_p",
            "name_client_p",
            "phone_number_client_p",
            "email_client_p",
            "direction_client_p",
            "guide_number_p",
            "status_p",
            "profit_carrier_p",
            "profit_carrier_inter_city_p",
            "with_collection_p",
            "total_price_p",
            "createdAt",
            "fk_id_tp_p",
          ],
          include: [
            {
              model: Store,
              attributes: ["id_store", "direction_store"],
              include: [
                {
                  model: City,
                  attributes: ["id_city", "name_city"],
                  include: [
                    {
                      model: Central_warehouse,
                      attributes: ["id_cw", "name_cw", "direction_cw"],
                    },
                    {
                      model: Department,
                      attributes: ["id_d", "name_d"],
                    },
                  ],
                },
              ],
            },
            {
              model: City,
              attributes: ["id_city", "name_city"],
              include: [
                {
                  model: Central_warehouse,
                  attributes: ["id_cw", "name_cw", "direction_cw"],
                },
                {
                  model: Department,
                  attributes: ["id_d", "name_d"],
                },
              ],
            },
          ],
        },
      ],
      order: [
        ["createdAt", "DESC"], // Sort by column 'column_name' in ascending order
      ],
    });
    // Process data for JSON response
    const formattedData = getHistory.map((p) => {
      // I validate type send package and decidate 1. Municipal send, 2. Inter-municipal send
      if (p.package.fk_id_tp_p == 1) {
        let type_send = p.fk_id_tp_p == 1 ? "Municipal" : "Nacional";
        let statusText;
        //1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino  5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a central
        switch (p.status_sh) {
          case 0:
            statusText = "CANCELADO";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.store.direction_store +
                " - " +
                p.package.store.city.name_city +
                " - " +
                p.package.store.city.department.name_d,
              address_destiny:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
          case 1:
            statusText = "Bodega dropshipper";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.store.direction_store +
                " - " +
                p.package.store.city.name_city +
                " - " +
                p.package.store.city.department.name_d,
              address_destiny:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
          case 7:
            statusText = "En camino a bodega central";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.store.direction_store +
                " - " +
                p.package.store.city.name_city +
                " - " +
                p.package.store.city.department.name_d,
              address_destiny:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
          case 4:
            statusText = "En bodega central destino";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
              address_destiny:
                p.package.direction_client_p +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
          case 5:
            statusText = "En camino a entrega final";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
              address_destiny:
                p.package.direction_client_p +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
          case 6:
            statusText = "Entregado";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
              address_destiny:
                p.package.direction_client_p +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
        }
      } else if (p.package.fk_id_tp_p == 2) {
        let type_send = p.package.fk_id_tp_p == 1 ? "Municipal" : "Nacional";
        let statusText;
        //1.Bodega dropshipper 2.Bodega central origen 3. En camino entre bodegas centrales 4. En bodega central destino  5.En camino a entrega final 6. Entregado 7. En camino de bodega dropshipper a central
        switch (p.status_sh) {
          case 0:
            statusText = "CANCELADO";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.store.direction_store +
                " - " +
                p.package.store.city.name_city +
                " - " +
                p.package.store.city.department.name_d,
              address_destiny:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
          case 1:
            statusText = "En bodega dropshipper";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.store.direction_store +
                " - " +
                p.package.store.city.name_city +
                " - " +
                p.package.store.city.department.name_d,
              address_destiny:
                p.package.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.store.city.name_city +
                " - " +
                p.package.store.city.department.name_d,
            };
            break;
          case 7:
            statusText = "En camino a bodega central ciudad origen";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.store.direction_store +
                " - " +
                p.package.store.city.name_city +
                " - " +
                p.package.store.city.department.name_d,
              address_destiny:
                p.package.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.store.city.name_city +
                " - " +
                p.package.store.city.department.name_d,
            };
            break;
          case 2:
            statusText = "En bodega central origen";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_inter_city_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.store.city.name_city +
                " - " +
                p.package.store.city.department.name_d,
              address_destiny:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
          case 3:
            statusText = "En camino entre bodegas centrales";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_inter_city_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.store.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.store.city.name_city +
                " - " +
                p.package.store.city.department.name_d,
              address_destiny:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
          case 4:
            statusText = "En bodega central destino";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
              address_destiny:
                p.package.direction_client_p +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
          case 5:
            statusText = "En camino entrega final";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
              address_destiny:
                p.package.direction_client_p +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
          case 6:
            statusText = "Entregado";
            // Convertir la fecha a una cadena ISO si es un objeto Date
            var fechaISO =
              p.package.createdAt instanceof Date
                ? p.package.createdAt.toISOString()
                : p.package.createdAt;
            // Ahora sí, formatear la cadena
            var date_created_p = fechaISO.slice(0, 19).replace("T", " ");
            // Definate response orden fine JSON
            return {
              id_sh: p.id_sh,
              status_sh: statusText,
              comentary_sh: p.comentary_sh,
              id_p: p.package.id_p,
              type_send,
              order_number: p.package.orden_p,
              date_created_p,
              profit_for_carrier: p.package.profit_carrier_p,
              total_price_p: p.package.total_price_p,
              with_collection_p: p.package.with_collection_p,
              address_origin:
                p.package.city.central_warehouses[0].direction_cw +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
              address_destiny:
                p.package.direction_client_p +
                " - " +
                p.package.city.name_city +
                " - " +
                p.package.city.department.name_d,
            };
            break;
        }
      }
    });
    // logger control proccess
    logger.info("Get carrier history successfuly");
    // The credentials are incorrect
    res.json({
      message: "Get carrier history successfuly",
      result: 1,
      data: formattedData,
    });
  } catch (e) {
    // logger control proccess
    logger.info("Error Get carrier history: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
    });
  }
}

// Method put Account Carriers
export async function putAccounts(req, res) {
  // logger control proccess
  logger.info("enter the endpoint carrier history");
  try {
    // capture the id that comes in the parameters of the req
    const { id_carrier } = req.params;
    const {
      bancolombia_number_account_carrier,
      nequi_carrier,
      daviplata_carrier,
    } = req.body;
    // I validate error file empty
    if (!req.files) return res.status(400).json({ error: "No file provided" });
    // I validate req correct json
    if (!id_carrier) return res.sendStatus(400);
    let error = false;
    // Run files array and insert in database the documents
    req.files.forEach(async (document) => {
      // update status carrier
      const updateQR = await Carrier.findOne({
        where: {
          id_carrier,
        },
      });
      updateQR.set({
        url_QR_carrier: "documents_carrier/" + document.filename,
      });
      await updateQR.save();
      if (!updateQR) error = true;
    });
    // valid if everything went well in the INSERT
    if (error) {
      // Devolver un JSON con un mensaje de error
      return res.status(400).json({
        message: "Error load accounts carrier qr, nequi, daviplata",
        result: 0,
      });
    }
    // update status carrier
    const updateAnotherAccount = await Carrier.findOne({
      where: {
        id_carrier,
      },
    });
    updateAnotherAccount.set({
      bancolombia_number_account_carrier,
      nequi_carrier,
      daviplata_carrier,
    });
    await updateAnotherAccount.save();
    // logger control proccess
    logger.info(
      "Carrier accounts nequi, daviplata, etc... registed successfully"
    );
    // I return the json with the message I want
    return res.json({
      message:
        "Carrier accounts nequi, daviplata, etc... registered successfully",
      result: 1,
      data: updateAnotherAccount,
      data_qr: req.files.map((file) => ({
        filename: file.filename,
        mimetype: file.mimetype,
      })),
    });
  } catch (e) {
    // logger control proccess
    logger.info("Error accounts Nequi; etc...: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
      data: {},
    });
  }
}

// Method getPassword Carriers
export async function getPassword(req, res) {
  // logger control proccess
  logger.info("enter the endpoint getPassword");
  try {
    // capture the id that comes in the parameters of the req
    const { email_carrier } = req.body;
    // I validate req correct json
    if (!email_carrier) return res.sendStatus(400);
    // I call and save the result of the findOne method, which is d sequelize
    const getCarrier = await Carrier.findOne({
      where: {
        email_carrier,
      },
      attributes: ["id_carrier", "password_carrier"],
    });
    // I validate getPassword exist
    if (getCarrier) {
      // capture the password
      let password = getCarrier.password_carrier;
      // setting emil config
      const transporter = nodemailer.createTransport({
        host: "email-smtp.us-east-2.amazonaws.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "AKIAZI2LGUNBFB2GMXHZ",
          pass: "BEODRgZWGsqgI4BUbY3vM/gkQ1jhqvmly4BVPOWcEWn7",
        },
      });
      // call method to send email
      main(transporter, email_carrier, password).catch(console.error);
      // logger control proccess
      logger.info("Email found, get password correct");
      // The carrier exists and the credentials are correct
      res.json({
        message: "Email found, get password correct",
        result: 1,
      });
    } else {
      // logger control proccess
      logger.info("Non-existent credenciales");
      // The credentials are incorrect
      res.status(404).json({
        message: "Non-existent credenciales",
        result: 404,
      });
    }
  } catch (e) {
    // logger control proccess
    logger.info("Error GetPassword: " + e);
    // I return the status 500 and the message I want
    res.status(500).json({
      message: "Something goes wrong",
      result: 0,
    });
  }
}

/*===========================================================================================
                                    Assistent Methods
===========================================================================================*/
// async..await is not allowed in global scope, must use a wrapper
async function main(transporter, correo, password) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "ingenieria@diegoarbelaez.com", // sender address
    to: correo, // list of receivers
    subject: "Enviando email", // Subject line
    text: "Todo funcionando correctamente", // plain text body
    html: "<b>" + password + "</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// Method that helps me change the carrier confirmation flags and the status of the package
async function confirmAndStatus(id_p, status) {
  // I call and save the result of the findOne method, which is d sequelize
  const data_package = await Package.findOne({
    where: {
      id_p,
    },
    attributes: ["id_p", "status_p", "confirmation_carrier_p"],
  });

  data_package.set({
    confirmation_carrier_p: 1,
    status_p: status,
  });
  await data_package.save();
  //return result
  return "all OK";
}

// Method that helps me change the carrier confirmation flags and the status of the package
async function deliverPackageCarrierDataBase(id_p, status) {
  // I call and save the result of the findOne method, which is d sequelize
  const data_package = await Package.findOne({
    where: {
      id_p,
    },
    attributes: ["id_p", "status_p", "confirmation_carrier_p"],
  });

  data_package.set({
    confirmation_carrier_p: 0,
    status_p: status,
    fk_id_carrier_p: null,
  });
  await data_package.save();
  //return result
  return "All OK";
}

// Method that helps me change the carrier confirmation flags and the status of the package
async function loadEvidenceDataBase(req, id_p, type_evidence) {
  let error = false;
  let newEvidence;
  // Run files array and insert in database the documents
  req.files.forEach(async (evidence) => {
    // I declare the create method with its respective definition of the object and my Carrier model in a variable taking into account the await
    newEvidence = await Evidence.create({
      url_image_evidence: "evidences_packages/" + evidence.filename,
      date_created_evidence: formattedTime,
      fk_id_p_evidence: id_p,
      fk_id_type_evidence_evidence: type_evidence,
    });
    if (!newEvidence) error = true;
  });
  // valid if everything went well in the INSERT
  if (error) {
    // Devolver un JSON con un mensaje de error
    return res.status(400).json({
      message: "Error load evidence package",
      result: 0,
    });
  }
  //return result
  return newEvidence;
}

// Method that helps accounting the flow delivering.
async function accounting(
  id_carrier_asignate,
  status,
  profit_carrier_p,
  profit_dropshipper_p,
  with_collection_p,
  fk_id_store_p,
  total_price_p
) {
  // I validate status = 6, it is mean the package delivered to the client
  if (status == 6) {
    // I make all earnings updates with their respective validations.
    // if with_collection_p = 1 means package with collection
    if (with_collection_p == 1) {
      // I find the carrier and atributtes him
      const getCarrier = await Carrier.findOne({
        where: {
          id_carrier: id_carrier_asignate,
        },
        attributes: ["id_carrier", "revenue_carrier", "debt_carrier"],
      });
      let revenue = getCarrier.revenue_carrier;
      let debt = getCarrier.debt_carrier;
      let result_renueve = revenue + profit_carrier_p;
      let result_debt = debt + total_price_p;
      // Setting and update Carrier
      getCarrier.set({
        revenue_carrier: result_renueve,
        debt_carrier: result_debt,
      });
      // UPDATE CARRIER
      await getCarrier.save();
      // i find store that i give id_dropshipper
      const getStore = await Store.findOne({
        where: {
          id_store: fk_id_store_p,
        },
        attributes: ["id_store", "fk_id_dropshipper_store"],
      });
      // I capture the id_dopshipper
      let id_dropshipper = getStore.fk_id_dropshipper_store;
      // i find Dropshipper update wallet
      const getDropshipper = await Dropshipper.findOne({
        where: {
          id_dropshipper,
        },
        attributes: [
          "id_dropshipper",
          "wallet_dropshipper",
          "total_sales_dropshipper",
        ],
      });
      let wallet = getDropshipper.wallet_dropshipper;
      let total_sales = getDropshipper.total_sales_dropshipper;
      let result_wallet = wallet + profit_dropshipper_p;
      let result_total_sales = total_sales + total_price_p;
      // Setting and update Dropshipper
      getDropshipper.set({
        wallet_dropshipper: result_wallet,
        total_sales_dropshipper: result_total_sales,
      });
      // UPDATE dropshipper
      await getDropshipper.save();
    } else if (with_collection_p == 0) {
      // if with_collection_p = 0 means package without collection
      const getCarrier = await Carrier.findOne({
        where: {
          id_carrier: id_carrier_asignate,
        },
        attributes: ["id_carrier", "revenue_carrier"],
      });
      let revenue = getCarrier.revenue_carrier;
      let result_renueve = revenue + profit_carrier_p;
      // Setting and update Carrier
      getCarrier.set({
        revenue_carrier: result_renueve,
      });
      // UPDATE CARRIER
      await getCarrier.save();
    }
    // logger control proccess
    logger.info("Carrier transports package to Client, all accounting ok.");
    //return result
    return "All ok";
  } else {
    // I find carrier and update revenue_carrier
    const getCarrier = await Carrier.findOne({
      where: {
        id_carrier: id_carrier_asignate,
      },
      attributes: ["id_carrier", "revenue_carrier"],
    });
    let revenue = getCarrier.revenue_carrier;
    let result_renueve = revenue + profit_carrier_p;
    // Setting and update Carrier
    getCarrier.set({
      revenue_carrier: result_renueve,
    });
    // UPDATE CARRIER
    await getCarrier.save();
    // logger control proccess
    logger.info(
      "Carrier transports package to central warehouse of origin or destination, all accounting ok"
    );
    //return result
    return "All ok";
  }
}
