export interface FeeScheduleEntry {
  procCode: string;
  bnftPlan: string;
  rateType: string;
  pricingMethod: string;
  mod: string;
  effDate: string;
  endDate: string;
  maxFee: number;
  relValue: number;
  convAdj: number;
  adjPercent: number;
  adjFactor: string;
}

export interface ParsedData {
  [date: string]: {
    [procCode: string]: FeeScheduleEntry;
  };
}