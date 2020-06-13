import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "./../../services/database.service";
import { take, delay, distinctUntilChanged } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SipInterface } from "../../interfaces/sip.interface";
import { ChartType, ChartOptions } from "chart.js";
import { Label } from "ng2-charts";
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
      .subscribe((resp) => (this.sipData = resp));
  }
  distillSipData(folioNo: number) {
    if (folioNo) {
      this.filteredSipData = this.getDeepCopy(
        this.sipData.filter((item) => item.folioNo == folioNo)
      );
      this.generateChartData(this.filteredSipData);
    } else {
      this.filteredSipData = this.getDeepCopy(this.sipData);
      this.generateChartData(this.filteredSipData);
    }
  }
  generateChartData(data: Array<SipInterface>) {
    this.chartColor = null;
    this.chartLabel = null;
    this.chartData = null;
    this.chartLabel = [];
    this.chartData = [];
    this.chartColor = [{ backgroundColor: [] }];
    for (const item of data) {
      item.schemes.forEach((el) => {
        this.chartLabel.push(el.schemeName.toUpperCase());
        this.chartData.push(el.installmentAmt);
        this.chartColor[0]["backgroundColor"].push(this.getRandomColor());
      });
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
