import { Component, NgModule, OnInit } from "@angular/core";
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";
import { ListViewModel } from "../classes-and-interfaces/listview.model";
import {MOCK_DATA} from "../classes-and-interfaces/temp-mock-data";
import {ThemePalette} from '@angular/material/core';

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
  displayedColumns: string[] = ['azTitle', 'latency', 'date'];
  dataSource :ListViewModel[] = MOCK_DATA;

  constructor(private _service: HttpClientServiceComponent){}

  ngOnInit(){
    this._service.getFromDB();
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

  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }

}

