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
    const paymentDistributionCanvas = document.getElementById("paymentDistributionChart");
    const topCustomersTableBody = document.getElementById("top-customers-table-body");
    const addInvoiceForm = document.getElementById("add-invoice-form");
    const invoicesTableBody = document.getElementById("invoices-table-body");
    const editInvoiceModal = new bootstrap.Modal(document.getElementById("editInvoiceModal"));
    const saveEditButton = document.getElementById("save-edit-button");
    const downloadReportBtn = document.getElementById("download-report-btn");
    const downloadPdfBtn = document.getElementById("download-pdf-btn");

    // Variable to hold KPI data for PDF generation
    let kpiData = {};

    // --- Helper Functions ---

    /**
     * @description Generate insights text based on KPI data.
     */
    const generateInsightsText = (data) => {
        const insights = {};

        // Insight for Monthly Income
        if (data.incomeData && data.incomeData.length > 2) {
            const lastMonth = data.incomeData[data.incomeData.length - 1];
            const prevMonth = data.incomeData[data.incomeData.length - 2];
            const change = ((lastMonth.total - prevMonth.total) / prevMonth.total) * 100;
            insights.incomeInsight = `Monthly income shows a  ${change.toFixed(2)}% change in ${lastMonth.month} compared to the previous month.`;
        }

        // Insight for Payment Distribution
        if (data.distributionData && data.distributionData.length > 0) {
            const topPlatform = data.distributionData.sort((a, b) => b.total_amount - a.total_amount)[0];
            insights.distributionInsight = `The most used payment platform is ${topPlatform.platform_name}, processing a total of ${parseFloat(topPlatform.total_amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}.`;
        }

        return insights;
    };

    /**
     * @description Loads all dashboard charts and KPIs.
     */
    const loadDashboardData = async () => {
        try {
            // Fetch all KPI data in parallel
            kpiData.incomeData = await api.getMonthlyIncome();
            kpiData.distributionData = await api.getPaymentDistribution();
            kpiData.topCustomersData = await api.getTopCustomers();

            // Render charts and tables
            ui.renderMonthlyIncomeChart(monthlyIncomeCanvas, kpiData.incomeData);
            ui.renderPaymentDistributionChart(paymentDistributionCanvas, kpiData.distributionData);
            ui.renderTopCustomersTable(topCustomersTableBody, kpiData.topCustomersData);
        
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

    // Handles the click on the "Download Pending Invoices Report" button.
    downloadReportBtn.addEventListener("click", async () => {
        try {
            console.log("Fetching data for report...");
            const data = await api.getPendingInvoicesReport();

            if (data.length === 0) {
                alert("No pending invoices to report.");
                return;
            }

            console.log("Generating Excel file...");

            // Create a new workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Append the worksheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, "Pending Invoices");

            // Trigger the download
            XLSX.writeFile(workbook, "Pending_Invoices_Report.xlsx");
        } catch (error) {
            console.error("Error generating report:", error);
            alert("Could not generate the report.");
        }
    });

    // Handles the click on the "Download PDF Summary" button.
    downloadPdfBtn.addEventListener("click", async () => {
        try {
            console.log("Generating PDF summary...");

            // Show a temporary loading state
            downloadPdfBtn.disabled = true;
            downloadPdfBtn.textContent = "Generating...";

            // Import jsPDF and html2canvas
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Add a title and date to the PDF
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(22);
            pdf.text("Financial Summary Report", 105, 20, { align: 'center' });
            
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "normal");
            pdf.text(`Report generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

            // Generate insights text
            const insights = generateInsightsText(kpiData);
            let currentY = 45; // Starting Y position for insights

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(14);
            pdf.text("Key Insights:", 15, currentY);
            currentY += 8;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(11);

            // Add insights if they exist
            if (insights.incomeInsight) {
                pdf.text(`- ${insights.incomeInsight}`, 15, currentY, { maxWidth: 180 });
                currentY += 12;
            }
            if (insights.distributionInsight) {
                pdf.text(`- ${insights.distributionInsight}`, 15, currentY, { maxWidth: 180 });
            }

            // Add graph image using html2canvas
            // Capture the dashboard section as a canvas
            const dashboardSection = document.getElementById("dashboard-analytics-section");
            const canvas = await html2canvas(dashboardSection);
            const imgData = canvas.toDataURL('image/png');
            
            const imgWidth = 190;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            // Add some spacing before the image
            pdf.addImage(imgData, 'PNG', 10, currentY + 10, imgWidth, imgHeight);

            pdf.save("Financial_Summary_Report.pdf");
            
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Could not generate the PDF report.");
        } finally {
            // Restore button state
            downloadPdfBtn.disabled = false;
            downloadPdfBtn.textContent = "Download PDF Summary";
        }
    });   

    // --- Initial Load ---
    loadInvoices();
    loadDashboardData();
});