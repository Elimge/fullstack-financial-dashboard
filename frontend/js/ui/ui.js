// frontend/js/ui/ui.js

/**
 * This module contains all functions that directly interact with or manipulate the DOM.
 */

/**
 * Creates the HTML for a single row in the invoices table.
 * @param {object} invoice - An invoice object from the API.
 * @returns {string} The HTML string for the table row.
 */
const createInvoiceRow = (invoice) => `
    <td class="align-middle">${invoice.id_invoice}</td>
    <td class="align-middle">${invoice.id_client}</td>
    <td class="align-middle">${invoice.invoice_number}</td>
    <td class="align-middle">${invoice.billing_period}</td>
    <td class="align-middle">${invoice.billed_amount}</td>
    <td class="align-middle">${invoice.paid_amount}</td>
    <td>
        <button class="btn btn-warning btn-sm edit-btn" data-invoice-id="${invoice.id_invoice}">Edit</button>
        <button class="btn btn-danger btn-sm delete-btn" data-invoice-id="${invoice.id_invoice}">Delete</button>
    </td>
`;

/**
 * Renders a list of invoices into the table body.
 * @param {HTMLElement} tableBody - The tbody element to populate.
 * @param {Array<object>} invoices - An array of invoice objects.
 */
export const renderInvoices = (tableBody, invoices) => {
    tableBody.innerHTML = ""; // Clear existing content
    invoices.forEach(invoice => {
        const row = document.createElement("tr");
        row.setAttribute("data-row-id", invoice.id_invoice); // Set a data attribute for easy selection
        row.innerHTML = createInvoiceRow(invoice);
        tableBody.appendChild(row);
    });
};

/**
 * Updates a single table row with new invoice data.
 * @param {object} invoice - The updated invoice object (must contain an 'id' property).
 */
export const updateTableRow = (invoice) => {
    const rowToUpdate = document.querySelector(`tr[data-row-id='${invoice.id}']`);
    if (rowToUpdate) {
        // We reuse createInvoiceRow to ensure consistency
        rowToUpdate.innerHTML = createInvoiceRow({ id_invoice: invoice.id, ...invoice });
    }
};

/**
 * Removes a table row from the DOM.
 * @param {HTMLElement} element - An element within the row to be removed (e.g., the delete button).
 */
export const removeTableRow = (element) => {
    element.closest("tr").remove();
};

/**
 * Renders a bar chart for monthly income.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw the chart on.
 * @param {Array<object>} data - The data from the API (e.g., [{ month: '2024-06', total_income: 1000 }]).
 */
export const renderMonthlyIncomeChart = (canvas, data) => {
    const ctx = canvas.getContext("2d");

    // Extract labels (months) and values (income) from the data
    const labels = data.map(item => item.month);
    const values = data.map(item => item.total_income);

    // Create the chart
    new Chart(ctx, {
        type: "bar", // Type of chart
        data: {
            labels,
            datasets: [{
                label: "Total Income",
                data: values,
                backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue color with transparency
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
};

/**
 * Renders a pie chart for payment platform distribution.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw the chart on.
 * @param {Array<object>} data - The data from the API (e.g., [{ payment_method: 'Nequi', total_amount: 1000 }]).
 */
export const renderPaymentDistributionChart = (canvas, data) => {
    const ctx = canvas.getContext("2d");

    const labels = data.map(item => item.platform_name);
    const values = data.map(item => item.total_amount);

    new Chart(ctx, {
        type: "pie", // Type of chart
        data: {
            labels: labels,
            datasets: [{
                label: "Total Amount",
                data: values,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",   // Red for the first platform
                    "rgba(75, 192, 192, 0.6)", // Green for the second platform
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(75, 192, 192, 1)",
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
};

/**
 * Renders the top customers data into a table.
 * @param {HTMLElement} tableBody - The tbody element to populate.
 * @param {Array<object>} customers - The data from the API.
 */
export const renderTopCustomersTable = (tableBody, customers) => {
    tableBody.innerHTML = ""; // Clear existing content

    customers.forEach((customer, index) => {
        const row = `
            <tr>
                <td class="align-middle"><strong>${index + 1}</strong></td>
                <td class="align-middle">${customer.customer_name}</td>
                <td class="align-middle text-end">${parseFloat(customer.total_paid).toLocaleString("en-US", { style: "currency", currency: "USD"})}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
};

/**
 * Populates the edit modal with the data from a specific invoice.
 * @param {object} invoice - The invoice object to populate the modal with.
 */
export const populateEditModal = (invoice) => {
    document.getElementById("edit-invoice-id").value = invoice.id_invoice;
    document.getElementById("edit-id_client").value = invoice.id_client;
    document.getElementById("edit-invoice_number").value = invoice.invoice_number;
    document.getElementById("edit-billing_period").value = invoice.billing_period;
    document.getElementById("edit-billed_amount").value = invoice.billed_amount;
    document.getElementById("edit-paid_amount").value = invoice.paid_amount;
};