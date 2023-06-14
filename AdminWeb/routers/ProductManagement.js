const express = require("express");
const router = express.Router();
const CategoriesController = require("../controllers/CategoriesController");


const multer = require('multer');


// SET STORAGE
var upload = multer({
    storage: multer.memoryStorage()
})

//////////////////// Category manegement  ////////////////////
// show table category
router.get("/category", CategoriesController.getCategories);

// feature add new category
router.post("/addCategory", upload.single('file'), CategoriesController.addCategory);

// feature delete a category
router.post("/deleteCategory/:id", CategoriesController.deleteCategory);

// feature update a category
// router.get("/updateCategory/:id", CategoriesController.getFormUpdateCategory);
router.post("/updateCategory", upload.single('editFile'), CategoriesController.updateCategory);




//////////////////// Product manegement  ////////////////////


// show table products.

// feature view  detail a product.

// feature add new products.

// feature delete a products.

// feature update a products.


module.exports = router;