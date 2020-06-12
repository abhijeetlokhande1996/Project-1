import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SipInterface } from "./../interfaces/sip.interface";
@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor(private http: HttpClient) {}
  getSipData(): Observable<Array<SipInterface>> {
    return this.http.get<Array<SipInterface>>("assets/json/sip.json");
  }
}
