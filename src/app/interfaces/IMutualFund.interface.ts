import { Scheme } from './sip.interface';

export interface IMutualFund {
    clientName: string;
    regDate: Date;
    folioNo: number;
    schemes: Array<Scheme>;

}

export interface IFMutualFund{
  schemeName: string;
  freqType: string;
  startDate: Date;
  endDate: Date;
  installmentAmt: number;
  clientName: string;
  regDate: Date;
  folioNo: number;

}
