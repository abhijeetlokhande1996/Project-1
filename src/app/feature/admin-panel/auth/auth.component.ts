import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnInit {
  passwordForm: FormGroup;
  @Output() pwdEmitter: EventEmitter<string> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      password: new FormControl(1234, [Validators.required]),
    });
  }
  onPwdSubmit() {
    const pwd: string = this.passwordForm.get("password").value;
    this.pwdEmitter.emit(pwd);
  }
}
