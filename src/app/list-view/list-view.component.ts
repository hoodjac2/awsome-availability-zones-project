/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";
import { ListViewModel } from "../classes-and-interfaces/listview.model";
import {MOCK_DATA} from "../classes-and-interfaces/temp-mock-data";
import {ThemePalette} from '@angular/material/core';
import { AZData, AZDataResponse, JsonObj } from "../classes-and-interfaces/az.model";
import { deserialize } from "v8";
import { MatTable } from "@angular/material/table";

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})

export class ListViewComponent implements OnInit{
  title = 'capstone-test';
  dataArray: AZData[] = [];
  filteredDataArray: AZData[] = [];

  @ViewChild(MatTable) table: MatTable<any> | undefined;

  displayedColumns: string[] = ['sourceAZ', 'destinationAZ', 'rtt', 'unixTimestamp','resolveTime'];
  filterArray : string[] = [];

  constructor(private dbService: HttpClientServiceComponent){
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void{
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
        this.filteredDataArray.push(azRecordReturn);
        this.table?.renderRows();
      });
    });
  }


  bttnClick(event: any):void{
    console.log(event);
  }
  //Checkbox
  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary'},
      {name: 'Accent', completed: false, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'}
    ]
  };

  allComplete = false;

  updateAllComplete(): void {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean): void {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }

  //CHECKBOIX HANDLERS. THERE IS PROBABLY A BETTER WAY TO DO THIS....
  bttnUSEAST1Click(event: any):void{
    if(this.filterArray.includes('use1-az2')){
      this.filterArray.splice(this.filterArray.indexOf('use1-az2'));
      this.filterGrid();
    }
    else{
      this.filterArray.push('use1-az2');
      this.filterGrid();
    }
  }
  bttnUSEAST2Click(event: any):void{
    if(this.filterArray.includes('use2-az2')){
      this.filterArray.splice(this.filterArray.indexOf('use2-az2'));
      this.filterGrid();
    }
    else{
      this.filterArray.push('use2-az2');
      this.filterGrid();
    }
    console.log(event);
  }
  bttnEUWEST3Click(event: any):void{
    if(this.filterArray.includes('euw3-az2')){
      this.filterArray.splice(this.filterArray.indexOf('euw3-az2'));
      this.filterGrid();
    }
    else{
      this.filterArray.push('euw3-az2');
      this.filterGrid();
    }

    console.log(event);
  }
  filterGrid():void{
    if(this.filterArray.length === 0){
      this.filteredDataArray = this.dataArray;
    }
    else{
    this.filteredDataArray = [];
    this.filterArray.forEach(filterValue =>
      {
        this.dataArray.forEach(data =>{
          if( data.sourceAZ === filterValue || data.destinationAZ === filterValue){
            this.filteredDataArray.push(data);
          }

        });
      });
      this.table?.renderRows();
  }
}

}

