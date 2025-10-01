import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) cb(null, true);
  else cb(null, false, new Error("Solo imágenes permitidas"));
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
