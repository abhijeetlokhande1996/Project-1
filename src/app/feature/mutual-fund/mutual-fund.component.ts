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

@Component({
  selector: "app-mutual-fund",
  templateUrl: "./mutual-fund.component.html",
  styleUrls: ["./mutual-fund.component.css"],
})
export class MutualFundComponent implements OnInit {
  mfData: Array<IMutualFund> = [];
  filterData: Array<IFMutualFund> = [];
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

  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
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
        console.log(this.mfData);
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
    console.log(this.chartLabel, this.chartData);
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
