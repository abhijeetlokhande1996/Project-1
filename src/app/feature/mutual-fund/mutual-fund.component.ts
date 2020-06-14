import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../services/database.service";
import { take, delay, distinctUntilChanged } from "rxjs/operators";
import {
  IMutualFund,
  IFMutualFund,
} from "../../interfaces/IMutualFund.interface";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ChartOptions, ChartType } from "chart.js";
import { Label } from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import "chart.piecelabel.js";
import {
  TitleCasePipe,
  CurrencyPipe,
  DecimalPipe,
  DatePipe,
} from "@angular/common";

@Component({
  selector: "app-mutual-fund",
  templateUrl: "./mutual-fund.component.html",
  styleUrls: ["./mutual-fund.component.css"],
})
export class MutualFundComponent implements OnInit {
  mfData: Array<IMutualFund> = [];

  folioForm: FormGroup;
  displayAs = ["table", "graph"];
  selectedDisplay = "table";
  filteredMfData: Array<IFMutualFund> = [];
  chartOptions: ChartOptions;
  chartType: ChartType;
  chartLegend: boolean;
  chartLabel: Array<Label>;
  chartData: Array<number>;
  chartColor: Array<{}>;
  chartPlugins = [pluginDataLabels];
  colHeaderMapArray = [];

  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.colHeaderMapArray = [
      ["clientName", "Name"],
      ["regDate", "Registration Date"],
      ["folioNo", "Folio Number"],
      ["schemeName", "Scheme Name"],
      ["freqType", "Frequency Type"],
      ["startDate", "Start Date"],
      ["endDate", "End Date"],
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
    this.dbService
      .getMFs()
      .pipe(take(1))
      .subscribe((mfs) => {
        this.mfData = mfs;

        this.distillMFData(null);
      });

    this.folioForm = new FormGroup({
      folioNo: new FormControl(null, [Validators.required]),
    });
    this.folioForm
      .get("folioNo")
      .valueChanges.pipe(delay(500), distinctUntilChanged())
      .subscribe((folioNo: number) => {
        if (!folioNo) {
          this.selectedDisplay = "table";
        }
        this.distillMFData(folioNo);
      });
  }

  distillMFData(folioNo: number) {
    if (folioNo) {
      const tmpData = this.getDeepCopy(
        this.mfData.filter((item) => item.folioNo == folioNo)
      );
      this.filteredMfData = this.getFlattenData(tmpData);
      if (folioNo) {
        this.generateChartData(this.filteredMfData);
      }
    } else {
      this.filteredMfData = this.getFlattenData(this.mfData);
      if (folioNo) {
        this.generateChartData(this.filteredMfData);
      }
    }
    this.filteredMfData = this.transformFilteredData(this.filteredMfData);
  }

  getDeepCopy(item: any) {
    if (item) {
      return JSON.parse(JSON.stringify(item));
    }
  }

  getFlattenData(dataToFlat: Array<IMutualFund>) {
    const result: Array<IFMutualFund> = [];
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
          objToPush["endDate"] = el["endDate"];
          objToPush["installmentAmt"] = el["installmentAmt"];
          result.push(this.getDeepCopy(objToPush));
        }
      }
    }
    return result;
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
  transformFilteredData(data) {
    data = this.getDeepCopy(data);
    const tcPipe = new TitleCasePipe();
    const cp = new CurrencyPipe("en");
    const dp = new DecimalPipe("en");
    const datePipe = new DatePipe("en");
    for (const item of data) {
      item["clientName"] = tcPipe.transform(item["clientName"]);
      item["regDate"] = datePipe.transform(item["regDate"], "longDate");
      item["folioNo"] = dp.transform(item["folioNo"]);
      item["schemeName"] = tcPipe.transform(item["schemeName"]);
      item["freqType"] = tcPipe.transform(item["freqType"]);
      item["startDate"] = datePipe.transform(item["startDate"], "longDate");
      item["endDate"] = datePipe.transform(item["endDate"], "longDate");
      item["installmentAmt"] = cp.transform(item["installmentAmt"], "INR");
    }
    return data;
  }
  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
