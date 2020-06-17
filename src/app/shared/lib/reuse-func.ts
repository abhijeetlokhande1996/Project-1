export const generatePDF = () => {
    const fs = window.require("fs");
    const PdfTable = window.require("voilab-pdf-table");
    const PdfDocument = window.require("pdfkit");
    const pdf = new PdfDocument({
        autoFirstPage: false,
        layout: "potrait",
        margins: { top: 50, left: 10, right: 10, bottom: 10 },
        size: "A4",
    });
    pdf.fontSize(10);
    const table = new PdfTable(pdf, {
        bottomMargin: 30,
    });
    table

        // set defaults to your columns
        .setColumnsDefaults({
            // headerBorder: ["L", "T", "B", "R"],
            border: ["L", "T", "B", "R"],
            align: "center",
        })
        // add table columns
        .addColumns([
            {
                id: "clientName",
                header: "Name",
                align: "center",
                width: 100,
                height: 100,
                valign: "center",
            },
            {
                id: "regDate",
                header: "Registration Date",
                width: 100,
                valign: "center",
                align: "center",
            },
            {
                id: "folioNo",
                header: "Folio Number",
                width: 100,
                valign: "center",
                align: "center",
            },
            {
                id: "schemeName",
                header: "Scheme Name",
                width: 100,
                valign: "center",
                align: "center",
            },
            {
                id: "freqType",
                header: "Frequency Type",
                width: 100,
                valign: "center",
                align: "center",
            },
            {
                id: "startDate",
                header: "Start Date",
                width: 100,
                valign: "center",
                align: "center",
            },

            {
                id: "installmentAmt",
                header: "Installment Amount",
                width: 100,
                valign: "center",
                align: "center",
            },
        ]) // add events (here, we draw headers on each new page)
        .onPageAdded(function (tb) {
            tb.addHeader();
        });
    pdf.addPage();

    // draw content, by passing data to the addBody method
    table.addBody(this.filteredSipData);
    pdf.end();
    pdf.pipe(fs.createWriteStream("output.pdf"));
}