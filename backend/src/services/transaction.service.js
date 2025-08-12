// backend/src/services/transaction.service.js

// Import the database connection pool.
const pool = require("../config/database.js");

/**
 * @description Gets all transactions for a specific platform, joining with invoice and client data.
 * @param {string} platformName - The name of the platform to filter by (e.g., 'Nequi').
 * @returns {Promise<Array>} A list of transactions with extended information.
 */
const getTransactionsByPlatform = async (platformName) => {
    const [rows] = await pool.query(`
        SELECT 
            t.transaction_code,
            t.amount,
            t.status,
            t.transaction_date,
            p.name AS platform_name,
            i.invoice_number,
            c.name AS client_name,
            c.email AS client_email
        FROM 
            transactions t
        LEFT JOIN 
            platforms p ON t.id_platform = p.id_platform
        LEFT JOIN 
            invoices i ON t.id_invoice = i.id_invoice
        LEFT JOIN 
            clients c ON i.id_client = c.id_client
        WHERE 
            LOWER(p.name) = LOWER(?);
    `, [platformName]);
    
    return rows;
};

module.exports = {
    getTransactionsByPlatform
};