// backend/seeders/load-invoices.js

// IMPORTS
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

/**
 * Loads invoice data from invoices.csv into the invoices table.
 * It maps client identification numbers to their corresponding id_client from the database.
 * @async
 * @function loadInvoices
 * @param {import("mysql2/promise").PoolConnection} connection - The database connection.
 */
async function loadInvoices(connection) {
    try {
        console.log("Seeding 'invoices' table...");

        // Create a map of client identification -> id_client
        const [clientRows] = await connection.query("SELECT id_client, identification FROM clients");
        const clientMap = new Map();
        clientRows.forEach(client => {
            clientMap.set(client.identification, client.id_client);
        });

        const invoices = [];
    
        await new Promise((resolve, reject) => {
            fs.createReadStream(path.join(__dirname, "data", "invoices.csv"))
                .pipe(csv())
                .on("data", (row) => {
                    // Find the client's ID using the map
                    const clientId = clientMap.get(row.client_identification);
                    if (clientId) {
                        invoices.push([
                            clientId,
                            row.invoice_number,
                            row.billing_period,
                            row.billed_amount,
                            row.paid_amount
                        ]);
                    } else {
                        console.warn(`Warning: Client with identification ${row.client_identification} not found. Skipping invoice ${row.invoice_number}.`);
                    }
                })
                .on("end", resolve)
                .on("error", reject);
        });

        // Bulk insert into the database
        await connection.query("INSERT INTO invoices (id_client, invoice_number, billing_period, billed_amount, paid_amount) VALUES ?", [invoices]);
        console.log(`${invoices.length} invoices seeded .`);
    } catch (error) {
        // Log any error that occurs during the process
        console.error("Error loading invoices: ", error);
    } 
}

module.exports = { loadInvoices };