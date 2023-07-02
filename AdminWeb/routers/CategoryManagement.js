const express = require("express");
const router = express.Router();
const CategoriesController = require("../controllers/CategoriesController");
const checkInternetConnection = require('../config/checkInternet');

const multer = require('multer');

// SET STORAGE
var upload = multer({
    storage: multer.memoryStorage()
})

// Upload category data
var UploadMultipleFile = multer({ dest: 'dataImport/' });

//////////////////// Category manegement  ////////////////////
// show table category
router.get("/category", checkInternetConnection, CategoriesController.getCategories);

// feature add new category
router.post("/addCategory", checkInternetConnection, upload.single('file'), CategoriesController.addCategory);

router.post("/importAddCategory", checkInternetConnection, UploadMultipleFile.single('importFile'), CategoriesController.importCategory);

// feature delete a category
router.post("/deleteCategory", checkInternetConnection, CategoriesController.deleteCategory);

// feature update a category
router.post("/updateCategory", checkInternetConnection, upload.single('editFile'), CategoriesController.updateCategory);

// feature export categories
router.post("/exportCategory", checkInternetConnection, CategoriesController.exportCategory);


module.exports = router;