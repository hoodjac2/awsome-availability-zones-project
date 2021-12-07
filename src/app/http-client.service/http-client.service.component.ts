/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientServiceComponent {

  private dataAPI = 'https://1koslob371.execute-api.us-east-2.amazonaws.com/frontend-translation'

  private getAZNamesAPI = 'https://42tx4az34d.execute-api.us-east-2.amazonaws.com/GetAZsByRegion/'
  private getAZNamesAPIEndpoints: string[] = ['getafs1azs', 'getapn1azs', 'getapn2azs', 'getapn3azs',
  'getaps1azs', 'getapse1azs', 'getapse2azs', 'getcac1azs', 'geteuc1azs',
  'geteun1azs', 'geteus1azs', 'geteuw1azs', 'geteuw2azs', 'geteuw3azs',
  'getsae1azs', 'getuse1azs', 'getuse2azs', 'getusw1azs', 'getusw2azs'];
  constructor(private httpClient: HttpClient){
  }
  /*
  Gets all of the AZ names for each of the regions. This was previously used to
  get records from the dynamoDB, now it is used to get the number of AZs per region.
  */
  public loadAZNames(): Observable<any>{
    const responseArray: any[] = [];
    this.getAZNamesAPIEndpoints.forEach( name => {
      const response = this.httpClient.get<string[]>(this.getAZNamesAPI + name);
      responseArray.push(response);
    });
    return forkJoin(responseArray);
  }
  /*
  Gets all of the records from the dynamoDB so that it can be displayed
  */
  public getAllRecordsFromDB(): Observable<any>{
    const response = this.httpClient.get<any>(this.dataAPI);
    return response;
  }
}
