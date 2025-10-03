// backend/src/routes/kpi.routes.js

const { Router } = require("express");
const kpiController = require("../controllers/kpi.controller.js");

const router = Router();

// GET /api/v1/kpis/monthly-income
router.get("/monthly-income", kpiController.listMonthlyIncome);

module.exports = router;