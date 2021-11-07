/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import * as L from 'leaflet';
import { AZData, AZDataResponse, JsonObj } from "../classes-and-interfaces/az.model";
import { MarkerService } from '../marker.service';
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";
import { MatTable } from "@angular/material/table";
import { ThemePalette } from "@angular/material/core";
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
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

export interface regionObj {
  name: string;
  id: string;
}

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit{
    viewChecked = false;
    loading = true;
    // Testing Checkbox filtering
    // -----------------------------------------//
    checkBoxChecked = false;                    //
    checkBoxMap = new Map();                    // Map that monitors status of each checkbox
    // -----------------------------------------//

    // Tesitng Chips Element
    // -----------------------------------------//
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [SPACE, COMMA];
    regionCtrl = new FormControl();
    filteredRegions: Observable<string[]>;
    allAZIDs : string[] = [];
    region: string[] = ['us-east-1'];
    allRegions: string[] = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'af-south-1', 'ap-south-1', 'ap-northeast-3', 'ap-northeast-2',
    'ap-southeast-2', 'ap-northeast-1', 'ca-central-1', 'eu-central-1', 'eu-west-1',
    'eu-west-2', 'eu-south-1', 'eu-west-3', 'eu-north-1', 'sa-east-1'];

    @ViewChild('regionInput')
    regionInput!: ElementRef<HTMLInputElement>;
    formControl = new FormControl(['']);

    //------ 19 empty region arrays from DB -----//
    afs1: string[] = [];
    apne1: string[] = [];
    apne2: string[] = [];
    apne3: string[] = [];
    aps1: string[] = [];
    apse1: string[] = [];
    apse2: string[] = [];
    cac1: string[] = [];
    euc1: string[] = [];
    eun1: string[] = [];
    eus1: string[] = [];
    euw1: string[] = [];
    euw2: string[] = [];
    euw3: string[] = [];
    sae1: string[] = [];
    use1: string[] = [];
    use2: string[] = [];
    usw1: string[] = [];
    usw2: string[] = [];
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
      public dialog: MatDialog
      ){
      this.filteredRegions = this.regionCtrl.valueChanges.pipe(
        startWith(null),
        map((region: string | null) => region ? this._filter(region) : this.allRegions.slice()));
    }

    onClick(_event: any): void {
      this.viewChecked = !this.viewChecked;
    }

    ngAfterViewInit(): void {
      // Initialize data arrays
      this.dbService.loadAZNames().subscribe( result =>{
        result.forEach((azCall: { body: string[]; }) => {
          //console.log(azCall.body);
          const arrayName = azCall.body[0].substring(0,4);
          const arrayNum = azCall.body[0].charAt(4);
          if (arrayName == "afs1") {
            this.afs1 = azCall.body;
          } else if (arrayName == "apne") {
            if (arrayNum == "1") {
              this.apne1 = azCall.body;
            } else if (arrayNum == "2") {
              this.apne2 = azCall.body;
            } else if (arrayNum == "3") {
              this.apne3 = azCall.body;
            }
          }  else if (arrayName == "aps1") {
            this.aps1 = azCall.body;
          } else if (arrayName == "apse") {
            if (arrayNum == "1") {
              this.apse1 = azCall.body;
            } else if (arrayNum == "2") {
              this.apse2 = azCall.body;
            }
          } else if (arrayName == "cac1") {
            this.cac1 = azCall.body;
          } else if (arrayName == "euc1") {
            this.euc1 = azCall.body;
          } else if (arrayName == "eun1") {
            this.eun1 = azCall.body;
          } else if (arrayName == "eus1") {
            this.eus1 = azCall.body;
          } else if (arrayName == "euw1") {
            this.euw1 = azCall.body;
          } else if (arrayName == "euw2") {
            this.euw2 = azCall.body;
          } else if (arrayName == "euw3") {
            this.euw3 = azCall.body;
          } else if (arrayName == "sae1") {
            this.sae1 = azCall.body;
          } else if (arrayName == "use1") {
            this.use1 = azCall.body;
          } else if (arrayName == "use2") {
            this.use2 = azCall.body;
          } else if (arrayName == "usw2") {
            this.usw2 = azCall.body;
          } else if (arrayName == "usw1") {
            this.usw1 = azCall.body;
        }
        });
        this.loading = false;
        this.initMap();
      });
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

    this.map.on('click', (_e: L.LeafletEvent) => {
      this.sendingAZString = 'Select the sending AZ Region';
      this.receivingAZString = 'Select the receiving AZ Region';
      this.removeSelectionCircles();
      this.findFastestAZ();
    });

    tiles.addTo(this.map);
    }


    private regionCircleEventHandler(regionString: string, e: L.LeafletEvent, azNames: string[]){
      if(this.sendingAZString === 'Select the sending AZ Region' ){
        this.sendingAZString = regionString;
        this.createSendingCircles(e.sourceTarget._latlng);
        this.findFastestAZ();

        //TODO: LOAD DATA INTO AN ARRAY
        this.dbService.getRecordsFromDB(azNames).subscribe(
          data => {
            data.forEach((record: any) => {
              console.log(record);
            });
          }
        );
      }
      else{
        if(this.receivingAZString !== 'Select the sending AZ Region' ){
          this.receivingCirclesLayer.remove();
        }
        this.receivingAZString = regionString;
        this.createReceivingCircles(e.sourceTarget._latlng);
        this.findFastestAZ();
      }
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
          this.regionCircleEventHandler('us-east-1', e, this.use1);
        }).bindPopup("<h5>US East 1</h5> Number of AZs: " + this.use1.length);

        //Ohio
        const ohio = L.circle([40.327178, -83.077396], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          this.regionCircleEventHandler('us-east-2', e, this.use2);
        }).bindPopup("<h5>US East 2</h5> Number of AZs: " + this.use2.length);

        //North California
        const NCalifornia = L.circle([40.226597, -122.148534], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          this.regionCircleEventHandler('us-west-1', e, this.usw1);
        }).bindPopup("<h5>US West 1</h5> Number of AZs: " + this.usw1.length);

        //Oregon
        const oregon = L.circle([43.879583, -120.698427], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          this.regionCircleEventHandler('us-west-2', e, this.usw2);
        }).bindPopup("<h5>US West 2</h5> Number of AZs: " + this.usw2.length);

        //Paris
        const paris = L.circle([48.763431, 2.320925], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          this.regionCircleEventHandler('eu-west-3', e, this.euw3);
        }).bindPopup("<h5>EU West 3</h5> Number of AZs: " + this.euw3.length);

         //South America
         const south_america = L.circle([-23.845650, -46.735590], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          this.regionCircleEventHandler('sa-east-1', e, this.sae1);
        }).bindPopup("<h5>SA East 1</h5> Number of AZs: "+ this.sae1.length);

         //Ireland
        const ireland = L.circle([53.120405, -8.740041], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          this.regionCircleEventHandler('eu-west-1', e, this.euw1);
        }).bindPopup("<h5>EU West 1</h5> Number of AZs: "+ this.euw1.length);

        //Frankfurt
        const frankfurt = L.circle([51.124213, -2.496520], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 187500
        })
        .on('click', (e) => {
          this.regionCircleEventHandler('eu-central-1', e, this.euc1);
        }).bindPopup("<h5>EU Central 1</h5> Number of AZs: "+ this.euc1.length);

          //London
          const london = L.circle([51.727028, -0.385737], {
            color: 'orange',
            fillColor: '#FFA500',
            fillOpacity: 0.5,
            radius: 187500
          })
          .on('click', (e) => {
            this.regionCircleEventHandler('eu-west-2', e, this.euw2);
          }).bindPopup("<h5>EU West 2</h5> Number of AZs: " + this.euw2.length);

          //Milan
          const milan = L.circle([43.850374, 11.374745], {
            color: 'orange',
            fillColor: '#FFA500',
            fillOpacity: 0.5,
            radius: 187500
          })
          .on('click', (e) => {
            this.regionCircleEventHandler('eu-south-1', e, this.eus1);
          }).bindPopup("<h5>EU South 1</h5> Number of AZs: "+ this.eus1.length);

          //Stockholm
          const stockholm = L.circle([59.623325, 17.738570], {
            color: 'orange',
            fillColor: '#FFA500',
            fillOpacity: 0.5,
            radius: 187500
          })
          .on('click', (e) => {
            this.regionCircleEventHandler('eu-north-1', e, this.eun1);
          }).bindPopup("<h5>EU North 1</h5> Number of AZs: " + this.eun1.length);
      //Cape Town
      const cape_town = L.circle([-33.797409, 18.890479], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('af-south-1', e, this.afs1);
      }).bindPopup("<h5>AF South 1</h5> Number of AZs: " + this.afs1.length);

      //Sydney
      const sydney = L.circle([-33.943360, 150.880895], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('ap-southeast-2', e, this.apse1);
      }).bindPopup("<h5>AP Southeast 2</h5> Number of AZs: "+ this.apse1.length);

      //singapore
      const singapore = L.circle([1.318243, 103.758844], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('ap-southeast-1', e, this.apse2);
      }).bindPopup("<h5>AP Southeast 1</h5> Number of AZs: " + this.apse2.length);

      //mumbai
      const mumbai = L.circle([18.812718, 72.976586], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        this.regionCircleEventHandler( 'ap-south-1', e, this.aps1);
      }).bindPopup("<h5>AP South 1</h5> Number of AZs: " + this.aps1.length);

      //seoul
      const seoul = L.circle([37.492294, 126.950256], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('ap-northeast-2', e, this.apne1);
      }).bindPopup("<h5>AP Northeast 2</h5> Number of AZs: " + this.apne2.length);
      //Tokyo
      const tokyo = L.circle([35.639441, 139.783990], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('ap-northeast-1', e, this.apne1);
      }).bindPopup("<h5>AP Northeast 1</h5> Number of AZs: "+ this.apne1.length);

      //Osaka
      const osaka = L.circle([34.6937, 135.5023], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 187500
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('ap-northeast-3', e, this.apne3);
      }).bindPopup("<h5>AP Northeast 3</h5> Number of AZs: " + this.apne3.length);

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
      this.dataArray = [];
      this.sendingCirclesLayer.remove();
      this.receivingCirclesLayer.remove();
    }

    //TODO: DEPRECATED.  REDO THE BELOW FOR ALPHA
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



    toggleOverlay(): void {
      const doc = document.getElementById("overlay");
      if (doc){
        doc.style.display = "none";
      }
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
      this.region.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.regionCtrl.setValue(null);
    this.table?.renderRows();
  }

  remove(region: string): void {
    const index = this.region.indexOf(region);

    if (index >= 0) {
      this.region.splice(index, 1);
    }

    this.table?.renderRows();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.region.push(event.option.viewValue);
    this.regionInput.nativeElement.value = '';
    this.regionCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allRegions.filter(region => region.toLowerCase().includes(filterValue));
  }

  openGraph(): void {
    const dialogRef = this.dialog.open(GraphViewComponent, {
      width: '950px',
      height: '725px',
      data: {
        dataArray: this.dataArray,
        AZ1: 'MAPTEST1',
        AZ2: 'MAPTEST2'
      }
    });
  }
}
