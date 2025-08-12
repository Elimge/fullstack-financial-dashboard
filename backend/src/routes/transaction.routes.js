// backend/src/routes/transaction.routes.js

const { Router } = require("express");
const transactionController = require("../controllers/transaction.controller.js");

const router = Router();

// GET /api/v1/transactions/platform/:platformName
router.get("/platform/:platformName", transactionController.listTransactionsByPlatform);

module.exports = router;