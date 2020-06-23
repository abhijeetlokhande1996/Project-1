import { Component, OnInit, IterableDiffers } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import {
  IEquityCollectionEntity,
  HoldingsEntity,
  IFEquityCollectionEntity,
} from "./../../interfaces/EquityCollectionEntity.interface";
import { DatabaseService } from "../../services/database.service";
import {
  TitleCasePipe,
  DecimalPipe,
  CurrencyPipe,
  DatePipe,
  UpperCasePipe,
} from "@angular/common";
import * as pluginDataLabels from "chartjs-plugin-datalabels";

import { ChartOptions, ChartType } from "chart.js";
import { Label } from "ng2-charts";
import { PDFGenerator, GetQuote } from "../../shared/lib/reuse-func";
import { ToastrService } from "ngx-toastr";
import * as quote from "stock-quote";

@Component({
  selector: "app-equity",
  templateUrl: "./equity.component.html",
  styleUrls: ["./equity.component.css"],
})
export class EquityComponent implements OnInit {
  eqData: Array<IEquityCollectionEntity>;
  filteredEqData: Array<IFEquityCollectionEntity>;
  unTransfilteredEqData: Array<IFEquityCollectionEntity>;
  equityForm: FormGroup;
  colHeaderMapArray: Array<Array<string>>;
  startDate = null;
  endDate = null;
  chartOptions: ChartOptions;
  chartType: ChartType;
  chartLegend: boolean;
  chartLabel: Array<Label>;
  chartData: Array<number>;
  chartColor: Array<{}>;

  chartPlugins = [pluginDataLabels];
  constructor(
    private dbService: DatabaseService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.colHeaderMapArray = [
      ["id", "ID"],
      ["name", "Name"],
      ["companyName", "Company Name"],
      ["purchaseDate", "Purchase Date"],
      ["rate", "Entered Rate"],
      ["quantity", "Quantity"],
      ["amt", "Amount Invested"],
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
    this.equityForm = new FormGroup({
      id: new FormControl(null, [Validators.required]),
    });
    this.dbService.getEquities().subscribe((resp) => {
      this.eqData = resp;

      const fData: Array<IEquityCollectionEntity> = this.filterData(
        null,
        JSON.parse(JSON.stringify(this.eqData))
      );
      this.filteredEqData = this.getFlattenData(fData);
      this.unTransfilteredEqData = JSON.parse(
        JSON.stringify(this.filteredEqData)
      );
      this.filteredEqData = this.transformData(this.filteredEqData);
    });
    this.equityForm.get("id").valueChanges.subscribe((val) => {
      if (this.startDate && this.endDate) {
        this.onEndDateSelect(this.endDate);
      } else {
        const fData: Array<IEquityCollectionEntity> = this.filterData(
          val,
          JSON.parse(JSON.stringify(this.eqData))
        );
        this.filteredEqData = this.getFlattenData(fData);
        this.unTransfilteredEqData = JSON.parse(
          JSON.stringify(this.filteredEqData)
        );

        this.filteredEqData = this.transformData(this.filteredEqData);
        this.generateChartData(this.unTransfilteredEqData);
      }
    });
  }
  getFlattenData(
    data: Array<IEquityCollectionEntity>
  ): Array<IFEquityCollectionEntity> {
    const dataToReturn: Array<IFEquityCollectionEntity> = [];
    for (const item of data) {
      const name = item.name;
      const id = item.id;
      for (const el of item.holdings) {
        const objToPush = { ...{ id: id, name: name }, ...el };
        dataToReturn.push(objToPush);
      } // for
    } // for
    return dataToReturn;
  }
  filterData(id: number | null, data: Array<IEquityCollectionEntity>) {
    if (id) {
      return data.filter((item) => item.id == id);
    }
    return data;
  }
  transformData(data: Array<IFEquityCollectionEntity>) {
    const tp = new TitleCasePipe();
    const dp = new DecimalPipe("en");
    const cp = new CurrencyPipe("en");
    const up = new UpperCasePipe();

    const dataToReturn: Array<IFEquityCollectionEntity> = [];
    for (const item of data) {
      const objToPush = {};
      objToPush["name"] = tp.transform(item.name);
      objToPush["id"] = item.id;
      objToPush["companyName"] = up.transform(item.companyName);
      objToPush["quantity"] = item.quantity;
      objToPush["rate"] = cp.transform(item.rate, "INR");
      objToPush["amt"] = cp.transform(item.amt, "INR");
      objToPush["purchaseDate"] = new DatePipe("en").transform(
        item.purchaseDate,
        "dd-MMM-yyyy"
      );
      dataToReturn.push(JSON.parse(JSON.stringify(objToPush)));
    }
    return dataToReturn;
  }
  onStartDateSelect(date) {
    this.endDate = null;
  }
  distillRecordsAccordingToRange(minDate: Date, maxDate: Date) {
    const folioNumber = this.equityForm.get("id").value;
    let fData: Array<IEquityCollectionEntity> = this.filterData(
      folioNumber,
      this.eqData
    );

    let dataToReturn = [];
    for (const item of fData) {
      const objToProcess: IEquityCollectionEntity = this.getDeepCopy(item);
      objToProcess.holdings = [];
      for (const el of item.holdings) {
        if (
          new Date(el.purchaseDate) >= minDate &&
          new Date(el.purchaseDate) <= maxDate
        ) {
          objToProcess.holdings.push(el);
        }
      } // for-inner
      if (objToProcess.holdings.length > 0) {
        dataToReturn.push(objToProcess);
      }
    }
    return dataToReturn;
  }
  onEndDateSelect(date) {
    const startDay = this.startDate["day"];
    const startMonth = this.startDate["month"] - 1;
    const startYear = this.startDate["year"];

    const endDay = this.endDate["day"];
    const endMonth = this.endDate["month"] - 1;
    const endYear = this.endDate["year"];

    const minDate: Date = new Date(startYear, startMonth, startDay);
    const maxDate: Date = new Date(endYear, endMonth, endDay);
    let fData: Array<IEquityCollectionEntity> = this.distillRecordsAccordingToRange(
      minDate,
      maxDate
    );
    this.filteredEqData = null;
    this.filteredEqData = this.getFlattenData(fData);
    this.unTransfilteredEqData = this.getDeepCopy(this.filteredEqData);
    this.generateChartData(this.unTransfilteredEqData);
    this.filteredEqData = this.transformData(this.filteredEqData);
  }
  getDeepCopy(item: any) {
    if (item) {
      return JSON.parse(JSON.stringify(item));
    }
    return item;
  }
  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  generateChartData(data: Array<IFEquityCollectionEntity>) {
    this.chartColor = null;
    this.chartLabel = null;
    this.chartData = null;
    this.chartLabel = [];
    this.chartData = [];
    this.chartColor = [{ backgroundColor: [] }];
    for (const item of data) {
      if (this.chartLabel.indexOf(item.companyName.toUpperCase()) < 0) {
        this.chartLabel.push(item.companyName.toUpperCase());
      }

      this.chartData.push(item.amt);
      while (true) {
        const colorHexCode = this.getRandomColor();
        if (this.chartColor[0]["backgroundColor"].indexOf(colorHexCode) == -1) {
          this.chartColor[0]["backgroundColor"].push(colorHexCode);
          break;
        }
      }
    }
  }
  resetFilters() {
    this.startDate = null;
    this.endDate = null;
    // const folioNumber = this.equityForm.get("id").value;
    this.equityForm.get("id").setValue(null);
    const fData: Array<IEquityCollectionEntity> = this.filterData(
      null,
      this.eqData
    );
    this.filteredEqData = null;
    this.filteredEqData = this.getFlattenData(fData);
    this.unTransfilteredEqData = this.getDeepCopy(this.unTransfilteredEqData);
    //this.generateChartData(this.filteredMfData);
    this.filteredEqData = this.transformData(this.filteredEqData);
  }

  generatePdf = () => {
    let headers = [];
    let data = [];
    this.colHeaderMapArray.map((heads) => headers.push(heads[1]));

    for (const item of this.unTransfilteredEqData) {
      const nonNullData = [];
      for (const head of this.colHeaderMapArray) {
        let val = item[head[0]];
        if (head[0].toLowerCase() == "purchasedate") {
          val = new DatePipe("en").transform(val, "dd-MMM-yyyy");
        } else if (head[0].toLowerCase() == "amt") {
          val = new DecimalPipe("en").transform(val);
        }
        nonNullData.push(val);
      }

      data.push(JSON.parse(JSON.stringify(nonNullData)));
    }

    PDFGenerator([headers], data, "Equity").then(
      (res: { status: Boolean; message: string }) => {
        if (res.status) {
          setTimeout(() => {
            this.toastrService.success(res.message);
          }, 5000);
        } else {
          setTimeout(() => {
            this.toastrService.error(res.message);
          }, 5000);
        }
      }
    );
  };
}
