const router = require("express").Router();
const userController = require("../controllers/userController");

const { verifyUser } = require("../middleware/verifyToken");
const { rateLimiterUsingThirdParty } = require("../middleware/rateLimiter");

router.get("/preferences", verifyUser, userController.getUserPreferences);

router.post("/register", userController.signUp);

router.get("/verify/:id/:token", userController.verifyUserEmail)

router.post("/login", userController.logIn);

router.put('/preferences', verifyUser, userController.updateUserPreferences);

router.get('/news', verifyUser, rateLimiterUsingThirdParty, userController.data);

module.exports = router;

