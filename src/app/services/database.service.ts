import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { SipInterface } from "./../interfaces/sip.interface";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFirestore } from "@angular/fire/firestore";
import { IMutualFund } from "../interfaces/IMutualFund.interface";
import { IClient } from "../interfaces/IClient.interface";
import { take } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  constructor(
    private http: HttpClient,
    private firebase: AngularFireDatabase,
    private firestore: AngularFirestore
  ) {}

  getSipData = (): Observable<Array<SipInterface>> => {
    return this.firestore.collection("sips").valueChanges() as Observable<
      Array<SipInterface>
    >;
  };

  getUsers = () => {
    return this.firestore.collection("users").snapshotChanges();
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

  isExists = (collection: string, folioNo: number) => {
    return this.firestore
      .collection(collection, (ref) => ref.where("folioNo", "==", folioNo))
      .snapshotChanges();
  };

  /**
   * Will add a client to database
   * @param {IClient} client Client info
   * TODO: Add (client: IClient) signature in method
   */
  addClient = (client: IClient) => {
    return new Promise(async (resolve, reject) => {
      const user = await this.isExists("clients", client.folioNo);
      user.pipe(take(1)).subscribe(async (res) => {
        let data = res.map((item) => {
          return item.payload.doc.data();
        });
        if (data.length > 0) {
          resolve({
            status: false,
            message:
              "Folio number is associated to another user. Please choose unique folio number.",
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

  isDataAvailableInInvestmentCollection = (
    investmentType: string,
    folioNo: number
  ) => {
    switch (investmentType) {
      case "sip":
        return new Promise<boolean>((resolve, reject) => {
          const id = this.firestore
            .collection("sips", (ref) => ref.where("folioNo", "==", folioNo))
            .snapshotChanges();
          id.subscribe((res) => {
            let data = res.map((item) => {
              return item.payload.doc.data();
            });
            console.log("id found", data);
            resolve(true);
          });
        }).catch((err) => err);
        break;
      case "mf":
        break;
      case "equity":
        break;
      default:
        null;
    }
  };

  /**
   * Adds a SIP to database
   * @param sip Give SIP information to be added
   * TODO: Pass a SIP info object as mentioned in demo
   */
  addSip = () => {
    const folioNo = 152;
    const type = "sips";
    const schema = {
      schemeName: "test",
      startDate: "test",
      installmentAmt: 111,
      endDate: "test",
      freqType: "monthly",
    };
    // Check if valid folio number
    return new Promise((resolve, reject) => {
      const user = this.isExists("clients", folioNo);
      user.pipe(take(1)).subscribe((res) => {
        let data = res.map((item) => {
          return item.payload.doc.data();
        });
        console.log("user data clients", data);
        if (data.length > 0) {
          this.isExists(type, folioNo).subscribe((sip) => {
            console.log("isExist response", res);
            this.firestore
              .collection("sips")
              .doc(res[0].payload.doc.id)
              .delete();

            const obj = sip.map((details) => {
              return details.payload.doc.data();
            });
            obj[0]["schemes"].push(schema);
            this.firestore.collection("sip").add(obj[0]);
          });
        } else {
        }
      });
    });
    // check if user already available in collection
    // - If yes
    // Update

    // - Else
    // create new
  };

  /**
   * Adds a Mutual Fund to database
   * @param mf Give MF information to be added
   * TODO: Pass a MF info object as mentioned in demo
   */
  addMF = () => {};
}
