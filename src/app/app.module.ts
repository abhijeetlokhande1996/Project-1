import "reflect-metadata";
import "../polyfills";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule, componentArr } from "./app-routing.module";

import { AppComponent } from "./app.component";

import { TopNavBarComponent } from "./core/top-nav-bar/top-nav-bar.component";
import { AutoFocusDirective } from './directives/auto-focus.directive';

@NgModule({
  declarations: [AppComponent, TopNavBarComponent, componentArr, AutoFocusDirective],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
