const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction_controller");

router.route('/entries').post(transactionController.transaction_entry);

router.route('/enquries').get(transactionController.transaction_enquiry);


module.exports = router;