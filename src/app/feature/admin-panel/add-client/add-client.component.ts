import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IClient } from "../../../interfaces/IClient.interface";

@Component({
  selector: "app-add-client",
  templateUrl: "./add-client.component.html",
  styleUrls: ["./add-client.component.css"],
})
export class AddClientComponent implements OnInit {
  clientForm: FormGroup;
  @Output() clientInfoEventEmitter: EventEmitter<IClient> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.clientForm = new FormGroup({
      name: new FormControl("Abhijeet", [Validators.required]),
      folioNumber: new FormControl(1234, [Validators.required]),
      regDate: new FormControl(null, [Validators.required]),
    });
  }
  onClientInfoSubmit() {
    const regDate = this.clientForm.get("regDate").value;
    const month = regDate["month"] - 1;
    const year = regDate["year"];
    const day = regDate["day"];

    const client: IClient = {
      name: this.clientForm.get("name").value,
      folioNo: this.clientForm.get("folioNumber").value,
      isActive: true,
      regDate: new Date(year, month, day).toString(),
    };

    this.clientInfoEventEmitter.emit(client);
  }
}
