const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game_controller");

router.route('/history').get(gameController.game_history);

router.route('/entry').post(gameController.game_update);


module.exports = router;