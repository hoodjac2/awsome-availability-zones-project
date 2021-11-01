/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import * as L from 'leaflet';
import { AZData, AZDataResponse, JsonObj } from "../classes-and-interfaces/az.model";
import { MarkerService } from '../marker.service';
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";
import { MatTable } from "@angular/material/table";
import { ThemePalette } from "@angular/material/core";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { GraphViewComponent } from "../graph-view/graph-view.component";
import { MatDialog } from "@angular/material/dialog";
//import { GraphViewComponent } from "../graph-view/graph-view.component";
//import { MatDialog } from "@angular/material/dialog";

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit{
    title = 'capstone-test';
    viewChecked = false;
    // Testing Checkbox filtering
    // -----------------------------------------//
    checkBoxChecked = false;                    //
    checkBoxMap = new Map();                    // Map that monitors status of each checkbox
    // -----------------------------------------//

    // Tesitng Chips Element
    // -----------------------------------------//
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl();
    filteredFruits: Observable<string[]>;
    fruits: string[] = ['US-East1 AZ 1 (us-east-1-az1)'];
    allFruits: string[] = ['US-East1 AZ 1 (us-east-1-az1)', 'US-East2 AZ 2 (us-east-2-az-1)', 'Lime', 'Orange', 'Strawberry'];

    @ViewChild('fruitInput')
  fruitInput!: ElementRef<HTMLInputElement>;
    // -----------------------------------------//


    dataArray: AZData[] = [];
    filteredDataArray: AZData[] = [];

    @ViewChild(MatTable) table: MatTable<any> | undefined;

    displayedColumns: string[] = ['sourceAZ', 'destinationAZ', 'rtt', 'unixTimestamp','resolveTime'];
    filterArray : string[] = [];

    public fastestAZRecord: AZData = {
      rtt: 0,
      destinationAZ: "",
      unixTimestamp: 0,
      handshakeTime: 0,
      sourceAZ: "",
      resolveTime: 0
    };
    private map : any;
    public sendingAZString = 'Select the sending AZ Region';
    sendingCirclesLayer = L.layerGroup();
    public receivingAZString = 'Select the receiving AZ Region';
    receivingCirclesLayer = L.layerGroup();

    constructor(private dbService: HttpClientServiceComponent,
      //public dialog: MatDialog
      ){
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
    }

    onClick(event: any): void {
      this.viewChecked = !this.viewChecked;
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
        center: [26.115986, -32.827080],
        zoom: 1,
        maxBounds: L.latLngBounds(L.latLng(-89.99, -180),  L.latLng(89.99, 180)),
        maxBoundsViscosity: 1.0
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
            this.sendingAZString ='us-east-2';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'us-east-2';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
        }).bindPopup("<h5>US East 1</h5> Number of AZs: 6");

        //Ohio
        const ohio = L.circle([40.327178, -83.077396], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='us-east-1';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'us-east-1';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }

        }).bindPopup("<h5>US East 2</h5> Number of AZs: 3");

        //North California
        const NCalifornia = L.circle([40.226597, -122.148534], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='us-west-1';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'us-west-1';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
        }).bindPopup("<h5>US West 1</h5> Number of AZs: 3");

        //Oregon
        const oregon = L.circle([43.879583, -120.698427], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='us-west-2';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'us-west-2';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
        }).bindPopup("<h5>US West 2</h5> Number of AZs: 4");

        //Paris
        const paris = L.circle([48.763431, 2.320925], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='eu-west-3';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'eu-west-3';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
        }).bindPopup("<h5>EU West 3</h5> Number of AZs: 4");

         //South America
         const south_america = L.circle([-23.845650, -46.735590], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='sa-east-1';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'sa-east-1';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
        }).bindPopup("<h5>SA East 1</h5> Number of AZs: 3");

         //Ireland
        const ireland = L.circle([53.120405, -8.740041], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='eu-west-1';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'eu-west-1';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
        }).bindPopup("<h5>EU West 1</h5> Number of AZs: 3");

        //Frankfurt
        const frankfurt = L.circle([51.124213, -2.496520], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          if(this.sendingAZString === 'Select the sending AZ Region' ){
            this.sendingAZString ='eu-central-1';
            this.createSendingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
          else{
            this.receivingAZString = 'eu-central-1';
            this.createReceivingCircles(e.sourceTarget._latlng);
            this.findFastestAZ();
          }
        }).bindPopup("<h5>EU Central 1</h5> Number of AZs: 3");

          //London
          const london = L.circle([51.727028, -0.385737], {
            color: 'orange',
            fillColor: '#FFA500',
            fillOpacity: 0.5,
            radius: 187500
          })
          .on('click', (e) => {
            if(this.sendingAZString === 'Select the sending AZ Region' ){
              this.sendingAZString ='eu-west-2';
              this.createSendingCircles(e.sourceTarget._latlng);
              this.findFastestAZ();
            }
            else{
              this.receivingAZString = 'eu-west-2';
              this.createReceivingCircles(e.sourceTarget._latlng);
              this.findFastestAZ();
            }
          }).bindPopup("<h5>EU West 2</h5> Number of AZs: 3");
          //Milan
          const milan = L.circle([43.850374, 11.374745], {
            color: 'orange',
            fillColor: '#FFA500',
            fillOpacity: 0.5,
            radius: 187500
          })
          .on('click', (e) => {
            if(this.sendingAZString === 'Select the sending AZ Region' ){
              this.sendingAZString ='eu-south-1';
              this.createSendingCircles(e.sourceTarget._latlng);
              this.findFastestAZ();
            }
            else{
              this.receivingAZString = 'eu-south-1';
              this.createReceivingCircles(e.sourceTarget._latlng);
              this.findFastestAZ();
            }
          }).bindPopup("<h5>EU South 1</h5> Number of AZs: 3");

          //Stockholm
          const stockholm = L.circle([59.623325, 17.738570], {
            color: 'orange',
            fillColor: '#FFA500',
            fillOpacity: 0.5,
            radius: 187500
          })
          .on('click', (e) => {
            if(this.sendingAZString === 'Select the sending AZ Region' ){
              this.sendingAZString ='eu-north-1';
              this.createSendingCircles(e.sourceTarget._latlng);
              this.findFastestAZ();
            }
            else{
              this.receivingAZString = 'eu-north-1';
              this.createReceivingCircles(e.sourceTarget._latlng);
              this.findFastestAZ();
            }
          }).bindPopup("<h5>EU North 1</h5> Number of AZs: 3");
      //Cape Town
      const cape_town = L.circle([-33.797409, 18.890479], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        if(this.sendingAZString === 'Select the sending AZ Region' ){
          this.sendingAZString ='af-south-1';
          this.createSendingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
        else{
          this.receivingAZString = 'af-south-1';
          this.createReceivingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
      }).bindPopup("<h5>AF South 1</h5> Number of AZs: 3");

      //Sydney
      const sydney = L.circle([-33.943360, 150.880895], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        if(this.sendingAZString === 'Select the sending AZ Region' ){
          this.sendingAZString ='ap-southeast-2';
          this.createSendingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
        else{
          this.receivingAZString = 'ap-southeast-2';
          this.createReceivingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
      }).bindPopup("<h5>AP Southeast 2</h5> Number of AZs: 3");

      //singapore
      const singapore = L.circle([1.318243, 103.758844], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        if(this.sendingAZString === 'Select the sending AZ Region' ){
          this.sendingAZString ='ap-southeast-1';
          this.createSendingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
        else{
          this.receivingAZString = 'ap-southeast-1';
          this.createReceivingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
      }).bindPopup("<h5>AP Southeast 1</h5> Number of AZs: 3");
      //mumbai
      const mumbai = L.circle([18.812718, 72.976586], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        if(this.sendingAZString === 'Select the sending AZ Region' ){
          this.sendingAZString ='ap-south-1';
          this.createSendingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
        else{
          this.receivingAZString = 'ap-south-1';
          this.createReceivingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
      }).bindPopup("<h5>AP South 1</h5> Number of AZs: 3");
      //seoul
      const seoul = L.circle([37.492294, 126.950256], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        if(this.sendingAZString === 'Select the sending AZ Region' ){
          this.sendingAZString ='ap-northeast-2';
          this.createSendingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
        else{
          this.receivingAZString = 'ap-northeast-2';
          this.createReceivingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
      }).bindPopup("<h5>AP Northeast 2</h5> Number of AZs: 4");
      //Tokyo
      const tokyo = L.circle([35.639441, 139.783990], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        if(this.sendingAZString === 'Select the sending AZ Region' ){
          this.sendingAZString ='ap-northeast-1';
          this.createSendingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
        else{
          this.receivingAZString = 'ap-northeast-1';
          this.createReceivingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
      }).bindPopup("<h5>AP Northeast 1</h5> Number of AZs: 4");

      //Osaka
      const osaka = L.circle([34.6937, 135.5023], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        if(this.sendingAZString === 'Select the sending AZ Region' ){
          this.sendingAZString ='ap-northeast-3';
          this.createSendingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
        else{
          this.receivingAZString = 'ap-northeast-3';
          this.createReceivingCircles(e.sourceTarget._latlng);
          this.findFastestAZ();
        }
      }).bindPopup("<h5>AP Northeast 3</h5> Number of AZs: 3");



      const markers = L.layerGroup([virginia, ohio, NCalifornia, oregon, paris, south_america, frankfurt,
      london, ireland, milan, stockholm, cape_town, sydney, singapore, tokyo, seoul, osaka, mumbai]);
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




    // LIST VIEW HAPPENS BELOW! BEWARE

  bttnClick(event: any):void{
    //const val = document.querySelector('input').value;
    console.log(event);
  }

  applyFilter(filterValue: string):void {
    this.filterArray.splice(this.filterArray.indexOf(filterValue));
    this.filterGrid();
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
  bttnCheckBox(event: unknown, filterValue: string):void {

    // Check to see if checkbox has been checked before
    if (!this.checkBoxMap.has(filterValue)) {
      this.checkBoxMap.set(filterValue, 1);
      this.filterArray.push(filterValue);
      this.filterGrid();
    } else {
      if (this.checkBoxMap.get(filterValue) == 1) {
        // If the checkbox is being checked off
        this.checkBoxMap.set(filterValue, 0);
        this.filterArray.splice(this.filterArray.indexOf(filterValue));
        this.filterGrid();
      } else {
        // If the checkbox is being checked
/*         if (this.filterArray.includes(filterValue)) {
          this.filterArray.splice(this.filterArray.indexOf(filterValue));
          this.filterGrid();
        }
        else { */
          this.filterArray.push(filterValue);
          this.filterGrid();
          this.checkBoxMap.set(filterValue, 1);
      }
      console.log(this.checkBoxMap.get(filterValue));
      console.log(this.checkBoxMap.size);
    }
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
  filterGrid():void{
    if(this.filterArray.length === 0){
      //this.filteredDataArray = this.dataArray;
      this.filteredDataArray = [];
    }
    else{
    this.filteredDataArray = [];
    this.filterArray.forEach(filterValue =>
      {
        this.dataArray.forEach(data =>{
          // Separate based on only source or only destination AZs
          // *WORK IN PROGRESS* //
/*
          if( data.sourceAZ === filterValue || data.destinationAZ === filterValue){
            this.filteredDataArray.push(data);
          }
*/
          if (data.sourceAZ == filterValue) {
            this.filteredDataArray.push(data);
          }
        });
      });
    }
    this.table?.renderRows();
  }

  // CHIPS //
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  openGraph(): void {
 //   const dialogRef = this.dialog.open(GraphViewComponent);
  }
}
