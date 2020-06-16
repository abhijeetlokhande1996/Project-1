import { Injectable } from "@angular/core";
import { NavModel } from "../models/nav.model";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class NavDataService {
  private navData: Array<NavModel> = [];
  private subject = new BehaviorSubject(this.navData);

  setNavData(data: Array<NavModel>) {
    this.navData = data;
    this.subject.next(this.navData);
  }
  getNavData() {
    return this.subject.asObservable();
  }
}
