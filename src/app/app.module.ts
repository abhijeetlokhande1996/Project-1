import "reflect-metadata";
import "../polyfills";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule, componentArr } from "./app-routing.module";

import { AppComponent } from "./app.component";

import { TopNavBarComponent } from "./core/top-nav-bar/top-nav-bar.component";
import { AutoFocusDirective } from "./directives/auto-focus.directive";
import { PrimeTableComponent } from "./shared/prime-table/prime-table.component";
import { ChartsModule } from "ng2-charts";
import { ChartComponent } from "./shared/chart/chart.component";
import { TableModule } from "primeng/table";
import { ToggleButtonModule } from "primeng/togglebutton";
import { PaginatorModule } from "primeng/paginator";
import { CalendarModule } from "primeng/calendar";

import { AngularFireModule } from "@angular/fire";
import {
  AngularFireDatabaseModule,
  AngularFireDatabase,
} from "@angular/fire/database";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { KeysPipe } from "./pipes/keys.pipe";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { AuthComponent } from "./feature/admin-panel/auth/auth.component";
import { AddClientComponent } from "./feature/admin-panel/add-client/add-client.component";
import { AddSchemeComponent } from "./feature/admin-panel/add-scheme/add-scheme.component";
import { AddEquityComponent } from "./feature/admin-panel/add-equity/add-equity.component";
import { SortByPipe } from "./pipes/sortBy.pipe";
const firebaseConfig = {
  apiKey: "AIzaSyDey1BZs4_4pdsruD7IN34AabaWnkZxxx0",
  authDomain: "shri-record-book-36ad1.firebaseapp.com",
  databaseURL: "https://shri-record-book-36ad1.firebaseio.com",
  projectId: "shri-record-book-36ad1",
  storageBucket: "shri-record-book-36ad1.appspot.com",
  messagingSenderId: "478091212753",
  appId: "1:478091212753:web:429ca14fb94ef684bed2f0",
  measurementId: "G-HRWPNECMYX",
};
@NgModule({
  declarations: [
    AppComponent,
    TopNavBarComponent,
    componentArr,
    AutoFocusDirective,
    PrimeTableComponent,
    ChartComponent,
    KeysPipe,
    AuthComponent,
    AddClientComponent,
    AddSchemeComponent,
    AddEquityComponent,
    SortByPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: "toast-top-right",
      preventDuplicates: true,
    }),
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChartsModule,
    TableModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ToggleButtonModule,
    PaginatorModule,
    CalendarModule,
    NgbModule,
    ProgressSpinnerModule,
  ],
  providers: [AngularFireDatabase],
  bootstrap: [AppComponent],
})
export class AppModule {}
