import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DatabaseService } from "./../../services/database.service";
import {
  take,
  delay,
  distinctUntilChanged,
  finalize,
  mergeMap,
  concatMap,
  switchMap,
  map,
} from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SipInterface, IFSipInterface } from "../../interfaces/sip.interface";
import { ChartType, ChartOptions } from "chart.js";
import { Label } from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import "chart.piecelabel.js";
import { pdfMaker } from "./../../shared/lib/pdf-maker";

import {
  TitleCasePipe,
  CurrencyPipe,
  DecimalPipe,
  DatePipe,
} from "@angular/common";
import {
  IFMutualFund,
  IMutualFund,
} from "../../interfaces/IMutualFund.interface";
import { NavModel } from "../../models/nav.model";
import { NavDataService } from "../../services/nav-data.service";
import { from, merge, of } from "rxjs";
import { PDFGenerator } from "../../shared/lib/reuse-func";

@Component({
  selector: "app-monthly-sip",
  templateUrl: "./mutual-fund.component.html",
  styleUrls: ["./mutual-fund.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class MutualFundComponent implements OnInit {
  mfData: Array<IMutualFund> = [];
  filteredMfData: Array<IFMutualFund> = [];
  unTransFilteredMfData: Array<IFMutualFund> = [];
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
  navData: Array<NavModel>;
  constructor(
    private dbService: DatabaseService,
    private navDataService: NavDataService
  ) {}

  ngOnInit(): void {
    this.colHeaderMapArray = [
      ["clientName", "Name"],

      ["folioNo", "Folio Number"],
      ["schemeName", "Scheme Name"],
      ["freqType", "Frequency Type"],
      ["startDate", "Start Date"],
      ["amt", "Amount"],
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
          const fData: Array<SipInterface> = this.distillMFData(folioNo);
          this.filteredMfData = this.getFlattenData(fData);
          this.unTransFilteredMfData = this.getDeepCopy(this.filteredMfData);
          this.generateChartData(this.filteredMfData);
          this.filteredMfData = this.transformFilteredData(this.filteredMfData);
        }
      });
    this.dbService
      .getMFs()
      .pipe(take(1))
      .subscribe((resp) => {
        console.log("MF ", resp);
        const fNumbersArr = this.getAllFolioNumbers(this.getDeepCopy(resp));

        this.getAllClientDetails(this.getDeepCopy(fNumbersArr)).then(
          (data: Array<{}>) => {
            for (const el of data) {
              if (el["isActive"]) {
                const fNumber = el["folioNo"];
                const clientName = el["name"];
                let itemArr = resp.filter((item) => item["folioNo"] == fNumber);

                itemArr.forEach((item) => {
                  const idx = this.mfData.findIndex(
                    (item) => item.folioNo == fNumber
                  );
                  if (idx < 0) {
                    item["clientName"] = clientName;
                    this.mfData.push(item);
                  } else {
                    const sItem = this.mfData[idx];
                    sItem.schemes = [...sItem.schemes, ...item.schemes];
                  }
                });
              }
            }

            const fData: Array<SipInterface> = this.distillMFData(null);

            this.filteredMfData = this.getFlattenData(fData);
            this.unTransFilteredMfData = this.getDeepCopy(this.filteredMfData);
            this.generateChartData(this.filteredMfData);
            this.filteredMfData = this.transformFilteredData(
              this.filteredMfData
            );
          }
        );
      });
    this.navDataService.getNavData().subscribe((resp: Array<NavModel>) => {
      this.navData = resp;
    });
    this.dbService.getUsers().subscribe((users) => {
      let data = users.map((item) => {
        return item.payload.doc.data();
      });
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
  getAllFolioNumbers(mData: Array<IMutualFund>) {
    const fNumbers: Array<number> = [];
    for (const item of mData) {
      fNumbers.push(item.folioNo);
    }
    return fNumbers;
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

          objToPush["amt"] = el["amt"];
          result.push(this.getDeepCopy(objToPush));
        }
      }
    }
    return result;
  }

  distillMFData(folioNo: number) {
    let dataToReturn = [];
    if (folioNo) {
      dataToReturn = this.getDeepCopy(
        this.mfData.filter((item) => item.folioNo == folioNo)
      );
    } else {
      dataToReturn = this.getDeepCopy(this.mfData);
    }
    // temporary code to be deleted

    return dataToReturn;
  }
  transformFilteredData(data: Array<IFMutualFund>) {
    data = this.getDeepCopy(data);
    const tcPipe = new TitleCasePipe();
    const cp = new CurrencyPipe("en");
    const datePipe = new DatePipe("en");
    for (const item of data) {
      item["clientName"] = tcPipe.transform(item["clientName"]);
      item["regDate"] = datePipe.transform(item["regDate"], "dd-MMM-yyyy");
      item["folioNo"] = item["folioNo"];
      item["schemeName"] = tcPipe.transform(item["schemeName"]);
      item["freqType"] = tcPipe.transform(item["freqType"]);
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

  generatePdf = () => {
    let headers = [];
    let data = [];
    this.colHeaderMapArray.map((heads) => headers.push(heads[1]));
    this.filteredMfData.map((value) => {
      const nonNullData = Object.values(value).filter((data) => data);
      data.push(nonNullData);
    });
    console.log(data);
    PDFGenerator([headers], data);
  };

  onClickPrint() {
    const columns = [
      {
        id: "clientName",
        header: "Name",
        align: "center",
        width: 100,
        height: 100,
        valign: "center",
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
        id: "startDate",
        header: "Start Date",
        width: 100,
        valign: "center",
        align: "center",
      },
      {
        id: "totalAmtInvested",
        header: "Total Amount Invested",
        width: 100,
        valign: "center",
        align: "center",
      },
      {
        id: "currentValue",
        header: "Current Value",
        width: 100,
        valign: "center",
        align: "center",
      },
    ];

    const dataToSend: Array<{}> = [];
    for (const item of this.unTransFilteredMfData) {
      let nav = 0;
      const idx = this.navData.findIndex(
        (el: NavModel) =>
          el.schemeName.toLowerCase() == item.schemeName.toLowerCase()
      );
      if (idx >= 0) {
        nav = this.navData[idx].netAssetValue;
      }

      const objToPush = {
        clientName: item.clientName.toUpperCase(),

        folioNo: item.folioNo,
        schemeName: item.schemeName.toUpperCase(),
        startDate: new DatePipe("en").transform(
          new Date(item.startDate),
          "longDate"
        ),
        totalAmtInvested: new DecimalPipe("en").transform(item.amt),
        currentValue: nav,
      };
      dataToSend.push(objToPush);
    }

    const status = pdfMaker(columns, dataToSend, "mutual-fund-statement.pdf");
    setTimeout(() => {
      if (status) {
        alert("Success");
      } else {
        alert("Failure");
      }
    }, 500);
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
    this.filteredMfData = null;
    this.filteredMfData = this.getFlattenData(fData);
    this.unTransFilteredMfData = this.getDeepCopy(this.filteredMfData);
    this.generateChartData(this.filteredMfData);
    this.filteredMfData = this.transformFilteredData(this.filteredMfData);
  }
  distillRecordsAccordingToRange(minDate: Date, maxDate: Date) {
    const folioNumber = this.folioForm.get("folioNo").value;
    let fData: Array<SipInterface> = this.distillMFData(folioNumber);

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
    const fData: Array<SipInterface> = this.distillMFData(folioNumber);
    this.filteredMfData = null;
    this.filteredMfData = this.getFlattenData(fData);
    this.unTransFilteredMfData = this.getDeepCopy(this.filteredMfData);
    this.generateChartData(this.filteredMfData);
    this.filteredMfData = this.transformFilteredData(this.filteredMfData);
  }
}
