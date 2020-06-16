import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControlName,
  Validators,
  FormControl,
} from "@angular/forms";
import { NavDataService } from "../../services/nav-data.service";
import { take } from "rxjs/operators";
import { NavModel } from "../../models/nav.model";
import { CommentStmt } from "@angular/compiler";
@Component({
  selector: "app-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.css"],
})
export class AdminPanelComponent implements OnInit {
  passwordForm: FormGroup;
  clientForm: FormGroup;
  schemeForm: FormGroup;
  isAuthenticated: boolean;
  collectionArr = ["Mutual Fund", "SIP", "Equity"];
  freqType = ["Monthly", "Yearly", "Quaterly"];
  navData: Array<NavModel>;

  mFundAndSchemeMapping = {};
  schemeNameArr: Array<string>;

  constructor(private navModelService: NavDataService) {}

  ngOnInit(): void {
    this.isAuthenticated = false;
    this.passwordForm = new FormGroup({
      password: new FormControl(1234, [Validators.required]),
    });
  }
  getNavData() {
    this.navModelService
      .getNavData()
      .pipe(take(1))
      .subscribe((resp: Array<NavModel>) => {
        this.navData = resp;
        this.mFundAndSchemeMapping = this.getMFundAndSchemMapping(
          JSON.parse(JSON.stringify(this.navData))
        );
      });
  }
  getMFundAndSchemMapping(data: Array<NavModel>) {
    const mapping = {};
    for (const item of data) {
      if (!mapping[item.mutualFundFamily]) {
        mapping[item.mutualFundFamily] = [];
      }
      mapping[item.mutualFundFamily].push(item.schemeName);
    }
    return mapping;
  }
  getMFamily(data: Array<NavModel>) {
    const mFamilyArr: Array<string> = [];
    for (const item of data) {
      mFamilyArr.push(item.mutualFundFamily);
    }
    return mFamilyArr;
  }
  getSchemeNames(data: Array<NavModel>) {
    let schemeNamesArr: Array<string> = [];
    for (const item of data) {
      schemeNamesArr.push(item.schemeName);
    }

    return schemeNamesArr.sort();
  }
  generateClientAndSchemeForm() {
    this.clientForm = new FormGroup({
      name: new FormControl("Abhijeet", [Validators.required]),
      folioNumber: new FormControl(1234, [Validators.required]),
      regDate: new FormControl(null, [Validators.required]),
      collection: new FormControl("SIP", [Validators.required]),
    });
    this.schemeForm = new FormGroup({
      schemeName: new FormControl(null, [Validators.required]),
      schemeCode: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
      folioNo: new FormControl(null, [Validators.required]),
      startDate: new FormControl({ year: 2020, month: 6, day: 6 }, [
        Validators.required,
      ]),
      freqType: new FormControl({ value: "Monthly", disabled: true }, [
        Validators.required,
      ]),
      mFundFamily: new FormControl(null, [Validators.required]),
      installmentAmt: new FormControl(null, [Validators.required]),
    });
    this.triggerValueChanges();
  }
  triggerValueChanges() {
    this.schemeForm
      .get("schemeName")
      .valueChanges.subscribe((selectedSchemeName: string) => {
        if (selectedSchemeName) {
          const item: NavModel = this.navData.filter(
            (item: NavModel) =>
              item.schemeName.toLowerCase() == selectedSchemeName.toLowerCase()
          )[0];

          this.schemeForm.get("schemeCode").setValue(item.schemeCode);
        }
      });
    this.schemeForm
      .get("mFundFamily")
      .valueChanges.subscribe((selectedFundName: string) => {
        this.schemeNameArr = this.mFundAndSchemeMapping[
          selectedFundName
        ].sort();
        this.schemeForm.get("schemeName").setValue(null);
        this.schemeForm.get("schemeCode").setValue(null);
      });
  }
  onPwdSubmit() {
    const pwd = this.passwordForm.get("password").value;
    if (pwd == "1234") {
      this.isAuthenticated = true;
      this.generateClientAndSchemeForm();
      this.getNavData();
    }
  }
  onClientInfoSubmit() {
    console.log(this.clientForm.value);
  }
  onSchemeFormSubmit() {
    console.log(this.schemeForm.getRawValue());
  }
}
