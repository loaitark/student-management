const fs = require("fs");

const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const multerFileUpload = (fileDest) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cd) {
      const path = `./uploads/${fileDest}`;
      if (!fs.existsSync(path)) {
        if (!fs.existsSync("./uploads")) {
          fs.mkdirSync("./uploads");
        }
        fs.mkdirSync(path);
      }
      cd(null, path);
    },
    filename: function (req, file, cd) {
      const ext = file.mimetype.split("/")[1];
      const uniqeUuid = `${fileDest}-${Date.now()}-${uuidv4()}.${ext}`;
      req.body.content = uniqeUuid;
      cd(null, uniqeUuid);
    },
  });
  const upload = multer({ storage: storage });
  return upload;
};

exports.uploadSinglePdf = (fileName, fileDest) =>
  multerFileUpload(fileDest).single(fileName);
