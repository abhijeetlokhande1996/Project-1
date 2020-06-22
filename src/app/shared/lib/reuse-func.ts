import * as jsPDF from "jspdf";
import "jspdf-autotable";
import { imageURIs } from "./data-buffer";
import * as quote from "stock-quote";

export const PDFGenerator = (headers, data, type?: string) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF();
      const height = doc.internal.pageSize.getHeight();

      doc.addImage(imageURIs.logo, "JPEG", 15, 15, 30, 30);
      doc.setFontSize(11);
      doc.text("Ram Sadhana Investments", 100, 30);
      doc.text("Write to us : shri.prasad.barade@gmail.com", 100, 35);
      doc.text("Contact : 9933993399", 100, 40);
      doc.line(10, 50, 200, 50);
      doc.setLineWidth(0.5);
      doc.line(10, 52, 200, 52);

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
        headStyles: {
          halign: "center",
          valign: "middle",
        },
        theme: "grid",
        head: headers,
        body: data,
      });

      doc.line(15, height - 15, 200, height - 15);
      doc.text(
        "All rights are reserved with @Ram Sadhana Investment @2020",
        50,
        height - 10
      );
      doc.text("Developed by : Lincoln Technologies", 50, height - 5);
      // Download PDF document
      const date = Date().toLocaleString().split(" ");
      const fileName = `${date[2]}-${date[1]}-${date[3]}(${date[4]})`;
      doc.save(`${type}-${fileName}.pdf`);
      resolve({
        status: true,
        message: "Download started ...",
      });
    } catch (e) {
      resolve({
        status: false,
        message: "Something went wrong. Try again!",
      });
    }
  });
};

export const GetQuote = (symbol: string) => {
  return new Promise((resolve, reject) => {
    quote.getQuote(symbol.toUpperCase(), "NS").then((data) => {
      console.log(JSON.stringify(data, null, 4));
      resolve(JSON.stringify(data, null, 4));
    });
  });
};
