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

import { IAddScheme } from "../../interfaces/IAddScheme.interface";
import { IAddEquity } from "../../interfaces/IEquity.interface";
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
  isLoading: boolean = false;
  selectedTemplate: string = "add-client";
  clientDetails: Array<IClient>;

  constructor(
    private navModelService: NavDataService,
    private dbService: DatabaseService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = false;
  }
  getAllClients() {
    this.dbService
      .getClients()
      .pipe(take(1))
      .subscribe((resp) => {
        this.clientDetails = null;
        this.clientDetails = resp;
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

  getPwd(pwd: string) {
    if (pwd == "1234") {
      this.isAuthenticated = true;

      this.getNavData();
      this.getAllClients();
    }
  }
  getSchemeDataToInsert(schemeData: IAddScheme) {
    this.isLoading = true;
    const data = { ...schemeData };
    delete data.id;
    delete data.clientName;
    let cName = null;
    if (schemeData.collection.toLowerCase() == "mutual fund") {
      cName = "mfs";
    } else if (schemeData.collection.toLowerCase() == "sip") {
      cName = "sips";
    }

    this.dbService
      .addSchemes(schemeData.id, cName, data)
      .then((res: { status: boolean; message: string; data?: any }) => {
        this.isLoading = false;
        res.status
          ? this.toastrService.success(res.message)
          : this.toastrService.error(res.message);
      });
  }
  getClientToInsert(client: IClient) {
    this.isLoading = true;
    this.dbService
      .addClient(client)
      .then((res) => {
        if (res["id"]) {
          this.isLoading = false;
          this.toastrService.success(res["message"]);
          this.getAllClients();
        } else {
          this.isLoading = false;
          this.toastrService.error(res["message"]);
        }
      })
      .catch((err) => {
        this.toastrService.error(
          "Something went wrong! Couldn't add the client. Try again!"
        );
      });
  }
  getEqDataToInsert(obj: IAddEquity) {
    this.isLoading = true;
    const data = { ...obj };
    delete data.id;
    delete data.clientName;
    this.dbService
      .addSchemes(obj.id, "equities", data)
      .then((res: { status: boolean; message: string; data?: any }) => {
        this.isLoading = false;
        res.status
          ? this.toastrService.success(res.message)
          : this.toastrService.error(res.message);
      });
  }
}
