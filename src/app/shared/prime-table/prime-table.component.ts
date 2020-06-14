import { Component, OnInit, Input } from "@angular/core";
import { SipInterface } from "../../interfaces/sip.interface";

@Component({
  selector: "app-prime-table",
  templateUrl: "./prime-table.component.html",
  styleUrls: ["./prime-table.component.css"],
})
export class PrimeTableComponent implements OnInit {
  _sipDataToShow: Array<any>;

  @Input()
  set sipDataToShow(data: Array<any>) {
    this._sipDataToShow = data;
    console.log(this._sipDataToShow);
  }

  constructor() { }

  ngOnInit(): void { }
}
