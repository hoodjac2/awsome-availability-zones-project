/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
import { DynamoDB, Config} from 'aws-sdk';
import { Injectable } from '@angular/core';
import { AZData, AZDataResponse, JsonObj} from '../classes-and-interfaces/az.model';
import { HttpClient } from '@angular/common/http';
import { JsonResponseModel } from '../classes-and-interfaces/jsonResponse.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientServiceComponent {
  private targetAPI = 'https://0ni6948i68.execute-api.us-east-2.amazonaws.com/ReadAlphaDB/'
  constructor(private httpClient: HttpClient){
  }
  public getFromDB( sourceAZ:string): Observable<JsonResponseModel>{
    const response = this.httpClient.get<JsonResponseModel>(this.targetAPI + sourceAZ);
    return response;
  }

  //ALSO BROKEN
  public deserializeOneObj(jsonModel: JsonResponseModel): AZData[] {
     const test = jsonModel.Items;
     const returnable :AZData[] = [];
     test.forEach(test2 =>{
      if(test2.handshakeTime === undefined){
        const set : JsonObj = {
          S: '',
          N: 0
        };
        test2.handshakeTime = set;
      }
      if(test2.resolveTime === undefined){
        const set : JsonObj = {
          S: '',
          N: 0
        };
        test2.resolveTime = set;
      }
      const returnableTest : AZData = {
        destinationAZ: test2.destinationAZ.S,
        rtt: test2.rtt.N,
        unixTimestamp: test2.unixTimestamp.N,
        handshakeTime: test2.handshakeTime.N,
        sourceAZ: test2.sourceAZ.S,
        resolveTime: test2.resolveTime.N
      }
     });

    return returnable;

  }
  //CURRENTLY BROKEN DO NOT USE
  public deserializeJsonModel(jsonModel: JsonResponseModel): Array<AZData>{
    let returnArray: Array<AZData> = [];
    jsonModel.Items.forEach((azRecord: AZDataResponse) => {
      //--------------------------------------------------------
      //These two fields can be undefined in the alpha DB
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
      // Probably remove above later
      //-----------------------------------------
      let azRecordReturn: AZData = {
        destinationAZ: azRecord.destinationAZ.S,
        rtt: azRecord.rtt.N,
        unixTimestamp: azRecord.unixTimestamp.N,
        handshakeTime: azRecord.handshakeTime.N,
        sourceAZ: azRecord.sourceAZ.S,
        resolveTime: azRecord.resolveTime.N
      }
      console.log(azRecordReturn);
    });
    return returnArray;
  }
}
