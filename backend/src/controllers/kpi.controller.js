// backend/src/controllers/kpi.controller.js

const kpiService = require("../services/kpi.service.js");

/**
 * @description Controller to handle the request for monthly income KPI.
 */
const listMonthlyIncome = async (req, res) => {
    try {
        const monthlyIncome = await kpiService.getMonthlyIncome();
        res.status(200).json(monthlyIncome);
    } catch (error) {
        res.status(500).json({ message: "Error getting monthly income data", error: error.message });
    }
};

/**
 * @description Controller to handle the request for payment distribution KPI.
 */
const listPaymentDistribution = async (req, res) => {
    try {
        const distributionData = await kpiService.getPaymentDistribution();
        res.status(200).json(distributionData);
    } catch (error) {
        res.status(500).json({ message: "Error getting payment distribution data", error: error.message });
    }
};

// Export the controller functions
module.exports = {
    listMonthlyIncome,
    listPaymentDistribution
};