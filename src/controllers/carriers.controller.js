// I import the modules that need to be customized like the models or installed with npm
import jwt from "jsonwebtoken";
import { Carrier } from '../models/carriers.model.js';
import { Carrier_document } from '../models/carrier_documents.model.js';
import moment from 'moment-timezone';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();
// capture the exact time in my time zone using the moment-timezone module, I do this capture outside the methods to reuse this variable
const bogotaTime = moment.tz('America/Bogota');
const formattedTime = bogotaTime.format('YYYY-MM-DD HH:mm:ss');
// Firme private secret jwt
const secret = process.env.SECRET;

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
            attributes: ['id_carrier', 'name_carrier', 'email_carrier', 'active_carrier', 'last_login_carrier']
        });
        // I validate login exist
        if (loginCarrier.length > 0) {
            // realiazr la validacion si el usuario esta activado para poder hacer el login
            if (loginCarrier[0].active_carrier === 1) {
                // Token Payload
                const payload = {
                    id_carrier: loginCarrier[0].id_carrier,
                    name_carrier: loginCarrier[0].name_carrier
                };
                // I Create json web token for return him in json response
                const token = jwt.sign(payload, secret, { expiresIn: '1h' });
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
                res.status(401).json({ message: 'User Disabled' });
            }
        } else {
            // logger control proccess
            logger.info('Incorrect credentials');
            // The credentials are incorrect
            res.status(401).json({ message: 'Incorrect credentials' });
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

// method to register Carriers
export async function register(req, res) {
    // logger control proccess
    logger.info('enter the endpoint registerProduct');
    // I save the variables that come to me in the request in variables.
    const { name_carrier, last_name_carrier, phone_number_carrier, email_carrier, password_carrier } = req.body;
    // I validate req correct json
    if (!name_carrier || !last_name_carrier || !phone_number_carrier || !email_carrier || !password_carrier) return res.sendStatus(400);
    // I enclose everything in a try catch to control errors
    try {
        // I declare the create method with its respective definition of the object and my Carrier model in a variable taking into account the await
        let newCarrier = await Carrier.create({
            name_carrier,
            last_name_carrier,
            phone_number_carrier,
            email_carrier,
            password_carrier,
            active_carrier: 4,
            date_created_carrier: formattedTime
        },
            {
                // I define the variables that I am going to insert into the database so that there are no conflicts with the definition of the id or the number of columns
                fields: ['name_carrier', 'last_name_carrier', 'phone_number_carrier', 'email_carrier', 'password_carrier', 'active_carrier', 'date_created_carrier']
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

// method to register Carriers
export function loadDocuments(req, res) {
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
                description_cd: 'Legal document carrier',
                url_cd: document.filename,
                type_document_cd: 'legal',
                date_created_cd: formattedTime,
                fk_id_carrier_cd: id_carrier
            });
            if (!newDocument) error = true;
        });
        // valid if everything went well in the INSERT
        if (error) {
            // Devolver un JSON con un mensaje de error
            return res.status(400).json({ message: 'Error', result: 0 });
        }
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