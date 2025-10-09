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

// Export the service functions
module.exports = {
    getMonthlyIncome,
    getPaymentDistribution
};