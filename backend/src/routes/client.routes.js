// backend/src/routes/client.routes.js

const { Router } = require("express");
const clientController = require("../controllers/client.controller.js");

const router = Router();

// GET /api/v1/clients/total-paid
router.get("/total-paid", clientController.listTotalPaidByClients);

module.exports = router;