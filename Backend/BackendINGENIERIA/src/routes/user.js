const{Router} = require("express")
const userController = require("../controllers/user")
const checkAuth = require("../middlewares/checkAuth");
const multer = require ("../middlewares/multerAvatar")
const upload = require ("../middlewares/upload")
const router = Router()


router.post("/register",userController.register)
router.post("/auth/login", userController.logIn);
router.post("/access", userController.accessToken);
router.get("/auth/user", checkAuth, userController.getUser);
router.patch("/:id", userController.updateUser);
router.patch(
    "/image/:id",
    multer,
    upload,
    userController.updateAvatar
);
router.get("/auth/signout", userController.signOut);

module.exports = router