/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";
import { ListViewModel } from "../classes-and-interfaces/listview.model";
import {MOCK_DATA} from "../classes-and-interfaces/temp-mock-data";
import {ThemePalette} from '@angular/material/core';
import { AZData, AZDataResponse, JsonObj } from "../classes-and-interfaces/az.model";
import { deserialize } from "v8";
import { MatTable } from "@angular/material/table";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";

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

  yourFlag = true;

  constructor(private dbService: HttpClientServiceComponent){
  }


  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void{
  }

  isTrue():void {
    this.yourFlag = true;
  }

  bttnClick(event: any):void{
    //const val = document.querySelector('input').value;
    console.log(event);
  }

  applyFilter(filterValue: string):void {
    this.filterArray.splice(this.filterArray.indexOf(filterValue));
 //   this.filterGrid();
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
  bttnCheckBox(event: unknown, filterValue: string):void{
    if (this.filterArray.includes(filterValue)) {
      this.filterArray.splice(this.filterArray.indexOf(filterValue));
  //    this.filterGrid();
    }
    else {
      this.filterArray.push(filterValue);
  //    this.filterGrid();
    }
    console.log(event);
  }
  /*
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
  } */
    // filterGrid():void{
    //   if(this.filterArray.length === 0){
    //     this.filteredDataArray = this.dataArray;
    //   }
    //   else{
    //   this.filteredDataArray = [];
    //   this.filterArray.forEach(filterValue =>
    //     {
    //       this.dataArray.forEach(data =>{
    //         if( data.sourceAZ === filterValue || data.destinationAZ === filterValue){
    //           this.filteredDataArray.push(data);
    //         }

    //       });
    //     });
    //     this.table?.renderRows();
    // }
  //}
}
