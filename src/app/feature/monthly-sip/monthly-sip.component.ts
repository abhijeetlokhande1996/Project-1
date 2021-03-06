import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "./../../services/database.service";
import {
  take,
  delay,
  distinctUntilChanged,
  mergeMap,
  map,
  filter,
} from "rxjs/operators";
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
import { from } from "rxjs";
import { NavModel } from "../../models/nav.model";
import { NavDataService } from "../../services/nav-data.service";
import { PDFGenerator } from "../../shared/lib/reuse-func";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-monthly-sip",
  templateUrl: "./monthly-sip.component.html",
  styleUrls: ["./monthly-sip.component.css"],
})
export class MonthlySipComponent implements OnInit {
  sipData: Array<SipInterface> = [];
  filteredSipData: Array<IFSipInterface> = [];
  unTransfilteredSipData: Array<IFSipInterface> = [];
  idForm: FormGroup;
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
  navData: Array<NavModel>;
  constructor(
    private dbService: DatabaseService,
    private navDataService: NavDataService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.colHeaderMapArray = [
      ["id", "ID"],
      ["name", "Name"],

      ["folioNumber", "Folio Number"],
      ["schemeName", "Scheme Name"],

      ["startDate", "Start Date"],

      ["amt", "Installment Amount"],
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
    this.idForm = new FormGroup({
      id: new FormControl(null, [Validators.required]),
    });
    this.idForm
      .get("id")
      .valueChanges.pipe(delay(100), distinctUntilChanged())
      .subscribe((id: number) => {
        if (this.startDate && this.endDate) {
          this.onEndDateSelect(this.endDate);
        } else {
          const fData: Array<SipInterface> = this.distillSipData(id);
          this.filteredSipData = this.getFlattenData(fData);
          this.unTransfilteredSipData = JSON.parse(
            JSON.stringify(this.filteredSipData)
          );
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
        console.log(JSON.parse(JSON.stringify(resp)));
        const fNumbersArr = this.getAllFolioNumbers(this.getDeepCopy(resp));
        this.getAllClientDetails(this.getDeepCopy(fNumbersArr)).then(
          (data: Array<{}>) => {
            for (const el of data) {
              if (el["isActive"]) {
                const id = el["id"];
                const clientName = el["name"];
                let itemArr: Array<SipInterface> = resp.filter(
                  (item) => item["id"] == id
                );

                itemArr.forEach((item) => {
                  const idx = this.sipData.findIndex((item) => item.id == id);
                  if (idx < 0) {
                    item["name"] = clientName;
                    this.sipData.push(item);
                  } else {
                    const sItem = this.sipData[idx];
                    sItem.schemes = [...sItem.schemes, ...item.schemes];
                  }
                });
              }
            }

            const fData: Array<SipInterface> = this.distillSipData(null);

            this.filteredSipData = this.getFlattenData(fData);
            this.unTransfilteredSipData = this.getDeepCopy(
              this.filteredSipData
            );
            this.generateChartData(this.filteredSipData);
            this.filteredSipData = this.transformFilteredData(
              this.filteredSipData
            );
          }
        );
      });

    this.dbService.getUsers().subscribe((users) => {
      let data = users.map((item) => {
        return item.payload.doc.data();
      });
      console.log(data);
    });

    this.navDataService.getNavData().subscribe((resp: Array<NavModel>) => {
      this.navData = resp;
    });
  }
  getAllClientDetails(fNumbersArr: Array<number>) {
    return new Promise((resolve, reject) => {
      let count = 0;
      const dataToReturn = [];
      from(fNumbersArr)
        .pipe(
          mergeMap((f) => {
            return this.dbService.isExists("clients", f).pipe(
              map((d) => {
                count++;

                return d;
              })
            );
          })
        )
        .subscribe(
          (resp) => {
            try {
              const d = resp[0].payload.doc.data();
              dataToReturn.push(JSON.parse(JSON.stringify(d)));
            } catch {
              console.log("Error in fetching some records");
            } finally {
              if (count == fNumbersArr.length) {
                resolve(dataToReturn);
              }
            }
          },
          (err) => {
            console.error(err);
          }
        );
    });
  }
  getAllFolioNumbers(mData: Array<SipInterface>) {
    const fNumbers: Array<number> = [];
    for (const item of mData) {
      fNumbers.push(item.id);
    }
    return Array.from(new Set(fNumbers));
  }
  getFlattenData(dataToFlat: Array<SipInterface>) {
    const result = [];
    for (const item of dataToFlat) {
      const objToPush = {};
      objToPush["name"] = item["name"];

      objToPush["id"] = item["id"];
      if (item["schemes"]) {
        for (const el of item.schemes) {
          objToPush["schemeName"] = el["schemeName"];

          objToPush["startDate"] = el["startDate"];
          objToPush["amt"] = el["amt"];
          objToPush["folioNumber"] = el["folioNumber"];
          result.push(this.getDeepCopy(objToPush));
        }
      }
    }

    return result;
  }

  distillSipData(id: number) {
    let dataToReturn = [];
    if (id) {
      dataToReturn = this.getDeepCopy(
        this.sipData.filter((item) => item.id == id)
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
    const datePipe = new DatePipe("en");
    for (const item of data) {
      item["name"] = tcPipe.transform(item["name"]);

      item["schemeName"] = tcPipe.transform(item["schemeName"]);

      item["startDate"] = datePipe.transform(item["startDate"], "dd-MMM-yyyy");
      item["endDate"] = datePipe.transform(item["endDate"], "dd-MMM-yyyy");
      item["amt"] = cp.transform(item["amt"], "INR");
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

      this.chartData.push(item["amt"]);
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

  generatePDF = () => {
    let headers = [];
    let data = [];
    this.colHeaderMapArray.map((heads) => headers.push(heads[1]));
    this.getDeepCopy(this.unTransfilteredSipData).forEach((item) => {
      const nonNullData = [];
      for (const head of this.colHeaderMapArray) {
        nonNullData.push(item[head[0]]);
      }
      data.push(nonNullData);
    });

    data = data.map((item) => {
      item[4] = new DatePipe("en").transform(item[4], "longDate");
      item[5] = new DecimalPipe("en").transform(item[5]);
      return item;
    });
    console.log(headers);
    PDFGenerator([headers], data, "SIP").then(
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
    this.unTransfilteredSipData = this.getDeepCopy(this.filteredSipData);
    this.generateChartData(this.filteredSipData);
    this.filteredSipData = this.transformFilteredData(this.filteredSipData);
  }
  distillRecordsAccordingToRange(minDate: Date, maxDate: Date) {
    const id = this.idForm.get("id").value;
    let fData: Array<SipInterface> = this.distillSipData(id);

    let dataToReturn = [];
    for (const item of fData) {
      const objToProcess: SipInterface = this.getDeepCopy(item);
      objToProcess.schemes = [];
      for (const el of item.schemes) {
        if (
          new Date(el.startDate) >= minDate &&
          new Date(el.startDate) <= maxDate
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
    this.idForm.get("id").setValue(null);
    const fData: Array<SipInterface> = this.distillSipData(null);
    this.filteredSipData = null;
    this.filteredSipData = this.getFlattenData(fData);
    this.generateChartData(this.filteredSipData);
    this.filteredSipData = this.transformFilteredData(this.filteredSipData);
  }
}
