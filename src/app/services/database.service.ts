import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { SipInterface } from "./../interfaces/sip.interface";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor(private http: HttpClient, private firebase: AngularFireDatabase, private firestore: AngularFirestore) { }


  getSipData = (): Observable<Array<SipInterface>> => {
    // return this.http.get<Array<SipInterface>>("assets/json/sip.json");
    return this.firestore.collection('sips').valueChanges() as Observable<Array<SipInterface>>;
  }

  getUsers = () => {
    return this.firestore.collection('users').snapshotChanges();
  }

}
