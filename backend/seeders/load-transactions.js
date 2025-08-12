// backend/seeders/load-transactions.js

// IMPORTS
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

/**
 * Loads transaction data from transactions.csv into the transactions table.
 * It maps invoice numbers and platform names to their respective IDs.
 * @async
 * @function loadTransactions
 * @param {import("mysql2/promise").PoolConnection} connection - The database connection.
 */
async function loadTransactions(connection) {
    try {
        console.log("Seeding 'transactions' table...");

        // Create a map for invoices: invoice_number -> id_invoice
        const [invoiceRows] = await connection.query("SELECT id_invoice, invoice_number FROM invoices");
        const invoiceMap = new Map();
        invoiceRows.forEach(invoice => {
            invoiceMap.set(invoice.invoice_number, invoice.id_invoice);
        });

        // Create a map for platforms: name -> id_platform
        const [platformRows] = await connection.query("SELECT id_platform, name FROM platforms");
        const platformMap = new Map();
        platformRows.forEach(platform => {
            platformMap.set(platform.name.toLowerCase(), platform.id_platform); // Use toLowerCase for safety
        });

        const transactions = [];
    
        await new Promise((resolve, reject) => {
            fs.createReadStream(path.join(__dirname, "data", "transactions.csv"))
                .pipe(csv())
                .on("data", (row) => {
                    const invoiceId = invoiceMap.get(row.invoice_number);
                    const platformId = platformMap.get(row.platform_name.toLowerCase());
                
                    if (invoiceId && platformId) {
                        transactions.push([
                            invoiceId,
                            platformId,
                            row.transaction_code,
                            row.transaction_date,
                            row.amount,
                            row.status,
                            row.type
                        ]);
                    } else {
                        console.warn(`Warning: Could not map transaction ${row.transaction_code}. Invoice or Platform not found.`);
                    }
                })
                .on("end", resolve)
                .on("error", reject);
        });

        // Bulk insert into the database
        await connection.query("INSERT INTO transactions (id_invoice, id_platform, transaction_code, transaction_date, amount, status, type) VALUES ?", [transactions]);
        console.log(`${transactions.length} transactions seeded .`);
    } catch (error) {
        // Log any error that occurs during the process
        console.error("Error loading transactions: ", error);
    } 
}

module.exports = { loadTransactions };