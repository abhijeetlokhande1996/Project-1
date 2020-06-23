import { Scheme } from "./sip.interface";

export interface IMutualFund {
  clientName: string;
  regDate?: Date;
  id: number;
  schemes: Array<Scheme>;
}

export interface IFMutualFund {
  schemeName: string;
  freqType: string;
  startDate: Date | string;
  endDate: Date | string;

  clientName: string;
  regDate: Date | string;
  folioNo: number | string;
  amt: number | string;
  units: number;
  nav: number | string;
}
