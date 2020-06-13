import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "./../../services/database.service";
import { take, delay, distinctUntilChanged } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SipInterface } from "../../interfaces/sip.interface";
import { ChartType, ChartOptions } from "chart.js";
import { Label } from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";

@Component({
  selector: "app-monthly-sip",
  templateUrl: "./monthly-sip.component.html",
  styleUrls: ["./monthly-sip.component.css"],
})
export class MonthlySipComponent implements OnInit {
  sipData: Array<SipInterface> = [];
  filteredSipData: Array<SipInterface> = [];
  folioForm: FormGroup;
  chartOptions: ChartOptions;
  chartType: ChartType;
  chartLegend: boolean;
  chartLabel: Array<Label>;
  chartData: Array<number>;
  chartColor: Array<{}>;
  displayAs = ["table", "graph"];
  selectedDisplay = "table";
  chartPlugins = [pluginDataLabels];
  
  
  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.chartType = "pie";
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
      .valueChanges.pipe(delay(500), distinctUntilChanged())
      .subscribe((folioNo: number) => this.distillSipData(folioNo));
    this.dbService
      .getSipData()
      .pipe(take(1))
      .subscribe((resp) => {
        this.sipData = resp;
        this.distillSipData(null);
      });

    // this.dbService.getUser().subscribe(res => console.log(res));
    this.dbService.getUsers().subscribe(users => {
      let data = users.map(item => {
        return item.payload.doc.data()
      });
      console.log(data);
    });

    // this.dbService.addSip().then(res => console.log(res));

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
          objToPush["endDate"] = el["endDate"];
          objToPush["installmentAmt"] = el["installmentAmt"];
          result.push(this.getDeepCopy(objToPush));
        }
      }
    }
    return result;
  }
  distillSipData(folioNo: number) {
    if (folioNo) {
      const tmpData = this.getDeepCopy(
        this.sipData.filter((item) => item.folioNo == folioNo)
      );
      this.filteredSipData = this.getFlattenData(tmpData);
      if (folioNo) {
        this.generateChartData(this.filteredSipData);
      }
    } else {
      this.filteredSipData = this.getFlattenData(this.sipData);
      if (folioNo) {
        this.generateChartData(this.filteredSipData);
      }
    }
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
      this.chartColor[0]["backgroundColor"].push(this.getRandomColor());
    }
    console.log(this.chartLabel, this.chartData);
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
}
