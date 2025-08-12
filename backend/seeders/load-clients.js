// backend/seeders/load-clients.js

// IMPORTS
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

/**
 * Loads client data from clients.csv into the clients table.
 * @async
 * @function loadClients
 * @param {import("mysql2/promise").PoolConnection} connection - The database connection.
 */
async function loadClients(connection) {
    try {
        console.log("Seeding 'clients' table...");
        const clients = [];
    
        await new Promise((resolve, reject) => {
            fs.createReadStream(path.join(__dirname, "data", "clients.csv"))
                .pipe(csv({
                    headers: ["name", "identification", "address", "phone", "email"],
                    skipLines: 1 // Skip the header row in the CSV
                }))
                .on("data", (row) => {
                    clients.push([row.name, row.identification, row.address, row.phone, row.email]); // Push data as an array for bulk insert
                })
                .on("end", resolve)
                .on("error", reject);
        });
    
        // Bulk insert into the database
        await connection.query("INSERT INTO clients (name, identification, address, phone, email) VALUES ?", [clients]);
        console.log(`${clients.length} clients seeded.`);
    } catch (error) {
        // Log any error that occurs during the process
        console.error("Error loading clients: ", error);
    } 
}

module.exports = { loadClients };