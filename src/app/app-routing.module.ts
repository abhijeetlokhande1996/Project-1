import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./feature/home/home.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
  }, {
    path: 'monthly-sip',
    component:
  }
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
