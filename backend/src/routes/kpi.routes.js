// backend/src/routes/kpi.routes.js

const { Router } = require("express");
const kpiController = require("../controllers/kpi.controller.js");

const router = Router();

// GET /api/v1/kpis/monthly-income
router.get("/monthly-income", kpiController.listMonthlyIncome);

// GET /api/v1/kpis/payment-distribution
router.get("/payment-distribution", kpiController.listPaymentDistribution);

// GET /api/v1/kpis/top-customers
router.get("/top-customers", kpiController.listTopCustomers);

// GET /api/v1/kpis/delinquency-rate
router.get("/delinquency-rate", kpiController.listDelinquencyRate); 

module.exports = router;