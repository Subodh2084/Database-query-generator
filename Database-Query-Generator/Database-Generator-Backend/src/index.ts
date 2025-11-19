import startExpressApp from "./server";
import FileHelper from "./helpers/file.helper";

(async () => {
  const fileInstance = new FileHelper();
  fileInstance.clearFolderUploads().then(async () => {
    await startExpressApp();
  });
})();
