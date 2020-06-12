import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "./../../services/database.service";
import { take } from "rxjs/operators";
@Component({
  selector: "app-monthly-sip",
  templateUrl: "./monthly-sip.component.html",
  styleUrls: ["./monthly-sip.component.css"],
})
export class MonthlySipComponent implements OnInit {
  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.dbService
      .getSipData()
      .pipe(take(1))
      .subscribe((resp) => console.log(resp));
  }
}
