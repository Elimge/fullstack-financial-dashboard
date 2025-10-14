// backend/src/services/kpi.service.js

const pool = require("../config/database.js");

/**
 * @description Calculates the total income from completed transactions for each month.
 * @returns {Promise<Array>} An array of objects, each containing a month and the total income for that month.
 */
const getMonthlyIncome = async () => {
    const [rows] = await pool.query(`
        SELECT 
            DATE_FORMAT(t.transaction_date, '%Y-%m') AS month,
            SUM(t.amount) AS total_income
        FROM 
            transactions t
        WHERE 
            t.status = 'completed'
        GROUP BY 
            month
        ORDER BY 
            month;
    `);
    return rows;
};

/**
 * @description Calculates the total income received from each payment platform.
 * @returns {Promise<Array>} An array of objects, each with a platform name and the total amount.
 */
const getPaymentDistribution = async () => {
    const [rows] = await pool.query(`
        SELECT 
            p.name AS platform_name,
            SUM(t.amount) AS total_amount
        FROM 
            transactions t
        JOIN
            platforms p ON t.id_platform = p.id_platform
        WHERE 
            t.status = 'completed'
        GROUP BY 
            p.name
        `); 
        return rows;
};

/**
 * @description Finds the top 5 customers based on the total paid amount across all their invoices.
 * @returns {Promise<Array>} A list of the top 5 customers.
 */
const getTopCustomers = async () => {
    const [rows] = await pool.query(`
        SELECT
            c.name AS customer_name,
            SUM(i.paid_amount) AS total_paid
        FROM
            invoices i
        JOIN
            clients c ON i.id_client = c.id_client
        GROUP BY
            c.id_client
        ORDER BY
            total_paid DESC
        LIMIT 5;
    `);
    return rows;
};

// Export the service functions
module.exports = {
    getMonthlyIncome,
    getPaymentDistribution,
    getTopCustomers
};