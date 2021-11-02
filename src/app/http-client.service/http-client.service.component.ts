/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
import { DynamoDB, Config} from 'aws-sdk';
import { Injectable } from '@angular/core';
import { AZData, AZDataResponse, JsonObj} from '../classes-and-interfaces/az.model';
import { HttpClient } from '@angular/common/http';
import { JsonResponseModel } from '../classes-and-interfaces/jsonResponse.model';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientServiceComponent {
  allRegions: string[] = ['getafs1azs', 'getapn1azs', 'getapn2azs', 'getapn3azs',
    'getaps1azs', 'getapse1azs', 'getapse2azs', 'getcac1azs', 'geteuc1azs',
    'geteun1azs', 'geteus1azs', 'geteuw1azs', 'geteuw2azs', 'geteuw3azs',
    'getsae1azs', 'getuse1azs', 'getuse2azs', 'getusw1azs', 'getusw2azs'];
  private targetAPI = 'https://0ni6948i68.execute-api.us-east-2.amazonaws.com/ReadAlphaDB/'
  private getAZNamesAPI = 'https://42tx4az34d.execute-api.us-east-2.amazonaws.com/GetAZsByRegion/'
  constructor(private httpClient: HttpClient){
  }
  public getFromDB( sourceAZ:string): Observable<JsonResponseModel>{
    const response = this.httpClient.get<JsonResponseModel>(this.targetAPI + sourceAZ);
    return response;
  }
  public loadAZNames(): Observable<any>{
    const responseArray: any[] = [];
    this.allRegions.forEach( name => {
      const response = this.httpClient.get<string[]>(this.getAZNamesAPI + name);
      responseArray.push(response);
    });

    return forkJoin(responseArray);
  }
}
