// backend/src/controllers/invoice.controller.js

const invoiceService = require("../services/invoice.service.js");

/**
 * @description Controller to list all invoices with pagination.
 */
const listInvoices = async (req, res) => {
    try {
        // Get page and limit from query parameters, with default values
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await invoiceService.getAllInvoices(page, limit);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error listing invoices", error: error.message });
    }
};

/**
 * @description Controller to get a single invoice by ID.
 */
const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await invoiceService.getInvoiceById(id);

        if (invoice) {
            res.status(200).json(invoice);
        } else {
            res.status(404).json({ message: `Invoice with ID ${id} not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "Error getting invoice", error: error.message });
    }
};

/**
 * @description Controller to create a new invoice.
 */
const createInvoice = async (req, res) => {
    try {
        const newInvoice = await invoiceService.createInvoice(req.body);
        res.status(201).json(newInvoice);
    } catch (error) {
        // Check if it's a validation error (Bad Request) or a generic server error.
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

/**
 * @description Controller to update an existing invoice.
 */
const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedInvoice = await invoiceService.updateInvoiceById(id, req.body);
        
        if (updatedInvoice) {
            res.status(200).json(updatedInvoice);
        } else {
            res.status(404).json({ message: `Invoice with ID ${id} not found.` });
        }
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

/**
 * @description Controller to delete an invoice by ID.
 */
const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params; 
        const wasDeleted = await invoiceService.deleteInvoiceById(id);

        if (wasDeleted) {
            res.status(204).send(); // 204 No Content
        } else {
            res.status(404).json({ message: `Invoice with ID ${id} not found.` });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting invoice", error: error.message });
    }
};

/**
 * @description Controller to list all pending invoices.
 */
const listPendingInvoices = async (req, res) => {
    try {
        const pendingInvoices = await invoiceService.getPendingInvoices();
        res.status(200).json(pendingInvoices);
    } catch (error) {
        res.status(500).json({ message: "Error listing pending invoices", error: error.message });
    }
};

module.exports = {
    listInvoices, 
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    listPendingInvoices
};