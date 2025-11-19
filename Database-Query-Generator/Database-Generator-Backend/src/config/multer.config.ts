import multer from "multer";
import path from "path";
import fs from "fs";
import sqlLogger from "../libs/common.logger";

const uploadedFile = path.join(process.cwd(), "uploads");
const isFileExists = fs.existsSync(uploadedFile);

if (isFileExists) {
  sqlLogger.info(
    `File Does not Exists, Creating the File on the ${uploadedFile}`
  );

   ;
}

const storage = multer.diskStorage({
  destination: uploadedFile,
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
});

export default upload;
