import { Component, OnInit } from "@angular/core";
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";

@Component({
  selector: 'list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit{
  constructor(private _service: HttpClientServiceComponent){}
  title = 'capstone-test';
  ngOnInit(){
    this._service.getFromDB();
  }
}
