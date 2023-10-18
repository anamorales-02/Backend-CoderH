import multer from "multer";

// Configuración de almacenamiento para cargas de archivos
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Cambiar la carpeta de destino si es necesario
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Cambiar el nombre del archivo si es necesario
  },
});

// Middleware de multer con la configuración personalizada
export const fileUploader = multer({ storage: fileStorage });
