import { Scheme } from "./sip.interface";

export interface IMutualFund {
  name: string;
  regDate?: Date;
  id: number;
  schemes: Array<Scheme>;
}

export interface IFMutualFund {
  schemeName: string;
  freqType: string;
  startDate: Date | string;
  endDate: Date | string;

  name: string;
  regDate: Date | string;
  folioNo: number | string;
  amt: number | string;
  units: number;
  nav: number | string;
  currentNav?: number | string;
}
