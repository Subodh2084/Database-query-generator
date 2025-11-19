import path from "path";
import fs from "fs";
import { UnkownAny } from "../types/common.types";
import sqlLogger from "../libs/common.logger";

class FileHelper {
  public folderPath: string = path.join(process.cwd(), "uploads");

  public async clearFolderUploads() {
    try {
      const allFiles = fs.readdirSync(this.folderPath);
      if (Array.isArray(allFiles) && allFiles.length > 0) {
        sqlLogger.info(`The Uploaded Path are Deleting....`);
        for (const file of allFiles) {
          const uploadedPath = path.join(this.folderPath, file);
          fs.unlinkSync(uploadedPath);
        }
      }
      sqlLogger.info(`The Uploaded Path Does not have any Files`);
      return true;
    } catch (err: UnkownAny) {
      sqlLogger.error(`Error Clearing all the Uploaded Path Due to ${err}`);
      process.exit(1);
    }
  }
}

export default FileHelper;
