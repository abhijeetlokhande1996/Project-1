import { Scheme } from "./sip.interface";

export interface IMutualFund {
  clientName: string;
  regDate: Date;
  folioNo: number;
  schemes: Array<Scheme>;
}

export interface IFMutualFund {
  schemeName: string;
  freqType: string;
  startDate: Date | string;
  endDate: Date | string;
  amt: number | string;
  clientName: string;
  regDate: Date | string;
  folioNo: number | string;
}
