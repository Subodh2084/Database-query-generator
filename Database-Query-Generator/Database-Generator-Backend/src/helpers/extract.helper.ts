import { createWorker } from "tesseract.js";
import sqlLogger from "../libs/common.logger";

class TesseractHelper {
  public async extractTextFromImage(imagePath: string) {
    const worker = await createWorker("eng");
    try {
      const {
        data: { text },
      } = await worker.recognize(imagePath);
      return text;
    } catch (error) {
      sqlLogger.error("Error during OCR:", error);
      return null;
    } finally {
      await worker.terminate();
    }
  }
}

export default TesseractHelper;
