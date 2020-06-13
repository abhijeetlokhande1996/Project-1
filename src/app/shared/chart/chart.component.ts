import { Component, OnInit, Input } from "@angular/core";
import { Label } from "ng2-charts";
import { ChartType, ChartOptions } from "chart.js";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"],
})
export class ChartComponent implements OnInit {
  @Input() chartData: Array<number>;
  @Input() chartType: string;
  @Input() chartLegend: boolean;
  @Input() chartLabels: Array<Label>;
  @Input() chartOptions: ChartOptions;
  @Input() chartColor: Array<{}>;
  @Input() chartPlugins: Array<any>;
  constructor() {}

  ngOnInit(): void {}
}
