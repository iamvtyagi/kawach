import multer from "multer";
import crypto from "crypto";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
    //cb -> callback function just like next() in express (agla konsa middleware execute hoga)
    // file -> file object catches the file coming from the client(browser)
    destination: function (req, file, cb) { 
      cb(null, './public/images/upload') //1st argument -> error, 2nd argument -> destination path
    },
    filename: function (req, file, cb) {
      crypto.randomBytes(12, function (err, bytes){   //12 bytes random buffer will be generated and stored in bytes
        const fn = bytes.toString('hex') + path.extname(file.originalname);   //bytes ko string me convert kia and file extension ko append kia
        cb(null, fn) //fn = filename
      })
    }
  })
  
  // Initialize upload middleware
const upload = multer({
    storage: storage 
});

export default upload;