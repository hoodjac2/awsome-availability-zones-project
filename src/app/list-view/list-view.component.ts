import { Component, OnInit } from "@angular/core";
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";
import { ListViewModel } from "../classes-and-interfaces/listview.model";
import {MOCK_DATA} from "../classes-and-interfaces/temp-mock-data";
import {ThemePalette} from '@angular/material/core';
import { AZData } from "../classes-and-interfaces/az.model";

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
  displayedColumns: string[] = ['sourceAZ', 'destinationAZ', 'rtt', 'unixTimestamp', 'handshakeTime', 'resolveTime'];
  dataSource :AZData[] = [];

  constructor(private _service: HttpClientServiceComponent){}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void{

  }


  bttnClick():void{
    const result = this._service.getFromDB('use2-az2');
    this.dataSource = result;
    console.log(result);
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

}

