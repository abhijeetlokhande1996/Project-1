import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MonthlySipComponent } from "./feature/monthly-sip/monthly-sip.component";
import { IncomeComponent } from "./feature/income/income.component";
import { EquityComponent } from "./feature/equity/equity.component";
import { MutualFundComponent } from "./feature/mutual-fund/mutual-fund.component";
import { AdminPanelComponent } from "./feature/admin-panel/admin-panel.component";

const routes: Routes = [
  {
    path: "mutual-fund",
    component: MutualFundComponent,
  },
  {
    path: "monthly-sip",
    component: MonthlySipComponent,
  },
  {
    path: "income",
    component: IncomeComponent,
  },
  {
    path: "equity",
    component: EquityComponent,
  },
  {
    path: "admin-panel",
    component: AdminPanelComponent,
  },
  {
    path: "",
    redirectTo: "mutual-fund",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

const componentArr = [
  MonthlySipComponent,
  IncomeComponent,
  EquityComponent,
  MutualFundComponent,
  AdminPanelComponent,
];
export { componentArr };
