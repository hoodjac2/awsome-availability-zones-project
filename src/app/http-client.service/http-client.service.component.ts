/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
import { DynamoDB, Config} from 'aws-sdk';
import { Injectable } from '@angular/core';
import { AZData, AZDataResponse, DBRecord, JsonObj} from '../classes-and-interfaces/az.model';
import { HttpClient } from '@angular/common/http';
import { JsonResponseModel } from '../classes-and-interfaces/jsonResponse.model';
import { forkJoin, Observable } from 'rxjs';
import { NONE_TYPE } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class HttpClientServiceComponent {

  private dataAPI = 'https://0ni6948i68.execute-api.us-east-2.amazonaws.com/ReadFromCrunchTable/'

  private getAZNamesAPI = 'https://42tx4az34d.execute-api.us-east-2.amazonaws.com/GetAZsByRegion/'
  private getAZNamesAPIEndpoints: string[] = ['getafs1azs', 'getapn1azs', 'getapn2azs', 'getapn3azs',
  'getaps1azs', 'getapse1azs', 'getapse2azs', 'getcac1azs', 'geteuc1azs',
  'geteun1azs', 'geteus1azs', 'geteuw1azs', 'geteuw2azs', 'geteuw3azs',
  'getsae1azs', 'getuse1azs', 'getuse2azs', 'getusw1azs', 'getusw2azs'];
  constructor(private httpClient: HttpClient){
  }
  public getFromDB( sourceAZ:string): Observable<JsonResponseModel>{
    const response = this.httpClient.get<JsonResponseModel>(this.dataAPI + sourceAZ);
    return response;
  }
  public loadAZNames(): Observable<any>{
    const responseArray: any[] = [];
    this.getAZNamesAPIEndpoints.forEach( name => {
      const response = this.httpClient.get<string[]>(this.getAZNamesAPI + name);
      responseArray.push(response);
    });
    return forkJoin(responseArray);
  }

  //deprecated
  public getRecordsFromDB(srcDestPair: string[]): Observable<any> {
    const responseArray: any[] = [];
    srcDestPair.forEach( name => {
      const response = this.httpClient.get<JsonResponseModel>(this.dataAPI + name);
      responseArray.push(response);
    });
    return forkJoin(responseArray);
  }

  public getAllRecordsFromDB(): Observable<any>{
    const response = this.httpClient.get<any>('https://1koslob371.execute-api.us-east-2.amazonaws.com/frontend-translation');
    return response;
  }

  /*
  Might be reused later...
  this.dbService.getFromDB('use2-az2').subscribe( data => {
        data.Items.forEach((azRecord: AZDataResponse) => {
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
          const azRecordReturn: AZData = {
            destinationAZ: azRecord.destinationAZ.S,
            rtt: Number(azRecord.rtt.N),
            unixTimestamp: Number(azRecord.unixTimestamp.N),
            handshakeTime: Number(azRecord.handshakeTime.N),
            sourceAZ: azRecord.sourceAZ.S,
            resolveTime: Number(azRecord.resolveTime.N)
          }
          this.dataArray.push(azRecordReturn);
        });

      });
  */
}
