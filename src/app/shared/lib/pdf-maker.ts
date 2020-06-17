const fs = window.require("fs");
const PdfTable = window.require("voilab-pdf-table");
const PdfDocument = window.require("pdfkit");
export function pdfMaker(
  columns: Array<{}>,
  data: Array<{}>,
  fileName: string
) {
  let status = false;
  try {
    const pdf = new PdfDocument({
      autoFirstPage: false,
      layout: "landscape",
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
      .addColumns(columns) // add events (here, we draw headers on each new page)
      .onPageAdded(function (tb) {
        tb.addHeader();
      });
    pdf.addPage();

    // draw content, by passing data to the addBody method
    table.addBody(data);
    pdf.end();
    pdf.pipe(fs.createWriteStream(fileName));
    status = true;
  } catch {
    status = false;
  }
  return status;
}
