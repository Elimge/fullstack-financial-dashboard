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

module.exports = {
    getMonthlyIncome
};