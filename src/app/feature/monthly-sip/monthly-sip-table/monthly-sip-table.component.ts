import { Component, OnInit, Input } from "@angular/core";
import { SipInterface } from "../../../interfaces/sip.interface";

@Component({
  selector: "app-monthly-sip-table",
  templateUrl: "./monthly-sip-table.component.html",
  styleUrls: ["./monthly-sip-table.component.css"],
})
export class MonthlySipTableComponent implements OnInit {
  _sipDataToShow: Array<SipInterface>;
  @Input()
  set sipDataToShow(data: Array<SipInterface>) {
    this._sipDataToShow = data;
  }
  constructor() {}

  ngOnInit(): void {}
}
