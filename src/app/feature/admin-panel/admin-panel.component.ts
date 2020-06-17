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
import { DatabaseService } from "../../services/database.service";
import { ToastRef, ToastrService } from "ngx-toastr";
import { IClient } from "../../interfaces/IClient.interface";
import { IContext } from "mocha";
import { IAddScheme } from "../../interfaces/IAddScheme.interface";
@Component({
  selector: "app-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.css"],
})
export class AdminPanelComponent implements OnInit {
  passwordForm: FormGroup;

  isAuthenticated: boolean;

  navData: Array<NavModel>;

  mFundAndSchemeMapping = {};

  selectedCollection: string;

  constructor(
    private navModelService: NavDataService,
    private dbService: DatabaseService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = false;
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

  getPwd(pwd: string) {
    if (pwd == "1234") {
      this.isAuthenticated = true;

      this.getNavData();
    }
  }
  getSchemeDataToInsert(schemeData: IAddScheme) {
    console.log("schemeData ", schemeData);
  }
  getClientToInsert(client: IClient) {
    this.dbService
      .addClient(client)
      .then((res) => {
        if (res["id"]) {
          this.toastrService.success(res["message"]);
        } else {
          this.toastrService.error(res["message"]);
        }
      })
      .catch((err) => {
        this.toastrService.error(
          "Something went wrong! Couldn't add the client. Try again!"
        );
      });
  }
}
