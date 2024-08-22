// Import modules multer and setting configurations path
import multer from 'multer';
import { dirname, join, extname } from "path";
import { fileURLToPath } from 'url';
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
        destination: join(CURRENT_DIR, '../../documents_carrier'),
        filename: (req, file, cb) => {
            const fileExtension = extname(file.originalname);
            const fileName = file.originalname.split(fileExtension)[0];
            cb(null, `${fileName}-${Date.now()}${fileExtension}`);
        }
    }),
    dest: join(CURRENT_DIR, '../../documents_carrier'),
    fileFilter: (req, file, cb) => {
        // Validate mimetypes of documents
        if (MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Only ${MIMETYPES.join(' ')} mimetypes are allowed.`));
        }
    },
    limits: {
        fieldSize: 50000000
    }
});
// Export my variable multer
export default multerUpload;