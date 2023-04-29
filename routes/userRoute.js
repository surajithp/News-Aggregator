const router = require("express").Router();
const userController = require("../controllers/userController");

const { verifyUser } = require("../middleware/verifyToken");

router.get("/preferences", verifyUser, userController.getUserPreferences);

router.post("/register", userController.signUp);

router.post("/login", userController.logIn);

router.put('/preferences', verifyUser, userController.updateUserPreferences);

router.get('/news', verifyUser, userController.data);

module.exports = router;

