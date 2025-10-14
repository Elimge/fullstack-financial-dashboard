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

/**
 * @description Calculates the delinquency rate based on pending vs. total billed amounts.
 * @returns {Promise<object>} An object containing the delinquency rate and underlying totals.
 */
const getDelinquencyRate = async () => {
    const [rows] = await pool.query(`
        SELECT
            -- Sum of all billed amounts just if the invoice is not cancelled
            SUM(CASE WHEN billed_amount > paid_amount THEN billed_amount ELSE 0 END) AS total_pending_billed,
            -- Sum of all billed amounts
            SUM(billed_amount) AS total_billed
        FROM 
            invoices;
    `);

    const stats = rows[0];
    let delinquencyRate = 0;

    // Ensure we don't divide by zero
    if (stats.total_billed > 0) {
        delinquencyRate = (stats.total_pending_billed / stats.total_billed) * 100;
    }

    return {
        delinquency_rate: delinquencyRate,
        total_pending_billed: stats.total_pending_billed,
        total_billed: stats.total_billed
    };
};

// Export the service functions
module.exports = {
    getMonthlyIncome,
    getPaymentDistribution,
    getTopCustomers,
    getDelinquencyRate
};