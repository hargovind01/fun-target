const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin_controller");
const authMiddleware = require("../middlewares/auth_middleware");
const adminMiddleware = require("../middlewares/admin_middelware");

router.route('/users').get(authMiddleware,adminMiddleware,adminController.getAllUsers);

router.route("/user/:id").get(authMiddleware,adminMiddleware, adminController.getUserById);

router.route("/user/update/:id").patch(authMiddleware,adminMiddleware, adminController.updateUserById);

router
  .route("/user/update-points/:id")
  .put(authMiddleware, adminMiddleware, adminController.updateUserPoints);


router.route("/user/delete/:id").delete(authMiddleware, adminMiddleware, adminController.deleteUserById);

module.exports = router;