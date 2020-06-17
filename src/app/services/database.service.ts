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
  ) { }

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

  /**
   * Will add a client to database
   * @param {IClient} client Client info
   * TODO: Add (client: IClient) signature in method 
   */
  addClient = () => {
    const client: IClient = {
      name: "Warren Buffet",
      folioNo: 105,
      isActive: true
    }
    return new Promise((resolve, reject) => {
      const user = this.firestore.collection("clients", ref => ref.where('folioNo', '==', client.folioNo)).snapshotChanges();
      console.log('user call done');
      const result = user.subscribe(res => {
        console.log('into user subscription');
        let data = res.map((item) => {
          return item.payload.doc.data();
        });
        if (data.length > 0) {
          console.log('into if', data);
          resolve({
            status: false,
            data: 'Already exists'
          });
        } else {
          const user = this.firestore.collection('clients').add(client);
          const id = user.then(res => {
            console.log('else', res.id, res)
            resolve({
              status: true,
              data: id
            });
          });
        }
      });
    }).catch(err => {
      return status;
    })


    // users.subscribe(res => console.log(res.));

    // users.pipe()
    // users.subscribe(res => {
    //   if (res.folioNo) {
    //     console.error('user already exists', res);
    //   } else {
    //     const addUser = this.firestore.collection('clients').add(client);
    //     console.log(addUser.then(res => console.log(res)));
    //   }
    // });

    // return this.firestore.collection<IClient>("clients").add(client) as unknown as IClient;
  }

  /**
   * Adds a SIP to database
   * @param sip Give SIP information to be added
   * TODO: Pass a SIP info object as mentioned in demo
   */
  addSip = () => {


  }

  /**
  * Adds a Mutual Fund to database
  * @param mf Give MF information to be added
  * TODO: Pass a MF info object as mentioned in demo
  */
  addMF = () => {

  }

}
