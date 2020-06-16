import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "./services/database.service";
import { map } from "rxjs/operators";
import { NavModel } from "./models/nav.model";
import { NavDataService } from "./services/navModel.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private dbService: DatabaseService,
    private navModelService: NavDataService
  ) {}
  ngOnInit(): void {
    this.dbService
      .fetchLatestNAV()
      .pipe(
        map((data: Array<{}>) => {
          const arrToReturn: Array<NavModel> = [];
          const navObj = new NavModel();
          for (const item of data) {
            navObj.date = new Date(item["Date"]);
            navObj.mutualFundFamily = item["Mutual Fund Family"];
            navObj.netAssetValue = parseFloat(item["Net Asset Value"]);
            navObj.schemeName = item["Scheme Name"];
            navObj.schemeCode = parseInt(item["Scheme Code"]);
            navObj.schemeType = item["Scheme Type"];
            navObj.schemeCategory = item["Scheme Category"];
            arrToReturn.push(JSON.parse(JSON.stringify(navObj)));
          }
          return arrToReturn;
        })
      )
      .subscribe((resp: Array<NavModel>) => {
        this.navModelService.setNavData(resp);
      });
  }
}
