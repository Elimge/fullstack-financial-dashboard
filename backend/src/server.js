// backend/src/server.js

/**
 * Entry point for the ExpertSoft API server.
 * Sets up Express app, routes, middleware, and database connection.
 */

// Import required modules
const express = require("express");
const cors = require("cors");
const pool = require("./config/database.js");
require("dotenv").config(); 

// Import API routes
const invoiceRoutes = require("./routes/invoice.routes.js");
const clientRoutes = require("./routes/client.routes.js"); 
const transactionRoutes = require("./routes/transaction.routes.js"); 

// Create Express app instance
const app = express(); 

// The port the server will listen on
const PORT = process.env.PORT || 3000; 

// --- Middlewares ---
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// --- Root route ---

/**
 * GET /
 * @description Root endpoint to confirm API is running
 * @route GET /
 * @returns {string} Confirmation message
 */
app.get("/", (req, res) => {
    res.send("ExpertSoft API is running...");
}); 

/**
 * Invoice-related endpoints
 * @route /api/v1/invoices
 */
app.use("/api/v1/invoices", invoiceRoutes);

/**
 * Clients-related endpoints
 * @route /api/v1/clients
 */
app.use("/api/v1/clients", clientRoutes); 

/**
 * Transactions-related endpoints
 * @route /api/v1/transactions
 */
app.use("/api/v1/transactions", transactionRoutes);

// --- Start the server ---

/**
 * Start the server and connect to the database
 * @function
 */
app.listen(PORT, async () => {
    try {
        await pool.getConnection();
        console.log(`Server is running on port ${PORT}`);
        console.log("Successfully connected to the database.");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }
});

