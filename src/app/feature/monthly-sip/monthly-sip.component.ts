import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "./../../services/database.service";
import { take, delay, distinctUntilChanged } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SipInterface } from "../../interfaces/sip.interface";

@Component({
  selector: "app-monthly-sip",
  templateUrl: "./monthly-sip.component.html",
  styleUrls: ["./monthly-sip.component.css"],
})
export class MonthlySipComponent implements OnInit {
  sipData: Array<SipInterface> = [];
  filteredSipData: Array<SipInterface> = [];
  folioForm: FormGroup;

  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.folioForm = new FormGroup({
      folioNo: new FormControl(null, [Validators.required]),
    });
    this.folioForm
      .get("folioNo")
      .valueChanges.pipe(delay(500), distinctUntilChanged())
      .subscribe((folioNo: number) => this.filterSipData(folioNo));
    this.dbService
      .getSipData()
      .pipe(take(1))
      .subscribe((resp) => (this.sipData = resp));
  }
  filterSipData(folioNo: number) {
    this.filteredSipData = this.getDeepCopy(
      this.sipData.filter((item) => item.folioNo == folioNo)
    );
  }
  getDeepCopy(item: any) {
    if (item) {
      return JSON.parse(JSON.stringify(item));
    }
  }
}
