import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit{
    title = 'capstone-test';
    ImagePath: string;
  
    constructor() {
        //image location
        this.ImagePath = '/assets/mockup.jpg'
    }
  
    ngOnInit() {
    }
}