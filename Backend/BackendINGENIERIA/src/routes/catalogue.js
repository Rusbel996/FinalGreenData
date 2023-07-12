const { Router } = require("express");
const catalogueController = require("../controllers/catalogue");
const router = Router();

router.post("/",  catalogueController.createCatalogue);
router.get("/",  catalogueController.getCatalogue);
router.get("/:id", catalogueController.getSingleCatalogue);
router.patch("/:id", catalogueController.updateCatalogue);
router.delete("/:id", catalogueController.deleteCatalogue);

module.exports = router;