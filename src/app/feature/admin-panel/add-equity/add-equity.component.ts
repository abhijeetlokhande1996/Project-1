import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IAddEquity } from "../../../interfaces/IEquity.interface";
import listings from "./../../../../assets/json/listings.json";
@Component({
  selector: "app-add-equity",
  templateUrl: "./add-equity.component.html",
  styleUrls: ["./add-equity.component.css"],
})
export class AddEquityComponent implements OnInit {
  listingJson: Array<{}>;
  equityForm: FormGroup;
  @Output() eqDataEventEmitter: EventEmitter<IAddEquity> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.listingJson = listings;
    this.equityForm = new FormGroup({
      folioNumber: new FormControl(null, [Validators.required]),
      companyName: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      rate: new FormControl(null, [Validators.required]),
      amt: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      purchaseDate: new FormControl(null, [Validators.required]),
      isin: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      symbol: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
    });

    this.equityForm.get("quantity").valueChanges.subscribe((val) => {
      const rate = this.equityForm.get("rate").value;
      let amt = val * rate;
      amt = amt ? amt : null;

      this.equityForm.get("amt").setValue(amt);
    });
    this.equityForm.get("rate").valueChanges.subscribe((val) => {
      const quantity = this.equityForm.get("quantity").value;
      let amt = val * quantity;
      amt = amt ? amt : null;

      this.equityForm.get("amt").setValue(amt);
    });
    this.equityForm.get("companyName").valueChanges.subscribe((val) => {
      const index = this.listingJson.findIndex((item) => {
        return item["Company"] == val;
      });
      const isin = this.listingJson[index]["ISIN"];
      const symbol = this.listingJson[index]["Symbol"];
      this.equityForm.get("isin").setValue(isin);
      this.equityForm.get("symbol").setValue(symbol);
    });
  }
  onSubmit() {
    const objToEmit: IAddEquity = this.equityForm.getRawValue();
    const purchaseDate = this.equityForm.get("purchaseDate").value;
    const year = purchaseDate["year"];
    const month = purchaseDate["month"] - 1;
    const day = purchaseDate["day"];
    objToEmit.purchaseDate = new Date(year, month, day).toString();

    this.eqDataEventEmitter.emit(objToEmit);
  }
}
