const { Router } = require("express");
const productController = require("../controllers/product");
const multer = require("../middlewares/multer");
const upload = require("../middlewares/upload");

const router = Router();


router.post("/", multer, upload, productController.createProduct);
router.get("/", productController.getProducts);

module.exports = router;