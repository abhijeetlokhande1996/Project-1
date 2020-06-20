import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import {
  EquityCollectionEntity,
  HoldingsEntity,
} from "./../../interfaces/EquityCollectionEntity.interface";
import { DatabaseService } from "../../services/database.service";
import { IEquity } from "../../interfaces/IEquity.interface";
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
  eqData: Array<IEquity>;
  filteredEqData: Array<IEquity>;
  unTransfilteredEqData: Array<IEquity>;
  equityForm: FormGroup;
  colHeaderMapArray: Array<Array<string>>;
  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.colHeaderMapArray = [
      ["clientName", "Name"],
      ["companyName", "Company Name"],
      ["purchaseDate", "Purchase Date"],
      ["rate", "Rate"],
      ["quantity", "Quantity"],
      ["amt", "Amount Invested"],
    ];
    this.equityForm = new FormGroup({
      clientName: new FormControl(null, [Validators.required]),
    });
    this.dbService.getEquities().subscribe((resp) => {
      this.eqData = resp;
      this.filteredEqData = this.filterData(
        null,
        JSON.parse(JSON.stringify(this.eqData))
      );
      this.unTransfilteredEqData = JSON.parse(
        JSON.stringify(this.filteredEqData)
      );
      this.filteredEqData = this.transformData(
        JSON.parse(JSON.stringify(this.filteredEqData))
      );
    });
    this.equityForm.get("clientName").valueChanges.subscribe((val) => {
      this.filteredEqData = this.filterData(
        val,
        JSON.parse(JSON.stringify(this.eqData))
      );
      this.unTransfilteredEqData = JSON.parse(
        JSON.stringify(this.filteredEqData)
      );
      this.filteredEqData = this.transformData(
        JSON.parse(JSON.stringify(this.filteredEqData))
      );
    });
  }
  filterData(clientName: string | null, data: Array<IEquity>) {
    if (clientName) {
      return data.filter(
        (item) =>
          item.clientName.toLowerCase().includes(clientName.toLowerCase()) ||
          item.clientName.toLowerCase() == clientName.toLowerCase()
      );
    }
    return data;
  }
  transformData(data: Array<IEquity>) {
    const tp = new TitleCasePipe();
    const dp = new DecimalPipe("en");
    const cp = new CurrencyPipe("en");

    const dataToReturn: Array<IEquity> = [];
    for (const item of data) {
      const objToPush = {};
      objToPush["clientName"] = tp.transform(item.clientName);
      objToPush["amount"] = dp.transform(item.amount);
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
