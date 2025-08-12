// backend/src/services/invoice.service.js

// Import the database connection pool.
const pool = require("../config/database.js");

/**
 * @description Gets all invoices from the database.
 * @returns {Promise<Array>} A list of all invoices.
 */
const getAllInvoices = async () => {
    const [rows] = await pool.query("SELECT * FROM invoices");
    return rows;
};

/**
 * @description Gets a single invoice by its ID.
 * @param {number} id - The ID of the invoice to retrieve.
 * @returns {Promise<object|null>} The invoice object, or null if not found.
 */
const getInvoiceById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM invoices WHERE id_invoice = ?", [id]);
    return rows[0] || null;
};

/**
 * @description Creates a new invoice.
 * @param {object} invoiceData - The data for the new invoice.
 * @returns {Promise<object>} The newly created invoice.
 */
const createInvoice = async (invoiceData) => {
    const { id_client, invoice_number, billing_period, billed_amount, paid_amount } = invoiceData;

    // --- Data Validation ---
    if (!id_client || !invoice_number || !billing_period || !billed_amount) {
        const error = new Error("Missing required fields. id_client, invoice_number, billing_period, and billed_amount are required.");
        error.statusCode = 400; // Bad Request
        throw error;
    }

    const [result] = await pool.query(
        "INSERT INTO invoices (id_client, invoice_number, billing_period, billed_amount, paid_amount) VALUES (?, ?, ?, ?, ?)",
        [id_client, invoice_number, billing_period, billed_amount, paid_amount || 0]
    );
    
    return { id: result.insertId, ...invoiceData };
};

/**
 * @description Updates an existing invoice by its ID.
 * @param {number} id - The ID of the invoice to update.
 * @param {object} invoiceData - The fields to update.
 * @returns {Promise<object|null>} The updated invoice object, or null if not found.
 */
const updateInvoiceById = async (id, invoiceData) => {
    const { id_client, invoice_number, billing_period, billed_amount, paid_amount } = invoiceData;
    
    // --- Data Validation ---
    if (!id_client || !invoice_number || !billing_period || !billed_amount) {
        const error = new Error("Missing required fields. id_client, invoice_number, billing_period, and billed_amount are required.");
        error.statusCode = 400;
        throw error;
    }

    const [result] = await pool.query(
        "UPDATE invoices SET id_client = ?, invoice_number = ?, billing_period = ?, billed_amount = ?, paid_amount = ? WHERE id_invoice = ?",
        [id_client, invoice_number, billing_period, billed_amount, paid_amount, id]
    );

    if (result.affectedRows === 0) {
        return null; // Invoice not found
    }
    return { id: parseInt(id), ...invoiceData };
};

/**
 * @description Deletes an invoice by its ID.
 * @param {number} id - The ID of the invoice to delete.
 * @returns {Promise<boolean>} True if deleted, false if not found.
 */
const deleteInvoiceById = async (id) => {
    const [result] = await pool.query("DELETE FROM invoices WHERE id_invoice = ?", [id]);
    return result.affectedRows > 0;
};

/**
 * @description Gets all invoices that are not fully paid, including client information.
 * An invoice is considered pending if its billed_amount is greater than its paid_amount.
 * @returns {Promise<Array>} A list of pending invoices with associated client data.
 */
const getPendingInvoices = async () => {
    const [rows] = await pool.query(`
        SELECT
            i.id_invoice,
            i.invoice_number,
            i.billed_amount,
            i.paid_amount,
            (i.billed_amount - i.paid_amount) AS pending_amount,
            c.name AS client_name,
            c.email AS client_email,
            c.phone AS client_phone
        FROM
            invoices i
        JOIN
            clients c ON i.id_client = c.id_client
        WHERE
            i.billed_amount > i.paid_amount
        ORDER BY
            pending_amount DESC;
    `);
    return rows;
};

module.exports = {
    getAllInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoiceById,
    deleteInvoiceById,
    getPendingInvoices
};