import { DynamoDB, Config} from 'aws-sdk';
import { Injectable } from '@angular/core';
import { AZData, AZDataResponse, JsonObj} from '../classes-and-interfaces/az.model';
import { HttpClient } from '@angular/common/http';
import { JsonResponseModel } from '../classes-and-interfaces/jsonResponse.model';

@Injectable({
  providedIn: 'root'
})
export class HttpClientServiceComponent {
  private targetAPI = 'https://0ni6948i68.execute-api.us-east-2.amazonaws.com/ReadAlphaDB/'
  constructor(private httpClient: HttpClient){
  }

  public getFromDB( sourceAZ:string): Array<AZData>{
    const returnable: Array<AZData> = [];
    const response = this.httpClient.get<JsonResponseModel>(this.targetAPI + sourceAZ).subscribe( data=>
      {
        data.Items.forEach((azRecord: AZDataResponse) => {
          if(azRecord.handshakeTime === undefined){
            const set : JsonObj = {
              S: '',
              N: 0
            };
            azRecord.handshakeTime = set;
          }
          if(azRecord.resolveTime === undefined){
            const set : JsonObj = {
              S: '',
              N: 0
            };
            azRecord.resolveTime = set;
          }
          const azRecordReturn: AZData = {
            destinationAZ: azRecord.destinationAZ.S,
            rtt: azRecord.rtt.N,
            unixTimestamp: azRecord.unixTimestamp.N,
            handshakeTime: azRecord.handshakeTime.N,
            sourceAZ: azRecord.sourceAZ.S,
            resolveTime: azRecord.resolveTime.N
          }
          returnable.push(azRecordReturn)
        });
        return returnable;
      }
    );
    return returnable;
  }


}
