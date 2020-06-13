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
import { MonthlySipTableComponent } from "./feature/monthly-sip/monthly-sip-table/monthly-sip-table.component";
import { ChartsModule } from "ng2-charts";
import { ChartComponent } from "./shared/chart/chart.component";
import { TableModule } from "primeng/table";
import { ToggleButtonModule } from "primeng/togglebutton";

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { firebaseConfig } from "../environments/environment";


@NgModule({
  declarations: [
    AppComponent,
    TopNavBarComponent,
    componentArr,
    AutoFocusDirective,
    MonthlySipTableComponent,
    ChartComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChartsModule,
    TableModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    ToggleButtonModule
  ],
  providers: [AngularFireDatabase],
  bootstrap: [AppComponent],
})
export class AppModule { }
