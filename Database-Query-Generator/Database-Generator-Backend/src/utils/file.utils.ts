function checkMimeType(mimeType: string) {
  return new Promise((resolve, reject) => {
    const validMimeTypes = ["png", "jpeg"];
    const contentType = mimeType.split("/")[1];
    const isAllowedMimeTypes = validMimeTypes.includes(contentType);
    resolve(isAllowedMimeTypes);
  });
}

function checkEncoding(encoding: string) {
  return new Promise((resolve, reject) => {
    resolve(encoding.endsWith("bit") && !encoding.startsWith("0"));
  });
}

function checkSize(size: number) {
  return new Promise((resolve, reject) => {
    const sizeNumber = typeof size === "number" ? size : 0;
    resolve(!sizeNumber.toString().startsWith("0"));
  });
}

export { checkEncoding, checkMimeType, checkSize };
