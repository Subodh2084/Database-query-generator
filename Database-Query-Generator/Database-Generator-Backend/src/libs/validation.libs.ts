import { HTTP_STATUS } from "../constant/http-constant";
import { HttpExceptions, ValidationException } from "../exceptions";
import { IFileContent } from "../interface/file.interface";
import { getObjectValue } from "../utils/common.utils";
import { checkEncoding, checkMimeType, checkSize } from "../utils/file.utils";

async function processFileValidation(
  fileContent: IFileContent
): Promise<boolean> {
  let allValid = true;
  return new Promise(async (resolve, reject) => {
    try {
      const mimeTypeValidation = await checkMimeType(
        getObjectValue(fileContent, "mimetype")
      );

      if (typeof mimeTypeValidation === "boolean" && !mimeTypeValidation) {
        throw new ValidationException(
          HTTP_STATUS.VALIDATION_ERROR.CODE,
          `You Have Entered the Invalid File Having the Mime Type ${getObjectValue(
            fileContent,
            "mimetype"
          )}, Please Upload PNG Content`
        );
      }

      const encodingValidation = await checkEncoding(
        getObjectValue(fileContent, "encoding")
      );

      if (typeof encodingValidation === "boolean" && !encodingValidation) {
        throw new ValidationException(
          HTTP_STATUS.VALIDATION_ERROR.CODE,
          `The File you Upload Does not have Appropriate Encoding, The Uploaded Encoding is ${getObjectValue(
            fileContent,
            "encoding"
          )}`
        );
      }

      const sizeValidation = await checkSize(
        getObjectValue(fileContent, "size")
      );

      if (typeof sizeValidation === "boolean" && !sizeValidation) {
        throw new ValidationException(
          HTTP_STATUS.VALIDATION_ERROR.CODE,
          `The File you Upload is Empty`
        );
      }

      resolve(true);
    } catch (err: any) {
      reject(err);
    }
  });
}

export default processFileValidation;
