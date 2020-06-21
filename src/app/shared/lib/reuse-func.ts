import * as jsPDF from "jspdf";
import "jspdf-autotable";
import { imageURIs } from "./data-buffer";

export const PDFGenerator = (headers, data) => {
  const doc = new jsPDF();
  const height = doc.internal.pageSize.getHeight();

  doc.addImage(imageURIs.logo, "JPEG", 15, 15, 30, 30);
  doc.text("Ram Sadhana Investments", 100, 30);
  doc.text("Contact: shri.prasad.barade@gmail.com", 100, 35);
  doc.line(10, 50, 200, 50);
  doc.setLineWidth(0.5);
  doc.line(10, 52, 200, 52);

  doc.setFontSize(11);
  doc.setTextColor(100);

  (doc as any).autoTable({
    startY: 60,
    cellWidth: "wrap",
    bodyStyles: {
      halign: "center",
      valign: "middle",
      fontStyle: "italic",
      overflow: "linebreak",
      fontSize: 8,
    },
    columnStyles: {
      halign: "center",
      valign: "middle",
      lineWidth: 1,
      lineColor: 10,
    },
    theme: "grid",
    head: headers,
    body: data,
  });

  doc.line(10, height - 10, 200, height - 10);
  doc.text(
    "All rights are reserved with @Ram Sadhan Investment @2020",
    50,
    height - 5
  );
  // Download PDF document
  doc.save("output.pdf");
};
