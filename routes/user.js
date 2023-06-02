const router = require("express").Router();
const isLoginAdmin = require("../middlewares/isLoginAdmin");
const userController = require("../controller/userController");

router.post("/register", isLoginAdmin, userController.register);
router.put("/:id", isLoginAdmin, userController.update);
router.get("/", isLoginAdmin, userController.getAll);
router.get("/:id", isLoginAdmin, userController.get);
router.delete("/:id", isLoginAdmin, userController.delete);

module.exports = router;
