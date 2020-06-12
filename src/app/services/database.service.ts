import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor(private http: HttpClient) {}
  getSipData() {
    return this.http.get("assets/json/sip.json");
  }
}
