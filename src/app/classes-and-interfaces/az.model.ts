//This model is a more cut down version of DBRecord, used for graphs
export interface AZData {
  Percentile75: number,
  Percentile99: number,
  Percentile50: number,
  Res_time: number,
  MinRTT: number,
  Percentile90: number,
  BucketCountArray: Array<Array<number>>,
  MedRTT: number,
  MaxRTT: number,
  Handshake_time: number,
  AveRTT: number,
  AZPair: string
}

//The primary data type from the database
export interface DBRecord {
  AvgRTT: number,
  SRC: string,
  MaxRTT: number,
  DST: string,
  MinRTT: number,
  RTTPS: Array<number>,
  RTTBC: Array<Array<number>>,
  AvgRES: number,
  AvgHDS: number
}
