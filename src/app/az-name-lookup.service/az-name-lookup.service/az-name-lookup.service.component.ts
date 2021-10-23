/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AzNameLookupServiceComponent implements OnInit {

  constructor() { }
  dictionaryAZNames = new Map<string, string>();

  ngOnInit(): void {
    this.dictionaryAZNames.set('eu-north-1a','Europe North AZ 1');
    this.dictionaryAZNames.set('eu-north-1b','Europe North AZ 2');
    this.dictionaryAZNames.set('eu-north-1c','Europe North AZ 3');

    this.dictionaryAZNames.set('ap-south-1a','Asia Pacific South AZ 1');
    this.dictionaryAZNames.set('ap-south-1b','Asia Pacific South AZ 2');
    this.dictionaryAZNames.set('ap-south-1c','Asia Pacific South AZ 3');

    this.dictionaryAZNames.set('eu-west-3a','Europe West 3 AZ 1');
    this.dictionaryAZNames.set('eu-west-3b','Europe West 3 AZ 1');
    this.dictionaryAZNames.set('eu-west-3c','Europe West 3 AZ 1');
    this.dictionaryAZNames.set('eu-west-2a','Europe West 2 AZ 1');
    this.dictionaryAZNames.set('eu-west-2b','Europe West 2 AZ 1');
    this.dictionaryAZNames.set('eu-west-2c','Europe West 2 AZ 1');
    this.dictionaryAZNames.set('eu-west-1a','Europe West AZ 1');
    this.dictionaryAZNames.set('eu-west-1b','Europe West AZ 1');
    this.dictionaryAZNames.set('eu-west-1c','Europe West AZ 1');

    this.dictionaryAZNames.set('ap-northeast-3a','Asia Pacific Northeast 3 AZ 1');
    this.dictionaryAZNames.set('ap-northeast-3b','Asia Pacific Northeast 3 AZ 2');
    this.dictionaryAZNames.set('ap-northeast-3c','Asia Pacific Northeast 3 AZ 3');
    this.dictionaryAZNames.set('ap-northeast-2a','Asia Pacific Northeast 2 AZ 1');
    this.dictionaryAZNames.set('ap-northeast-2b','Asia Pacific Northeast 2 AZ 2');
    this.dictionaryAZNames.set('ap-northeast-2c','Asia Pacific Northeast 2 AZ 3');
    this.dictionaryAZNames.set('ap-northeast-2d','Asia Pacific Northeast 2 AZ 4');
    this.dictionaryAZNames.set('ap-northeast-1a','Asia Pacific Northeast AZ 1');
    this.dictionaryAZNames.set('ap-northeast-1c','Asia Pacific Northeast AZ 3');
    this.dictionaryAZNames.set('ap-northeast-1d','Asia Pacific Northeast AZ 4');

    this.dictionaryAZNames.set('sa-east-1a','South America East AZ 1');
    this.dictionaryAZNames.set('sa-east-1b','South America East AZ 2');
    this.dictionaryAZNames.set('sa-east-1c','South America East AZ 3');

    this.dictionaryAZNames.set('ca-central-1a','Central America Central AZ 1');
    this.dictionaryAZNames.set('ca-central-1b','Central America Central AZ 2');
    this.dictionaryAZNames.set('ca-central-1d','Central America Central AZ 3');

    this.dictionaryAZNames.set('ap-southeast-1a','Asia Pacific Southeast 3 AZ 1');
    this.dictionaryAZNames.set('ap-southeast-1b','Asia Pacific Southeast 3 AZ 2');
    this.dictionaryAZNames.set('ap-southeast-1c','Asia Pacific Southeast 3 AZ 3');
    this.dictionaryAZNames.set('ap-southeast-2a','Asia Pacific Southeast 3 AZ 1');
    this.dictionaryAZNames.set('ap-southeast-2b','Asia Pacific Southeast 3 AZ 2');
    this.dictionaryAZNames.set('ap-southeast-2c','Asia Pacific Southeast 3 AZ 3');

    this.dictionaryAZNames.set('eu-central-1a','Europe Central AZ 1');
    this.dictionaryAZNames.set('eu-central-1b','Europe Central AZ 2');
    this.dictionaryAZNames.set('eu-central-1c','Europe Central AZ 3');

    this.dictionaryAZNames.set('us-east-1a','US East AZ 1');
    this.dictionaryAZNames.set('us-east-1b','US East AZ 2');
    this.dictionaryAZNames.set('us-east-1c','US East AZ 3');
    this.dictionaryAZNames.set('us-east-1d','US East AZ 4');
    this.dictionaryAZNames.set('us-east-1e','US East AZ 5');
    this.dictionaryAZNames.set('us-east-1f','US East AZ 6');
    this.dictionaryAZNames.set('us-east-2a','US East 2 AZ 1');
    this.dictionaryAZNames.set('us-east-2b','US East 2 AZ 2');
    this.dictionaryAZNames.set('us-east-2c','US East 2 AZ 3');
    this.dictionaryAZNames.set('us-west-1a','US West AZ 1');
    this.dictionaryAZNames.set('us-west-1c','US West AZ 3');
    this.dictionaryAZNames.set('us-west-2a','US West 2 AZ 1');
    this.dictionaryAZNames.set('us-west-2b','US West 2 AZ 2');
    this.dictionaryAZNames.set('us-west-2c','US West 2 AZ 3');
    this.dictionaryAZNames.set('us-west-2d','US West 2 AZ 4');
  }
  public LookupbyAZ(az:string): string | undefined {
    return this.dictionaryAZNames.get(az);
  }
}
