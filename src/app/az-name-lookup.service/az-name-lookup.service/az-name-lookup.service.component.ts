/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, OnInit } from '@angular/core';
import {NgModule} from '@angular/core';
@NgModule ({
  exports: []
})
export class AzNameLookupServiceComponent implements OnInit {

  constructor() {
  dictionaryAZNames = new Map<string, string>();

  
    this.dictionaryAZNames.set('eu-north-1','eun1');
    this.dictionaryAZNames.set('ap-south-1','aps1');
    this.dictionaryAZNames.set('eu-west-3','euw3');
    this.dictionaryAZNames.set('eu-west-2','euw2');
    this.dictionaryAZNames.set('eu-west-1','euw1');
    this.dictionaryAZNames.set('eu-south-1','eus1');
    this.dictionaryAZNames.set('ap-northeast-3','apne3');
    this.dictionaryAZNames.set('ap-northeast-2','apne2');
    this.dictionaryAZNames.set('ap-northeast-1','apne1')
    this.dictionaryAZNames.set('sa-east-1','sae1');
    this.dictionaryAZNames.set('ca-central-1','cac1');
    this.dictionaryAZNames.set('ap-southeast-1','apse1');
    this.dictionaryAZNames.set('ap-southeast-2','apse1');
    this.dictionaryAZNames.set('eu-central-1','euc1');
    this.dictionaryAZNames.set('us-east-1','use1');
    this.dictionaryAZNames.set('us-east-2','use2');
    this.dictionaryAZNames.set('us-west-1','usw1');
    this.dictionaryAZNames.set('us-west-2','usw2');
    this.dictionaryAZNames.set('af-south-1','afs1');
  }
  public LookupbyAZ(az:string): string | undefined {
    return this.dictionaryAZNames.get(az);
  }
}
