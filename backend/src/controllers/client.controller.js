// backend/src/controllers/client.controller.js

const clientService = require("../services/client.service.js");

/**
 * @description Controller to handle the request for getting the total amount paid by each client.
 */
const listTotalPaidByClients = async (req, res) => {
    try {
        const clientTotals = await clientService.getTotalPaidByClients();
        res.status(200).json(clientTotals);
    } catch (error) {
        res.status(500).json({ message: "Error getting total paid by clients", error: error.message });
    }
};

module.exports = {
    listTotalPaidByClients
};