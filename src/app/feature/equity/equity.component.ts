import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import {
  EquityCollectionEntity,
  HoldingsEntity,
} from "./../../interfaces/EquityCollectionEntity.interface";
import { DatabaseService } from "../../services/database.service";
import { IEquity } from "../../interfaces/IEquity.interface";
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
      console.log(this.eqData);
    });
    this.equityForm.get("clientName").valueChanges.subscribe((val) => {
      this.filterEqData(val, JSON.parse(JSON.stringify(this.eqData)));
    });
  }
  filterEqData(clientName: string, data: Array<EquityCollectionEntity>) {}
}
