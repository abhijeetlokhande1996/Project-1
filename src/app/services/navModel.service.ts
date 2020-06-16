import { Injectable } from "@angular/core";
import { NavModel } from "./../models/nav.model";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class NavService {
  private navModel = new NavModel();
  private subject = new BehaviorSubject(this.navModel);

  setNavModel(obj: NavModel) {
    this.navModel = obj;
    this.subject.next(this.navModel);
  }
  getNavModel() {
    return this.subject.asObservable();
  }
}
