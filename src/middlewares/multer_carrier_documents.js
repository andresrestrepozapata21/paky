// Import modules multer and setting configurations path
import multer from 'multer';
import { dirname, join, extname } from "path";
import { fileURLToPath } from 'url';
import logger from "../utils/logger.js";
/**
 * @api {POST} PAKY
 * @apiName PAKY
 * @apiGroup PAKY
 * @apiDescription Setting of Multer for load documents carrier in middlesware
 *
 * @apiSuccess message and data login
 */
// Capture meta folder
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
// Define extensions allowed
const MIMETYPES = [
    // Imágenes
    'image/jpeg',  // JPEG
    'image/jpg',   // JPG
    'image/png',   // PNG
    'image/gif',   // GIF
    'image/bmp',   // BMP
    'image/webp',  // WebP
    'image/tiff',  // TIFF
    'image/svg+xml', // SVG
    'image/x-icon', // ICO

    // PDFs
    'application/pdf', // PDF
];
// Define object multer in variable and setting configurations
const multerUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = join(CURRENT_DIR, '../../documents_carrier');
            cb(null, uploadPath);
            logger.info(`File will be stored in ${uploadPath}`);
        },
        filename: (req, file, cb) => {
            const fileExtension = extname(file.originalname);
            const fileName = file.originalname.split(fileExtension)[0];
            const newFileName = `${fileName}-${Date.now()}${fileExtension}`;
            cb(null, newFileName);
            logger.info(`File ${file.originalname} renamed to ${newFileName}`);
        }
    }),
    dest: join(CURRENT_DIR, '../../documents_carrier'),
    fileFilter: (req, file, cb) => {
        if (MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
            logger.info(`File type ${file.mimetype} is allowed`);
        } else {
            cb(new Error(`Only ${MIMETYPES.join(' ')} mimetypes are allowed.`));
            logger.error(`File type ${file.mimetype} is not allowed`);
        }
    },
    limits: {
        fieldSize: 50000000
    }
});
// Export my variable multer
export default multerUpload;