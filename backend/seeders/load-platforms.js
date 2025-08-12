// backend/seeders/load-platforms.js

// IMPORTS
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

/**
 * Loads platform data from platforms.csv into the platforms table.
 * @async
 * @function loadPlatforms
 * @param {import("mysql2/promise").PoolConnection} connection - The database connection.
 */
async function loadPlatforms(connection) {
    try {
        console.log("Seeding 'platforms' table...");
        const platforms = [];
    
        // Promise to handle the asynchronous nature of stream reading
        await new Promise((resolve, reject) => {
            fs.createReadStream(path.join(__dirname, "data", "platforms.csv"))
                .pipe(csv({
                    headers: ["name"],
                    skipLines: 1 // Skip the header row in the CSV
                }))
                .on("data", (row) => {
                    platforms.push([row.name]); // Push data as an array for bulk insert
                })
                .on("end", resolve)
                .on("error", reject);
        });
    
        // Bulk insert into the database
        await connection.query("INSERT INTO platforms (name) VALUES ?", [platforms]);
        console.log(`${platforms.length} platforms seeded.`);
    } catch (error) {
        // Log any error that occurs during the process
        console.error("Error loading platforms: ", error);
    } 
}

module.exports = { loadPlatforms };