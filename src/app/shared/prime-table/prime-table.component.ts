import { Component, OnInit, Input } from "@angular/core";
import { SipInterface } from "../../interfaces/sip.interface";

@Component({
  selector: "app-prime-table",
  templateUrl: "./prime-table.component.html",
  styleUrls: ["./prime-table.component.css"],
})
export class PrimeTableComponent implements OnInit {
  _dataToShow: Array<any>;
  filterFields: Array<string>;
  _colHeaderMapArray: [];
  @Input()
  set colHeaderMapArray(val) {
    if (val) {
      this.filterFields = [];
      this._colHeaderMapArray = val;
      for (const header of this._colHeaderMapArray) {
        this.filterFields.push(header[0]);
      }
    }
  }
  @Input()
  set sipDataToShow(data: Array<any>) {
    this._dataToShow = data;
  }

  constructor() {}

  ngOnInit(): void {}
}
