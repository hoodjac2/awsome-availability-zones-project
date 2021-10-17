/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, AfterViewInit } from "@angular/core";
import * as L from 'leaflet';
import { AZData, AZDataResponse, JsonObj } from "../classes-and-interfaces/az.model";
import { MarkerService } from '../marker.service';
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit{
    title = 'capstone-test';
    public fastestAZRecord: AZData = {
      rtt: 0,
      destinationAZ: "",
      unixTimestamp: 0,
      handshakeTime: 0,
      sourceAZ: "",
      resolveTime: 0
    };
    private map : any;
    dataArray: AZData[] = [];
    public sendingAZString = 'Select the sending AZ Region';
    sendingCirclesLayer = L.layerGroup();
    public receivingAZString = 'Select the receiving AZ Region';
    receivingCirclesLayer = L.layerGroup();
    constructor(private dbService: HttpClientServiceComponent){

    }
    ngAfterViewInit(): void {
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
        });

      });
      this.initMap();
     }

     private initMap(): void {
      this.map = L.map('map', {
        center: [35.663711, -95.723905],
        zoom: 4
      });
      this.getRegionMarkers();
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    this.map.on('click', (e: L.LeafletEvent) => {
      this.sendingAZString = 'Select the sending AZ Region';
      this.receivingAZString = 'Select the receiving AZ Region';
      this.removeSelectionCircles();
      this.findFastestAZ();
    });

    tiles.addTo(this.map);
    }


    private getRegionMarkers(): void{
        //Virginia
        const virginia = L.circle([38.262715, -78.205075], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='USE2-AZ2';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'USE2-AZ2';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
        }).bindPopup("This is use2-az2");

        //Ohio
        const ohio = L.circle([40.327178, -83.077396], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='USE1-AZ2';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'USE1-AZ2';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }

        }).bindPopup("This is use1-az2");

        //North California
        const NCalifornia = L.circle([40.226597, -122.148534], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='USW1-AZ2';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'USW1-AZ2';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
        }).bindPopup("This is usw1-az2");

        //Oregon
        const oregon = L.circle([43.879583, -120.698427], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='USW2-AZ2';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'USW2-AZ2';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
        }).bindPopup("This is usw2-az2");

        //Paris
        const paris = L.circle([48.763431, 2.320925], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='EUW3-AZ2';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'EUW3-AZ2';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
        }).bindPopup("This is usw2-az2");
      const markers = L.layerGroup([virginia, ohio, NCalifornia, oregon, paris]);
      markers.addTo(this.map);
    }

    private createSendingCircles(latlng: any): void{

      const sendingCircle = L.circle([latlng.lat, latlng.lng], {
        color: 'green',
        fillColor: '#2EE718',
        fillOpacity: 1,
        radius: 187500
      });
      const sendingCircle2 = L.circle([latlng.lat, latlng.lng], {
        color: 'dark green',
        fillColor: '#2ABF19',
        fillOpacity: 1,
        radius: 150000
      });

      const markers = L.layerGroup([sendingCircle, sendingCircle2]);
      markers.addTo(this.map);
      this.sendingCirclesLayer = markers;
    }

    private createReceivingCircles(latlng: any): void{

      const receivingCircle = L.circle([latlng.lat, latlng.lng], {
        color: 'green',
        fillColor: '#2EE718',
        fillOpacity: 1,
        radius: 187500
      });
      const receivingCircle2 = L.circle([latlng.lat, latlng.lng], {
        color: 'dark green',
        fillColor: '#2ABF19',
        fillOpacity: 1,
        radius: 150000
      });

      const markers = L.layerGroup([receivingCircle, receivingCircle2]);
      markers.addTo(this.map);
      this.receivingCirclesLayer = markers;
    }

    private removeSelectionCircles(): void{
      this.sendingCirclesLayer.remove();
      this.receivingCirclesLayer.remove();
    }
    private findFastestAZ():void{
      let fastestRecord: AZData= {
        rtt: 9999999999999999999999999999999999999999999999999999999999999,
        destinationAZ: "",
        unixTimestamp: 0,
        handshakeTime: 0,
        sourceAZ: "",
        resolveTime: 0
      };
      this.dataArray.forEach(azRecord => {
        if(azRecord.rtt < fastestRecord.rtt &&
         azRecord.sourceAZ === this.sendingAZString.toLocaleLowerCase() && azRecord.destinationAZ === this.receivingAZString.toLocaleLowerCase()){
          fastestRecord = azRecord;
        }
        else if(this.receivingAZString === 'Select the receiving AZ Region' && azRecord.rtt < fastestRecord.rtt && azRecord.sourceAZ === this.sendingAZString.toLocaleLowerCase()){
          fastestRecord = azRecord;
        }
      });
      this.fastestAZRecord = fastestRecord;
    }



}
