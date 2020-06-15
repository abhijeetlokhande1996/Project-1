import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "./../../services/database.service";
import { take, delay, distinctUntilChanged } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SipInterface, IFSipInterface } from "../../interfaces/sip.interface";
import { ChartType, ChartOptions } from "chart.js";
import { Label } from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import "chart.piecelabel.js";

import {
  TitleCasePipe,
  CurrencyPipe,
  DecimalPipe,
  DatePipe,
  JsonPipe,
} from "@angular/common";

@Component({
  selector: "app-monthly-sip",
  templateUrl: "./monthly-sip.component.html",
  styleUrls: ["./monthly-sip.component.css"],
})
export class MonthlySipComponent implements OnInit {
  sipData: Array<SipInterface> = [];
  filteredSipData: Array<IFSipInterface> = [];
  folioForm: FormGroup;
  chartOptions: ChartOptions;
  chartType: ChartType;
  chartLegend: boolean;
  chartLabel: Array<Label>;
  chartData: Array<number>;
  chartColor: Array<{}>;

  chartPlugins = [pluginDataLabels];
  colHeaderMapArray = [];
  startDate = null;
  endDate = null;
  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.colHeaderMapArray = [
      ["clientName", "Name"],
      ["regDate", "Registration Date"],
      ["folioNo", "Folio Number"],
      ["schemeName", "Scheme Name"],
      ["freqType", "Frequency Type"],
      ["startDate", "Start Date"],

      ["installmentAmt", "Installment Amount"],
    ];

    this.chartType = "doughnut";
    this.chartLegend = true;
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,

      legend: {
        position: "top",
      },
    };
    this.folioForm = new FormGroup({
      folioNo: new FormControl(null, [Validators.required]),
    });
    this.folioForm
      .get("folioNo")
      .valueChanges.pipe(delay(100), distinctUntilChanged())
      .subscribe((folioNo: number) => {
        if (this.startDate && this.endDate) {
          this.onEndDateSelect(this.endDate);
        } else {
          const fData: Array<SipInterface> = this.distillSipData(folioNo);
          this.filteredSipData = this.getFlattenData(fData);
          this.generateChartData(this.filteredSipData);
          this.filteredSipData = this.transformFilteredData(
            this.filteredSipData
          );
        }
      });
    this.dbService
      .getSipData()
      .pipe(take(1))
      .subscribe((resp) => {
        this.sipData = resp;

        const fData: Array<SipInterface> = this.distillSipData(null);

        this.filteredSipData = this.getFlattenData(fData);
        this.generateChartData(this.filteredSipData);
        this.filteredSipData = this.transformFilteredData(this.filteredSipData);
      });

    this.dbService.getUsers().subscribe((users) => {
      let data = users.map((item) => {
        return item.payload.doc.data();
      });
      console.log(data);
    });
  }

  getFlattenData(dataToFlat: Array<SipInterface>) {
    const result = [];
    for (const item of dataToFlat) {
      const objToPush = {};
      objToPush["clientName"] = item["clientName"];
      objToPush["regDate"] = item["regDate"];
      objToPush["folioNo"] = item["folioNo"];
      if (item["schemes"]) {
        for (const el of item.schemes) {
          objToPush["schemeName"] = el["schemeName"];
          objToPush["freqType"] = el["freqType"];
          objToPush["startDate"] = el["startDate"];
          objToPush["installmentAmt"] = el["installmentAmt"];
          result.push(this.getDeepCopy(objToPush));
        }
      }
    }
    return result;
  }

  distillSipData(folioNo: number) {
    let dataToReturn = [];
    if (folioNo) {
      dataToReturn = this.getDeepCopy(
        this.sipData.filter((item) => item.folioNo == folioNo)
      );
    } else {
      dataToReturn = this.getDeepCopy(this.sipData);
    }
    return dataToReturn;
  }
  transformFilteredData(data: Array<IFSipInterface>) {
    data = this.getDeepCopy(data);
    const tcPipe = new TitleCasePipe();
    const cp = new CurrencyPipe("en");
    const dp = new DecimalPipe("en");
    const datePipe = new DatePipe("en");
    for (const item of data) {
      item["clientName"] = tcPipe.transform(item["clientName"]);
      item["regDate"] = datePipe.transform(item["regDate"], "dd/MM/yyyy");
      item["folioNo"] = dp.transform(item["folioNo"]);
      item["schemeName"] = tcPipe.transform(item["schemeName"]);
      item["freqType"] = tcPipe.transform(item["freqType"]);
      item["startDate"] = datePipe.transform(item["startDate"], "dd/MM/yyyy");
      item["endDate"] = datePipe.transform(item["endDate"], "dd/MM/yyyy");
      item["installmentAmt"] = cp.transform(item["installmentAmt"], "INR");
    }
    return data;
  }
  generateChartData(data: Array<{}>) {
    this.chartColor = null;
    this.chartLabel = null;
    this.chartData = null;
    this.chartLabel = [];
    this.chartData = [];
    this.chartColor = [{ backgroundColor: [] }];
    for (const item of data) {
      if (this.chartLabel.indexOf(item["schemeName"].toUpperCase()) < 0) {
        this.chartLabel.push(item["schemeName"].toUpperCase());
      }

      this.chartData.push(item["installmentAmt"]);
      while (true) {
        const colorHexCode = this.getRandomColor();
        if (this.chartColor[0]["backgroundColor"].indexOf(colorHexCode) == -1) {
          this.chartColor[0]["backgroundColor"].push(colorHexCode);
          break;
        }
      }
    }
  }
  getDeepCopy(item: any) {
    if (item) {
      return JSON.parse(JSON.stringify(item));
    }
  }
  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  onClickPrint() {
    const fs = window.require("fs");
    const PdfTable = window.require("voilab-pdf-table");
    const PdfDocument = window.require("pdfkit");
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
  onStartDateSelect(startDate) {
    this.endDate = null;
  }
  onEndDateSelect(endDate) {
    const startDay = this.startDate["day"];
    const startMonth = this.startDate["month"] - 1;
    const startYear = this.startDate["year"];

    const endDay = this.endDate["day"];
    const endMonth = this.endDate["month"] - 1;
    const endYear = this.endDate["year"];

    const minDate: Date = new Date(startYear, startMonth, startDay);
    const maxDate: Date = new Date(endYear, endMonth, endDay);
    let fData = this.distillRecordsAccordingToRange(minDate, maxDate);
    this.filteredSipData = null;
    this.filteredSipData = this.getFlattenData(fData);
    this.generateChartData(this.filteredSipData);
    this.filteredSipData = this.transformFilteredData(this.filteredSipData);
  }
  distillRecordsAccordingToRange(minDate: Date, maxDate: Date) {
    const folioNumber = this.folioForm.get("folioNo").value;
    let fData: Array<SipInterface> = this.distillSipData(folioNumber);

    let dataToReturn = [];
    for (const item of fData) {
      const objToProcess: SipInterface = this.getDeepCopy(item);
      objToProcess.schemes = [];
      for (const el of item.schemes) {
        if (
          new Date(el.startDate) >= minDate &&
          new Date(el.startDate) < maxDate
        ) {
          objToProcess.schemes.push(el);
        }
      } // for-inner
      if (objToProcess.schemes.length > 0) {
        dataToReturn.push(objToProcess);
      }
    }
    return dataToReturn;
  }
  resetFilters() {
    this.startDate = null;
    this.endDate = null;
    const folioNumber = this.folioForm.get("folioNo").value;
    const fData: Array<SipInterface> = this.distillSipData(folioNumber);
    this.filteredSipData = null;
    this.filteredSipData = this.getFlattenData(fData);
    this.generateChartData(this.filteredSipData);
    this.filteredSipData = this.transformFilteredData(this.filteredSipData);
  }
}
