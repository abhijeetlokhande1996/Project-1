import { NumberValueAccessor } from "@angular/forms";

export interface IAddEquity {
  clientName: string;
  companyName: string;
  quantity: number;
  rate: number;
  amount: number;
  purchaseDate: Date | string;
}
