import "reflect-metadata";
import "../polyfills";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule, componentArr } from "./app-routing.module";

import { AppComponent } from "./app.component";

import { TopNavBarComponent } from "./core/top-nav-bar/top-nav-bar.component";
import { AutoFocusDirective } from "./directives/auto-focus.directive";
import { MonthlySipTableComponent } from './feature/monthly-sip/monthly-sip-table/monthly-sip-table.component';

@NgModule({
  declarations: [
    AppComponent,
    TopNavBarComponent,
    componentArr,
    AutoFocusDirective,
    MonthlySipTableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
