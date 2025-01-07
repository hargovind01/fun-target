const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth_controller")
const signupSchema = require("../validators/auth_validators")
const validate = require("../middlewares/validate_middleware")
const authMiddleware = require("../middlewares/auth_middleware");


router.route("/register").post(validate(signupSchema),auth_controller.register);


router.route("/login").post(auth_controller.login);


router.route("/user").get(authMiddleware, auth_controller.user)

router.route("/pointTransfer").put(authMiddleware, auth_controller.updatePoints);

router.route("/deducepoints/:id").put(authMiddleware, auth_controller.deduceUserPoints);

router.route("/updatepoints/:id").put(authMiddleware, auth_controller.updateUserPoints);

module.exports = router;