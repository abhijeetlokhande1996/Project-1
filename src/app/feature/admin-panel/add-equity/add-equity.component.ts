import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  IterableDiffers,
  Input,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IAddEquity } from "../../../interfaces/IEquity.interface";
import { IClient } from "../../../interfaces/IClient.interface";

@Component({
  selector: "app-add-equity",
  templateUrl: "./add-equity.component.html",
  styleUrls: ["./add-equity.component.css"],
})
export class AddEquityComponent implements OnInit {
  listingJson: Array<{}>;
  equityForm: FormGroup;
  filteredStock: Array<{}> = [];
  clientsArr: Array<{}>;
  filteredClientsArr: Array<{}>;
  isLoading: boolean = false;
  @Output() eqDataEventEmitter: EventEmitter<IAddEquity> = new EventEmitter();

  @Input()
  set clientDetails(cd: Array<IClient>) {
    if (cd) {
      this.clientsArr = cd.map((item) => {
        return {
          name: item.name,
          id: item.id,
        };
      });
    }
    this.filteredClientsArr = this.clientsArr;
  }
  constructor() {}

  ngOnInit(): void {
    this.listingJson = this.readJsonFile();

    this.filteredStock = this.listingJson;
    this.equityForm = new FormGroup({
      id: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      clientName: new FormControl(null, [Validators.required]),

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
      this.filteredStock = this.listingJson.filter(
        (item) =>
          item["Symbol"].toLowerCase().includes(val.toLowerCase()) ||
          item["Company"].toLowerCase().includes(val.toLowerCase())
      );
    });
    this.equityForm.get("clientName").valueChanges.subscribe((val: string) => {
      this.fileredClientsArr = this.clientsArr.filter((item) =>
        item["name"].toLowerCase().startsWith(val.toLowerCase())
      );
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
  readJsonFile() {
    const path = window.require("path");
    const fs = window.require("fs");
    const filePath = path.resolve("C:\\Lincoln Tech\\listings.json");
    let rawdata = fs.readFileSync(filePath);
    const listingsArr = JSON.parse(rawdata);

    return JSON.parse(JSON.stringify(listingsArr));
  }

  selectedScript = (script) => {
    this.equityForm.get("companyName").setValue(script["Company"]);
    this.equityForm.get("isin").setValue(script["ISIN"]);
    this.equityForm.get("symbol").setValue(script["Symbol"]);
    this.filteredStock = [];
  };
  onClickClientName(item) {
    this.equityForm.get("id").setValue(item["id"]);
    this.equityForm.get("clientName").setValue(item["name"]);
    this.filteredClientsArr = [];
  }
}
