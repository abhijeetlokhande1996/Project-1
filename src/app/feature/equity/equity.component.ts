import { Component, OnInit } from "@angular/core";
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
  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.colHeaderMapArray = [
      ["name", "Name"],
      ["folioNo", "Id"],
      ["companyName", "Company Name"],
      ["purchaseDate", "Purchase Date"],
      ["rate", "Rate"],
      ["quantity", "Quantity"],
      ["amt", "Amount Invested"],
    ];
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
      }
    });
  }
  getFlattenData(
    data: Array<IEquityCollectionEntity>
  ): Array<IFEquityCollectionEntity> {
    const dataToReturn: Array<IFEquityCollectionEntity> = [];
    for (const item of data) {
      const name = item.name;
      const folioNumber = item.folioNo;
      for (const el of item.holdings) {
        const objToPush = { ...{ folioNo: folioNumber, name: name }, ...el };
        dataToReturn.push(objToPush);
      } // for
    } // for
    return dataToReturn;
  }
  filterData(folioNo: number | null, data: Array<IEquityCollectionEntity>) {
    if (folioNo) {
      return data.filter((item) => item.folioNo == folioNo);
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
      objToPush["folioNo"] = item.folioNo;
      objToPush["companyName"] = up.transform(item.companyName);
      objToPush["quantity"] = item.quantity;
      objToPush["rate"] = cp.transform(item.rate, "INR");
      objToPush["amt"] = cp.transform(item.amount, "INR");
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
          new Date(el.purchaseDate) < maxDate
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
    // this.generateChartData(this.filteredMfData);
    this.filteredEqData = this.transformData(this.filteredEqData);
  }
  getDeepCopy(item: any) {
    if (item) {
      return JSON.parse(JSON.stringify(item));
    }
    return item;
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
}
