import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControlName,
  Validators,
  FormControl,
} from "@angular/forms";

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

  constructor() {}

  ngOnInit(): void {
    this.isAuthenticated = false;
    this.passwordForm = new FormGroup({
      password: new FormControl(1234, [Validators.required]),
    });
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
      folioNo: new FormControl(null, [Validators.required]),
      startDate: new FormControl({ year: 2020, month: 6, day: 6 }, [
        Validators.required,
      ]),
      freqType: new FormControl(null, [Validators.required]),
      installmentAmt: new FormControl(null, [Validators.required]),
    });
  }
  onPwdSubmit() {
    const pwd = this.passwordForm.get("password").value;
    if (pwd == "1234") {
      this.isAuthenticated = true;
      this.generateClientAndSchemeForm();
    }
  }
  onClientInfoSubmit() {
    console.log(this.clientForm.value);
  }
  onSchemeFormSubmit() {
    console.log(this.schemeForm.value);
  }
}
