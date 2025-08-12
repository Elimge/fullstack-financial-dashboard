// backend/src/routes/invoice.routes.js

const { Router } = require("express");
const invoiceController = require("../controllers/invoice.controller.js");

const router = Router();

// --- CRUD Routes for Invoices ---

// GET /api/v1/invoices -> Lists all invoices.
router.get("/", invoiceController.listInvoices);

// POST /api/v1/invoices -> Creates a new invoice.
router.post("/", invoiceController.createInvoice);

// --- Special-Purpose Routes ---

// GET /api/v1/invoices/pending -> Lists all pending invoices.
router.get("/pending", invoiceController.listPendingInvoices);

// --- Dynamic Routes with ID (must be placed after specific routes) ---

// GET /api/v1/invoices/:id -> Gets a single invoice by its ID.
router.get("/:id", invoiceController.getInvoice);

// PUT /api/v1/invoices/:id -> Updates an invoice by its ID.
router.put("/:id", invoiceController.updateInvoice);

// DELETE /api/v1/invoices/:id -> Deletes an invoice by its ID.
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;