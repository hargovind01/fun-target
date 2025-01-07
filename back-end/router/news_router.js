const express = require("express");
const router = express.Router();
const news_controller = require("../controllers/news_controller")

router.route("/createNews").post(news_controller.createNews);

router.route("/getNews").get(news_controller.getNews);

router.route("/newsInfo").get(news_controller.newsInfo);

router.route("/deleteNews/:id").delete(news_controller.deleteNewsById);


module.exports = router;