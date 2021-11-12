export interface ResponseFromDB {
  Count: number;
  Items: AZDataResponse[];
}

export interface AZDataResponse {
  Percentile75: JsonObj,
  Percentile99: JsonObj,
  Percentile50: JsonObj,
  Res_time: JsonObj,
  Max_UTC: JsonObj,
  MinRTT: JsonObj,
  Percentile90: JsonObj,
  GraphDataString: JsonObj,
  MedRTT: JsonObj,
  MaxRTT: JsonObj,
  Handshake_time: JsonObj,
  AveRTT: JsonObj,
  Min_UTC: JsonObj,
  AZPair: JsonObj,
  Items: JsonObj
}
export interface JsonObj{
  S: string;
  N: number;
}
export interface AZData {
  Percentile75: number,
  Percentile99: number,
  Percentile50: number,
  Res_time: number,
  Max_UTC: number,
  MinRTT: number,
  Percentile90: number,
  GraphDataString: string,
  MedRTT: number,
  MaxRTT: number,
  Handshake_time: number,
  AveRTT: number,
  Min_UTC: number,
  AZPair: string,
  Items: number
}


// {"Count":1,
// "Items":[{"Percentile75":{"N":"116137920"},
// "Percentile99":{"N":"118588139"},
// "Percentile50":{"N":"115499832"}
// ,"Res_time":{"N":"2170283.266666666666666666667"},
// "Max_UTC":{"N":"1636584991"},
// "MinRTT":{"N":"113.81"},
// "Percentile90":{"N":"117909389"},
// "GraphDataString":{"S":"name:113.81, value:25.333333333333336\nname:114.40, value:0.0\nname:114.99, value:29.333333333333332\nname:115.58, value:21.333333333333336\nname:116.17, value:2.0\nname:116.76, value:4.666666666666667\nname:117.35, value:10.666666666666668\nname:117.94, value:5.333333333333334\nname:118.53, value:0.6666666666666667\nname:119.12, value:0.666666666666666
// "MedRTT":{"N":"115.52"},
// "MaxRTT":{"N":"119.71"},
// "Handshake_time":{"N":"115767612.3333333333333333333"},
// "AveRTT":{"N":"115.66"},
// "Min_UTC":{"N":"1635980191"},
// "AZPair":{"S":"sae1-az3use1-az5"}}],
// "ScannedCount":1}
