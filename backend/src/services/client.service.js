// backend/src/services/client.service.js

// Import the database connection pool.
const pool = require("../config/database.js");

/**
 * @description Gets the total amount paid by each client by summing up the 'paid_amount' from all their invoices.
 * @returns {Promise<Array>} An array of objects, each containing client info and their total paid amount.
 */
const getTotalPaidByClients = async () => {
    const [rows] = await pool.query(`
        SELECT 
            c.id_client,
            c.name,
            c.email,
            SUM(i.paid_amount) AS total_paid
        FROM 
            clients c
        JOIN 
            invoices i ON c.id_client = i.id_client
        GROUP BY 
            c.id_client, c.name, c.email
        ORDER BY
            total_paid DESC;
    `);
    return rows;
};

module.exports = {
    getTotalPaidByClients
};