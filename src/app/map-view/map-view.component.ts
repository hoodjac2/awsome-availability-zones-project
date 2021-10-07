import { Component, AfterViewInit } from "@angular/core";
import * as L from 'leaflet';
import { MarkerService } from '../marker.service';

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit{
    title = 'capstone-test';
    private map : any;
    constructor(private markerService: MarkerService){

    }
    ngAfterViewInit(): void {
      this.initMap();
     }
     private initMap(): void {
      this.map = L.map('map', {
        center: [37.663711, -78.723905],
        zoom: 3
      });
      var regions = this.getRegionMarkers();
      regions.forEach(regionMarker => {
        regionMarker.addTo(this.map);
      });
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    }
    private getRegionMarkers(): any[]{
      var arrayOfRegions = [
        //Virginia
        L.circle([38.262715, -78.205075], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 250000
        }).bindPopup("I am US-EAST/Virginia."),
        //Ohio
        L.circle([40.327178, -83.077396], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 250000
        }).bindPopup("I am US-EAST/Ohio."),
        //North California
        L.circle([40.226597, -122.148534], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 250000
        }).bindPopup("I am US-WEST/CALI."),
        //Oregon
        L.circle([43.879583, -120.698427], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 250000
        }).bindPopup("I am US-WEST/OREGON."),
      ];
      return arrayOfRegions;
    }
}
