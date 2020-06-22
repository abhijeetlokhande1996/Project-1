import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  QueryList,
  ElementRef,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NavModel } from "../../../models/nav.model";
import { IAddScheme } from "./../../..//interfaces/IAddScheme.interface";
@Component({
  selector: "app-add-scheme",
  templateUrl: "./add-scheme.component.html",
  styleUrls: ["./add-scheme.component.css"],
})
export class AddSchemeComponent implements OnInit {
  schemeForm: FormGroup;
  schemeNameArr: Array<string>;
  collectionArr = ["Mutual Fund", "SIP", "Equity"];
  freqType = ["Monthly", "Yearly", "Quaterly"];
  @Input() navData: Array<NavModel>;
  @Input() mFundAndSchemeMapping: {};
  filteredMFFamily: Array<string> = [];
  filteredFunds: Array<string> = [];
  selectedFundFamily: string = null;
  selectedFundType: string = null;

  @Output() schemeDataEventEmitter: EventEmitter<
    IAddScheme
  > = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.schemeForm = new FormGroup({
      schemeName: new FormControl(null, [Validators.required]),
      schemeCode: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      folioNumber: new FormControl(null, [Validators.required]),
      startDate: new FormControl({ year: 2020, month: 6, day: 6 }, [
        Validators.required,
      ]),
      freqType: new FormControl({ value: "Monthly", disabled: true }, [
        Validators.required,
      ]),
      mFundFamily: new FormControl(null, [Validators.required]),
      amt: new FormControl(null, [Validators.required]),
      nav: new FormControl(null, [Validators.required]),
      units: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      collection: new FormControl(null, [Validators.required]),
    });
    this.triggerValueChanges();
  }
  triggerValueChanges() {
    this.schemeForm
      .get("schemeName")
      .valueChanges.subscribe((selectedSchemeName: string) => {
        this.filteredFunds = this.mFundAndSchemeMapping[
          this.selectedFundFamily
        ].filter((item) =>
          item.toLowerCase().includes(selectedSchemeName.toLowerCase())
        );
      });
    this.schemeForm
      .get("mFundFamily")
      .valueChanges.subscribe((selectedFundName: string) => {
        this.filteredMFFamily = Object.keys(
          this.mFundAndSchemeMapping
        ).filter((item) =>
          item.toLowerCase().includes(selectedFundName.toLowerCase())
        );
      });

    this.schemeForm.get("amt").valueChanges.subscribe((amt) => {
      const nav = this.schemeForm.get("nav").value;
      const units = this.calculatedUnits(amt, nav);
      this.schemeForm.get("units").setValue(units);
    });
    this.schemeForm.get("nav").valueChanges.subscribe((nav) => {
      const amt = this.schemeForm.get("amt").value;
      const units = this.calculatedUnits(amt, nav);
      this.schemeForm.get("units").setValue(units);
    });
  }
  calculatedUnits(amt: number, nav: number) {
    let units = null;
    if (amt && nav) {
      units = amt / nav;
      units = Math.round(units * 10) / 10;
    }
    return units;
  }

  onSchemeFormSubmit() {
    const objToSend = JSON.parse(JSON.stringify(this.schemeForm.getRawValue()));
    const year = objToSend["startDate"]["year"];
    const month = objToSend["startDate"]["month"] - 1;
    const date = objToSend["startDate"]["day"];
    objToSend["startDate"] = new Date(year, month, date).toString();

    this.schemeDataEventEmitter.emit(objToSend);
  }

  selectedMF = (item: string) => {
    this.selectedFundFamily = item;
    this.schemeForm.patchValue({ mFundFamily: item });
    this.filteredMFFamily = [];
    this.filteredFunds = this.mFundAndSchemeMapping[item].sort();
  };

  selectedFund = (fund: string) => {
    this.schemeForm.patchValue({ schemeName: fund });
    this.filteredFunds = [];
    const item: NavModel = this.navData.filter(
      (item: NavModel) => item.schemeName.toLowerCase() === fund.toLowerCase()
    )[0];
    this.schemeForm.get("schemeCode").setValue(item.schemeCode);
  };
}
