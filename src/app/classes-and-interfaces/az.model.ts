export interface AZDataResponse {
  rtt: JsonObj,
  destinationAZ: JsonObj,
  unixTimestamp: JsonObj,
  handshakeTime: JsonObj,
  sourceAZ: JsonObj,
  resolveTime: JsonObj
}
export interface JsonObj{
  S: string;
  N: number;
}
export interface AZData {
  rtt: number,
  destinationAZ: string,
  unixTimestamp: number,
  handshakeTime: number,
  sourceAZ: string,
  resolveTime: number
}
/* {"rtt":{"N":"907125"},
"destinationAZ":{"S":"use2-az1"},
"unixTimestamp":{"N":"1634180600729603765"}
,"handshakeTime":{"N":"4989544"},
"sourceAZ":{"S":"use2-az2"},
"resolveTime":{"N":"2002018"}} */
