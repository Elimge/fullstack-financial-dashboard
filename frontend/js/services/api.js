// frontend/js/services/api.js

/**
 * This module acts as a dedicated layer for all communication with the backend API.
 */

const API_URL = "http://localhost:3005/api/v1";

/**
 * A generic wrapper around the fetch API to handle JSON responses and errors.
 * @param {string} endpoint - The API endpoint to call (e.g., '/invoices').
 * @param {object} [options={}] - Optional fetch options (method, headers, body).
 * @returns {Promise<any>} A promise that resolves with the JSON data from the response.
 * @throws {Error} Throws an error if the network response is not 'ok'.
 */
const fetchJSON = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    // Handle '204 No Content' for successful DELETE requests
    if (response.status === 204) {
        return null; 
    }

    const responseData = await response.json();

    if (!response.ok) {
        // Use the error message from the API response if available
        throw new Error(responseData.message || "An unknown API error occurred.");
    }
    
    return responseData;
};

// --- Public API Functions for Invoices ---

export const getInvoices = () => fetchJSON("/invoices");

export const getInvoiceById = (id) => fetchJSON(`/invoices/${id}`);

export const createInvoice = (invoiceData) => fetchJSON("/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invoiceData),
});

export const updateInvoice = (id, invoiceData) => fetchJSON(`/invoices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(invoiceData),
});

export const deleteInvoice = (id) => fetchJSON(`/invoices/${id}`, {
    method: "DELETE"
});

export const getPendingInvoicesReport = () => fetchJSON("/invoices/pending");

// --- Public API Functions for KPIs ---

export const getMonthlyIncome = () => fetchJSON("/kpis/monthly-income");

export const getPaymentDistribution = () => fetchJSON("/kpis/payment-distribution");

export const getTopCustomers = () => fetchJSON("/kpis/top-customers");

export const getDelinquencyRate = () => fetchJSON("/kpis/delinquency-rate");

