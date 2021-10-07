import { Component, OnInit } from "@angular/core";
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";
import { ListViewModel } from "../classes-and-interfaces/listview.model";
import {MOCK_DATA} from "../classes-and-interfaces/temp-mock-data";
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
}
