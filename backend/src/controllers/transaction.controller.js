// backend/src/controllers/transaction.controller.js

const transactionService = require("../services/transaction.service.js");

/**
 * @description Controller to handle the request for listing transactions by platform name.
 */
const listTransactionsByPlatform = async (req, res) => {
    try {
        // Extract the platform name from the URL parameters
        const { platformName } = req.params;
        
        const transactions = await transactionService.getTransactionsByPlatform(platformName);
        
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error listing transactions by platform", error: error.message });
    }
};

module.exports = {
    listTransactionsByPlatform
};