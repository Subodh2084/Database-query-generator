import crypto from "crypto";

class CryptoHelper {
  public defaultAlgorithm: string;
  public key: Buffer<ArrayBufferLike>;
  public iv: Buffer<ArrayBufferLike>;

  constructor() {
    this.defaultAlgorithm = "aes-256-cbc";
    this.key = crypto.randomBytes(32);
    this.iv = crypto.randomBytes(16);
  }

  private createCipherText(): crypto.Cipheriv {
    const cipher = crypto.createCipheriv(
      this.defaultAlgorithm,
      Buffer.from(this.key),
      this.iv
    );
    return cipher;
  }

  private createDecipherText() {
    const decipher = crypto.createDecipheriv(
      this.defaultAlgorithm,
      Buffer.from(this.key),
      this.iv
    );
    return decipher;
  }

  public encryptKeys(text: string = "user") {
    let cipherText = this.createCipherText();
    let encryptedText = cipherText.update(text, "utf-8", "hex");
    encryptedText += cipherText.final("hex");
    return {
      encryptedData: encryptedText,
      iv: this.iv.toString("hex"),
    };
  }

  public decrpytKeys(encrpyedData: string, ivHex: string) {
    let decipher = this.createDecipherText();
    let decrypted = decipher.update(encrpyedData, "hex", "utf-8");
    decrypted += decipher.final("hex");
    return decipher;
  }
}

export default CryptoHelper;
