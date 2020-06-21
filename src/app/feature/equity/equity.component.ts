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
      const fData: Array<IEquityCollectionEntity> = this.filterData(
        val,
        JSON.parse(JSON.stringify(this.eqData))
      );
      this.filteredEqData = this.getFlattenData(fData);
      this.unTransfilteredEqData = JSON.parse(
        JSON.stringify(this.filteredEqData)
      );
      this.filteredEqData = this.transformData(this.filteredEqData);
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

    const dataToReturn: Array<IFEquityCollectionEntity> = [];
    for (const item of data) {
      const objToPush = {};
      objToPush["name"] = tp.transform(item.name);
      objToPush["folioNo"] = item.folioNo;
      objToPush["companyName"] = tp.transform(item.companyName);
      objToPush["quantity"] = dp.transform(item.quantity);
      objToPush["rate"] = dp.transform(item.rate);
      objToPush["amt"] = cp.transform(item.amount, "INR");
      objToPush["purchaseDate"] = new DatePipe("en").transform(
        item.purchaseDate,
        "dd-MMM-yyyy"
      );
      dataToReturn.push(JSON.parse(JSON.stringify(objToPush)));
    }
    return dataToReturn;
  }
}
