// frontend/js/app.js

/**
 * This is the main entry point for the application's frontend logic.
 * It acts as an orchestrator, connecting user events to API calls and UI updates.
 */

import * as api from "./services/api.js";
import * as ui from "./ui/ui.js";

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Element References ---
    const monthlyIncomeCanvas = document.getElementById("monthlyIncomeChart");
    const addInvoiceForm = document.getElementById("add-invoice-form");
    const invoicesTableBody = document.getElementById("invoices-table-body");
    const editInvoiceModal = new bootstrap.Modal(document.getElementById("editInvoiceModal"));
    const saveEditButton = document.getElementById("save-edit-button");

    /**
     * @description Loads all dashboard charts and KPIs.
     */
    const loadDashboardData = async () => {
        try {
            const incomeData = await api.getMonthlyIncome();
            ui.renderMonthlyIncomeChart(monthlyIncomeCanvas, incomeData);
        } catch (error) {
            console.error("Error loading dashboard data: ", error);
        }
    };

    /**
     * @description Fetches the initial list of invoices and renders them to the table.
     */
    const loadInvoices = async () => {
        try { 
            const invoices = await api.getInvoices();
            ui.renderInvoices(invoicesTableBody, invoices);
        } catch (error) {
            console.error("Error loading invoices:", error);
            alert("Could not load invoices.");
        }
    };

    // --- Event Listeners ---

    // Handles the submission of the "Add New Invoice" form.
    addInvoiceForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(addInvoiceForm);
        const invoiceData = {
            id_client: formData.get("id_client"),
            invoice_number: formData.get("invoice_number"),
            billing_period: formData.get("billing_period"),
            billed_amount: formData.get("billed_amount"),
            paid_amount: 0 // New invoices always start with 0 paid.
        };
        
        try {
            await api.createInvoice(invoiceData);
            addInvoiceForm.reset();
            loadInvoices(); // Refresh the table to show the new invoice.
            alert("Invoice created successfully!");
        } catch (error) {
            alert(`Error creating invoice: ${error.message}`);
        }
    });

    // Uses event delegation to handle clicks on "Edit" and "Delete" buttons.
    invoicesTableBody.addEventListener("click", async (event) => {
        const target = event.target;
        const invoiceId = target.dataset.invoiceId;

        // Handle clicks on any "delete" button.
        if (target.classList.contains("delete-btn")) {
            if (confirm(`Are you sure you want to delete invoice ID ${invoiceId}?`)) {
                try {
                    await api.deleteInvoice(invoiceId);
                    ui.removeTableRow(target);
                } catch (error) {
                    alert(`Error deleting invoice: ${error.message}`);
                }
            }
        }
    
        // Handle clicks on any "edit" button.
        if (target.classList.contains("edit-btn")) {
            try {
                const invoice = await api.getInvoiceById(invoiceId);
                ui.populateEditModal(invoice);
                editInvoiceModal.show();
            } catch (error) {
                alert(`Error fetching invoice details: ${error.message}`);
            }
        }
    });

    // Handles the click on the "Save Changes" button within the modal.
    saveEditButton.addEventListener("click", async () => {
        const invoiceId = document.getElementById("edit-invoice-id").value;
        const updatedData = {
            id_client: document.getElementById("edit-id_client").value,
            invoice_number: document.getElementById("edit-invoice_number").value,
            billing_period: document.getElementById("edit-billing_period").value,
            billed_amount: document.getElementById("edit-billed_amount").value,
            paid_amount: document.getElementById("edit-paid_amount").value,
        };

        try {
            const updatedInvoice = await api.updateInvoice(invoiceId, updatedData);
            ui.updateTableRow(updatedInvoice);
            editInvoiceModal.hide();
        } catch (error) {
            alert(`Error updating invoice: ${error.message}`);
        }
    });

    // --- Initial Load ---
    loadInvoices();
    loadDashboardData();
});