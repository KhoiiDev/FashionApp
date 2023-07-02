const express = require("express");
const router = express.Router();
const Controller = require("../controllers/BrandsController");
const checkInternetConnection = require('../config/checkInternet');
const multer = require('multer');

// SET STORAGE
var upload = multer({
    storage: multer.memoryStorage()
})

// Upload category data
var UploadMultipleFile = multer({ dest: 'dataImport/' });


router.get("/brands", checkInternetConnection, Controller.getBrands);
router.post("/newBrand", checkInternetConnection, upload.single('file'), Controller.newBrand);
router.post("/importBrand", checkInternetConnection, UploadMultipleFile.single('importFile'), Controller.importBrands);
router.post("/deleteBrand", checkInternetConnection, Controller.deleteBrand);
router.post("/updateBrand", checkInternetConnection, Controller.updateBrand);


module.exports = router;