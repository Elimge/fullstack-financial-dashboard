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

module.exports = {
    listMonthlyIncome
};