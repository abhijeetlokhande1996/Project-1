import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { SipInterface } from "./../interfaces/sip.interface";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { IMutualFund } from "../interfaces/IMutualFund.interface";
import { IClient } from "../interfaces/IClient.interface";
import { take } from "rxjs/operators";

import { IEquityCollectionEntity } from "../interfaces/EquityCollectionEntity.interface";
import { IAddEquity } from "../interfaces/IEquity.interface";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor(
    private http: HttpClient,
    private firebase: AngularFireDatabase,
    private firestore: AngularFirestore
  ) {}

  getClients = (): Observable<Array<IClient>> => {
    return this.firestore.collection("clients").valueChanges() as Observable<
      Array<IClient>
    >;
  };
  getSipData = (): Observable<Array<SipInterface>> => {
    return this.firestore.collection("sips").valueChanges() as Observable<
      Array<SipInterface>
    >;
  };

  getUsers = () => {
    return this.firestore.collection("users").snapshotChanges();
  };
  getEquities = () => {
    return this.firestore.collection("equities").valueChanges() as Observable<
      Array<IEquityCollectionEntity>
    >;
  };
  getMFs = (): Observable<Array<IMutualFund>> => {
    return this.firestore.collection("mfs").valueChanges() as Observable<
      Array<IMutualFund>
    >;
  };

  fetchLatestNAV() {
    return this.http.get(
      "https://latest-mutual-fund-nav.p.rapidapi.com/fetchLatestNAV?SchemeType=All",
      {
        headers: new HttpHeaders({
          "x-rapidapi-host": "latest-mutual-fund-nav.p.rapidapi.com",
          "x-rapidapi-key":
            "297c7f49b8mshbe42867157733dap15a767jsn6d9220c33424",
        }),
      }
    );
  }

  isExists = (collection: string, id: number) => {
    return this.firestore
      .collection(collection, (ref) => ref.where("id", "==", id))
      .snapshotChanges();
  };

  /**
   * Will add a client to database
   * @param {IClient} client Client info
   * TODO: Add (client: IClient) signature in method
   */
  addClient = (client: IClient) => {
    return new Promise(async (resolve, reject) => {
      const user = await this.isExists("clients", client.id);
      user.pipe(take(1)).subscribe(async (res) => {
        let data = res.map((item) => {
          return item.payload.doc.data();
        });
        if (data.length > 0) {
          resolve({
            status: false,
            message:
              "ID is associated to another user. Please choose unique ID.",
            id: null,
          });
        } else {
          const user = this.firestore.collection("clients").add(client);
          const id = user.then((res) => {
            resolve({
              status: true,
              id: res.id,
              message: "Client added successfully!",
            });
          });
        }
      });
    }).catch((err) => {
      return {
        status: false,
        message: "Something went wrong. Couldn't add client",
        id: null,
      };
    });
  };

  /**
   * Adds a SIP to database
   * @param sip Give SIP information to be added
   * TODO: Pass a SIP info object as mentioned in demo
   */
  addSchemes = (id: number, type: string, schemeDetails: any) => {
    let clientName: string = "";
    return new Promise((resolve, reject) => {
      this.isExists("clients", id)
        .pipe(take(1))
        .subscribe((res) => {
          if (
            res[0]?.payload?.doc?.data() &&
            Object.keys(res[0].payload.doc.data()).length > 0
          ) {
            clientName = res[0].payload.doc.data()["name"];
            if (res[0].payload.doc.data()["isActive"]) {
              this.isExists(type, id)
                .pipe(take(1))
                .subscribe((res) => {
                  if (
                    res[0]?.payload?.doc?.data() &&
                    Object.keys(res[0].payload.doc.data()).length > 0
                  ) {
                    const body = res[0].payload.doc.data();
                    type === "equities"
                      ? body["holdings"].push(schemeDetails)
                      : body["schemes"].push(schemeDetails);
                    this.firestore
                      .doc(type + "/" + res[0].payload.doc.id)
                      .update(body)
                      .then((res) => {
                        resolve({
                          status: true,
                          message: `${type} Updated successfully!`,
                        });
                      });
                  } else {
                    if (type === "equities") {
                      this.firestore
                        .collection(type)
                        .add({
                          id: id,
                          name: clientName,
                          holdings: [schemeDetails],
                        })
                        .then((res) => {
                          resolve({
                            status: true,
                            message: `${type} added successfully!`,
                          });
                        });
                    } else {
                      this.firestore
                        .collection(type)
                        .add({
                          id: id,
                          name: clientName,
                          schemes: [schemeDetails],
                        })
                        .then((res) => {
                          resolve({
                            status: true,
                            message: `${type} added successfully!`,
                          });
                        });
                    }
                  }
                });
            } else {
              resolve({
                status: false,
                message: "Client is not active! Kindly update his status",
              });
            }
          } else {
            resolve({
              status: false,
              message:
                "No user present! Add the client first then add any scheme",
            });
          }
        });
    });
  };

  addEquity = (data: IAddEquity, type: string) => {
    return new Promise((resolve, reject) => {
      this.firestore
        .collection(type)
        .add(data)
        .then((res) => {
          resolve({
            status: true,
            message: `${type} added successfully!`,
          });
        })
        .catch(() => {
          reject({
            status: false,
            message: `unable to add ${type} !`,
          });
        });
    });
  };
}
