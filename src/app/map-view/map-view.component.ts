/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import * as L from 'leaflet';
import { AZData, AZDataResponse, DBRecord, JsonObj, ResponseFromDB } from "../classes-and-interfaces/az.model";
import { MarkerService } from '../marker.service';
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ThemePalette } from "@angular/material/core";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { GraphViewComponent } from "../graph-view/graph-view.component";
import { MatDialog } from "@angular/material/dialog";
import { name } from "aws-sdk/clients/importexport";
import { Console } from "console";
import { AzNameLookupServiceComponent } from "../az-name-lookup.service/az-name-lookup.service/az-name-lookup.service.component";
import { MatSort, Sort } from '@angular/material/sort';
import { DisplayAZPairPipe } from '../az-name-lookup.service/az-name-lookup.service/display-azpair.pipe';
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
    selectableOne = true;
    removableOne = true;
    separatorKeysCodesOne: number[] = [ENTER, COMMA];
    regionCtrlOne = new FormControl();
    filteredRegionOne: Observable<string[]>;
    regionsOne: string[] = [];
    allRegionsOne: string[] = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'af-south-1', 'ap-south-1', 'ap-northeast-3', 'ap-northeast-2','ap-southeast-1',
    'ap-southeast-2', 'ap-northeast-1', 'ca-central-1', 'eu-central-1', 'eu-west-1',
    'eu-west-2', 'eu-south-1', 'eu-west-3', 'eu-north-1', 'sa-east-1',
    'ap-southeast-1'];

    @ViewChild('regionOneInput')
  regionOneInput!: ElementRef<HTMLInputElement>;

    selectableTwo = false;
    removableTwo = true;
    separatorKeysCodesTwo: number[] = [ENTER, COMMA];
    regionCtrlTwo = new FormControl();
    filteredRegionTwo: Observable<string[]>;
    regionsTwo: string[] = [];
    allRegionsTwo: string[] = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'af-south-1', 'ap-south-1', 'ap-northeast-3', 'ap-northeast-2', 'ap-southeast-1',
    'ap-southeast-2', 'ap-northeast-1', 'ca-central-1', 'eu-central-1', 'eu-west-1',
    'eu-west-2', 'eu-south-1', 'eu-west-3', 'eu-north-1', 'sa-east-1',
    'ap-southeast-1'];

    @ViewChild('regionTwoInput')
  regionTwoInput!: ElementRef<HTMLInputElement>;


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
    //Used so we can determine what the destination AZ names are
    src: string[] = [];
    des: string[] = [];
    //---------GRAPH DATA FIELDS----------------//
    // graphDataString = "name:173.05, value:18.0\nname:173.7, value:20.0\nname:174.35, value:22.0\nname:175.01, value:0.0\nname:175.66, value:20.0\nname:176.31, value:0.0\nname:176.96, value:0.0\nname:177.62, value:0.0\nname:178.27, value:0.0\nname:178.92, value:20.0\n";
    // mind = 12345768;
    // maxd = 12345768;
    // aved = 12345768;
    // medd = 12345768;
    // percent50 = 345678;
    // percent75 = 345678;
    // percent90 = 345678;
    // percent99 = 345678;
    // CurrAZA = 'MAPTEST1';
    // CurrAZB = 'MAPTEST2';


    dataArray: AZData[] = [];
    emptyArray: AZData[] = [];
    filteredDataArray: AZData[] = [];
    localdb: Map<string, DBRecord>;
    dataSource = new MatTableDataSource(this.dataArray);
    @ViewChild(MatSort) sort: MatSort | any;

    @ViewChild(MatTable) table: MatTable<any> | undefined;

    displayedColumns: string[] = ['AZPair','GraphButton', 'AveRTT', 'MinRTT', 'MaxRTT', 'Res_time', 'Handshake_time', 'Percentile50', 'Percentile90'];
    filterArray : string[] = [];
    public fastestAZRecord: AZData = {
      Percentile75: 0,
      Percentile99: 0,
      Percentile50: 0,
      Res_time: 0,
      MinRTT: 0,
      Percentile90: 0,
      MedRTT: 0,
      MaxRTT: 0,
      Handshake_time: 0,
      AveRTT: 0,
      AZPair: "",
      BucketCountArray: []
    };

    sortedData: AZData[] = [];

    public fastestFirstAZ ='';
    public fastestSecondAZ = '';
    private map : any;
    public sendingAZString = 'Select the first Region';
    sendingCirclesLayer = L.layerGroup();
    public receivingAZString = 'Select the second Region';
    receivingCirclesLayer = L.layerGroup();

    constructor(private dbService: HttpClientServiceComponent,
      public dialog: MatDialog
      ){
        this.filteredRegionOne = this.regionCtrlOne.valueChanges.pipe(
          startWith(null),
          map((region: string | null) => (region ? this._filterChipOne(region) : this.allRegionsOne.slice())),
        );
        this.filteredRegionTwo = this.regionCtrlTwo.valueChanges.pipe(
          startWith(null),
          map((region: string | null) => (region ? this._filterChipTwo(region) : this.allRegionsTwo.slice())),
        );
        this.localdb = new Map<string, DBRecord>();

    }

    onClick(_event: any): void {
      this.viewChecked = !this.viewChecked;

      this.des = [];
      this.src = [];
      this.regionsOne = [];
      this.regionsTwo = [];
      this.dataArray = [];
      this.refresh();
    }

    ngAfterViewInit(): void {
      this.dbService.getAllRecordsFromDB().subscribe(result =>{
        const keys = Object.keys(result);
        keys.forEach( key=> {
          this.localdb.set(key, result[key]);
        });

    });

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
      this.dataSource.sort = this.sort;
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
      this.sendingAZString = 'Select the first Region';
      this.receivingAZString = 'Select the second Region';
      this.removeSelectionCircles();
      this.fastestFirstAZ = '';
      this.fastestSecondAZ = '';
      //this.findFastestAZ();
    });

    tiles.addTo(this.map);
    }

    private insertFromLocalDBToDataArray(AZPair: string): void{
      const record  = this.localdb.get(AZPair);
      if(record){

      const dataArrayCompatibleRecord: AZData = {
        Percentile75: record.RTTPS[2],
        Percentile99: record.RTTPS[4],
        Percentile50: record.RTTPS[1],
        Res_time: record.AvgRES,
        MinRTT: record.MinRTT,
        Percentile90: record.RTTPS[3],
        MedRTT: record.RTTPS[0],
        MaxRTT: record.MaxRTT,
        Handshake_time: record.AvgHDS,
        AveRTT: record.AvgRTT,
        AZPair: AZPair,
        BucketCountArray: record.RTTBC
      }
      this.dataArray.push(dataArrayCompatibleRecord);
    }
    }
    private regionCircleEventHandler(regionString: string, e: L.LeafletEvent, azNames: string[]){
      if(this.sendingAZString === 'Select the first Region' ){
        this.sendingAZString = regionString;
        this.createSendingCircles(e.sourceTarget._latlng, e.sourceTarget._mRadius);
        const callouts : string[] = [];
        azNames.forEach( srcName => {
          azNames.forEach( destName =>{
            callouts.push(srcName +','+ destName)
          });
        });
        this.src = azNames;
        callouts.forEach( azPair =>
          this.insertFromLocalDBToDataArray(azPair)
          );
        this.coAverage();
        this.findFastestAZ();
      }
      else{

        this.dataArray = [];

        if(this.receivingAZString !== 'Select the second Region' ){
          this.receivingCirclesLayer.remove();
        }
        this.receivingAZString = regionString;
        this.createReceivingCircles(e.sourceTarget._latlng);

        const callouts : string[] = [];
        this.src.forEach( srcName => {
          azNames.forEach( destName =>{
            callouts.push(srcName +','+ destName)
          });
        });
        //REVERSE CALLS
        azNames.forEach( srcName => {
          this.src.forEach( destName =>{
            callouts.push(srcName +','+ destName)
          });
        });

        callouts.forEach( azPair =>
          this.insertFromLocalDBToDataArray(azPair)
          );
        this.coAverage();
        this.findFastestAZ();

      }
    }

    private getRegionMarkers(): void{
        //Virginia
        const virginia = L.circle([38.262715, -78.205075], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 220000
        })
        .on('click', (e) => {
          this.regionCircleEventHandler('us-east-1', e, this.use1);
        }).bindPopup("<h5>US East 1</h5> Number of AZs: " + this.use1.length);

        //Ohio
        const ohio = L.circle([40.327178, -83.077396], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 220000
        })
        .on('click', (e) => {
          this.regionCircleEventHandler('us-east-2', e, this.use2);
        }).bindPopup("<h5>US East 2</h5> Number of AZs: " + this.use2.length);

        //North California
        const NCalifornia = L.circle([40.226597, -122.148534], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 220000
        })
        .on('click', (e) => {
          this.regionCircleEventHandler('us-west-1', e, this.usw1);
        }).bindPopup("<h5>US West 1</h5> Number of AZs: " + this.usw1.length);

        //Oregon
        const oregon = L.circle([43.879583, -120.698427], {
          color: 'orange',
          fillColor: '#FFA500',
          fillOpacity: 0.5,
          radius: 220000
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
          radius: 230000
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
            radius: 210000
          })
          .on('click', (e) => {
            this.regionCircleEventHandler('eu-south-1', e, this.eus1);
          }).bindPopup("<h5>EU South 1</h5> Number of AZs: "+ this.eus1.length);

          //Stockholm
          const stockholm = L.circle([59.623325, 17.738570], {
            color: 'orange',
            fillColor: '#FFA500',
            fillOpacity: 0.5,
            radius: 150000
          })
          .on('click', (e) => {
            this.regionCircleEventHandler('eu-north-1', e, this.eun1);
          }).bindPopup("<h5>EU North 1</h5> Number of AZs: " + this.eun1.length);
      //Cape Town
      const cape_town = L.circle([-33.797409, 18.890479], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 220000
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('af-south-1', e, this.afs1);
      }).bindPopup("<h5>AF South 1</h5> Number of AZs: " + this.afs1.length);

      //Sydney
      const sydney = L.circle([-33.943360, 150.880895], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 220000
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('ap-southeast-2', e, this.apse2);
      }).bindPopup("<h5>AP Southeast 2</h5> Number of AZs: "+ this.apse2.length);

      //singapore
      const singapore = L.circle([1.318243, 103.758844], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 250000
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('ap-southeast-1', e, this.apse1);
      }).bindPopup("<h5>AP Southeast 1</h5> Number of AZs: " + this.apse1.length);

      //mumbai
      const mumbai = L.circle([18.812718, 72.976586], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 240000
      })
      .on('click', (e) => {
        this.regionCircleEventHandler( 'ap-south-1', e, this.aps1);
      }).bindPopup("<h5>AP South 1</h5> Number of AZs: " + this.aps1.length);

      //seoul
      const seoul = L.circle([37.492294, 126.950256], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 220000
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('ap-northeast-2', e, this.apne2);
      }).bindPopup("<h5>AP Northeast 2</h5> Number of AZs: " + this.apne2.length);
      //Tokyo
      const tokyo = L.circle([35.639441, 139.783990], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 220000
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('ap-northeast-1', e, this.apne1);
      }).bindPopup("<h5>AP Northeast 1</h5> Number of AZs: "+ this.apne1.length);

      //Osaka
      const osaka = L.circle([34.6937, 135.5023], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 220000
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('ap-northeast-3', e, this.apne3);
      }).bindPopup("<h5>AP Northeast 3</h5> Number of AZs: " + this.apne3.length);

      //Canada
      const canada = L.circle([45.841716, -72.833238], {
        color: 'orange',
        fillColor: '#FFA500',
        fillOpacity: 0.5,
        radius: 220000
      })
      .on('click', (e) => {
        this.regionCircleEventHandler('ca-central-1', e, this.cac1);
      }).bindPopup("<h5>CA Central 1</h5> Number of AZs: " + this.cac1.length);

      const markers = L.layerGroup([canada, virginia, ohio, NCalifornia, oregon, paris, south_america, frankfurt,
      london, ireland, milan, stockholm, cape_town, sydney, singapore, tokyo, seoul, osaka, mumbai]);
      markers.addTo(this.map);
    }

    private createSendingCircles(latlng: any, radius: number): void{

      const sendingCircle = L.circle([latlng.lat, latlng.lng], {
        color: 'green',
        fillColor: '#2EE718',
        fillOpacity: 1,
        radius: radius + 5000
      });
      const sendingCircle2 = L.circle([latlng.lat, latlng.lng], {
        color: 'dark green',
        fillColor: '#2ABF19',
        fillOpacity: 1,
        radius: radius - 30000
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

    private findFastestAZ():void{
      let fastestRecord: AZData= {
        Percentile75: 0,
        Percentile99: 0,
        Percentile50: 0,
        Res_time: 0,
        MinRTT: 0,
        Percentile90: 0,
        MedRTT: 0,
        MaxRTT: 0,
        Handshake_time: 0,
        AveRTT: 99999999999999999999999999999999999999999999,
        AZPair: "",
        BucketCountArray: []
      };
      this.dataArray.forEach(azRecord => {
        if(azRecord.AveRTT < fastestRecord.AveRTT){
          fastestRecord = azRecord;
        }
      });
      this.fastestAZRecord = fastestRecord;
      this.fastestAZNamesSplitter(fastestRecord);
    }

    fastestAZNamesSplitter(fastestRecord: AZData) : void{
      const pair = fastestRecord.AZPair;
      const split = pair.split(',');
      this.fastestFirstAZ = split[0];
      this.fastestSecondAZ = split[1];

    }

    toggleOverlay(): void {
      const doc = document.getElementById("overlay");
      if (doc){
        doc.style.display = "none";
      }
    }

    // ------------------------ LIST VIEW HAPPENS BELOW! BEWARE ------------------------- //

    // *************** CHIP ELEMENTS ***************** //

  callDB() : void {
    this.dataArray = [];
    const callouts : string[] = [];
    this.src.forEach( srcName => {
      this.des.forEach( destName =>{
        callouts.push(srcName +','+ destName)
      });
    });
    callouts.forEach( azPair =>
      this.insertFromLocalDBToDataArray(azPair)
      );
      this.refresh();
  }

  sortData(sort: Sort) {
    const data = this.dataArray.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'AZPair':
          return this.compare(a.AZPair, b.AZPair, isAsc);
        case 'AveRTT':
          return this.compare(a.AveRTT, b.AveRTT, isAsc);
        case 'MinRTT':
          return this.compare(a.MinRTT, b.MinRTT, isAsc);
        case 'MaxRTT':
          return this.compare(a.MaxRTT, b.MaxRTT, isAsc);
        case 'Res_time':
          return this.compare(a.Res_time, b.Res_time, isAsc);
        case 'Handshake_time':
          return this.compare(a.Handshake_time, b.Handshake_time, isAsc);
        case 'Percentile50':
          return this.compare(a.Percentile50, b.Percentile50, isAsc);
        case 'Percentile90':
          return this.compare(a.Percentile90, b.Percentile90, isAsc);
        default:
          return 0;
      }
    });

    this.dataArray = this.sortedData;
    this.refresh();
  }


  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


  addChipOne(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our region
    if (value) {
      this.regionsOne.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.regionCtrlOne.setValue(null);
  }

  removeChipOne(region: string): void {
    const index = this.regionsOne.indexOf(region);
    if (index >= 0) {
      this.regionsOne.splice(index, 1);
      const dict = new AzNameLookupServiceComponent();
      const regionTranslated = dict.LookupbyAZ(region);
      let check1 = false;
      let check2 = false;
      if (regionTranslated?.length == 4) {
        if (this.dataArray.length == 0) {
          check1 = true;
        }
        while (check1 == false) {
          for (const arrayAZ of this.dataArray) {
            if (this.dataArray.indexOf(arrayAZ) == this.dataArray.length-1) {
              check1 = true;
            }
            if (regionTranslated == arrayAZ.AZPair.substring(0,4)) {
              this.dataArray.splice(this.dataArray.indexOf(arrayAZ),1);
              break;
            }
          }
        }
        while (check2 == false) {
          for (const elem of this.src) {
            if (this.src.indexOf(elem) == this.src.length-1) {
              check2 = true;
            }
            if (regionTranslated == elem.substring(0,4)) {
              this.src.splice(this.src.indexOf(elem),1);
              break;
            }
          }
        }
      } else {
        while (check1 == false) {
          for (const arrayAZ of this.dataArray) {
            if (this.dataArray.indexOf(arrayAZ) == this.dataArray.length-1) {
              check1 = true;
            }
            if (regionTranslated == arrayAZ.AZPair.substring(0,5)) {
              this.dataArray.splice(this.dataArray.indexOf(arrayAZ),1);
              break;
            }
          }
        }
        while (check2 == false) {
          for (const elem of this.src) {
            if (this.src.indexOf(elem) == this.src.length-1) {
              check2 = true;
            }
            if (regionTranslated == elem.substring(0,5)) {
              this.src.splice(this.des.indexOf(elem),1);
              break;
            }
          }
        }
      }
      this.refresh();
    }
  }

  selectedChipOne(event: MatAutocompleteSelectedEvent): void {
    this.regionsOne.push(event.option.viewValue);
    this.regionOneInput.nativeElement.value = '';

    const arrayRegionName = event.option.viewValue;
    let arrayAZs : string[] = [];
    switch(arrayRegionName) {
      case "us-east-1":
        arrayAZs = this.use1;
        break;
      case "us-east-2":
        arrayAZs = this.use2;
        break;
      case "us-west-1":
        arrayAZs = this.usw1;
        break;
      case "us-west-2":
        arrayAZs = this.usw2;
        break;
      case "af-south-1":
        arrayAZs = this.afs1;
        break;
      case "ap-south-1":
        arrayAZs = this.aps1;
        break;
      case "ap-northeast-3":
        arrayAZs = this.apne3;
        break;
      case "ap-northeast-2":
        arrayAZs = this.apne2;
        break;
      case "ap-northeast-1":
        arrayAZs = this.apne1;
        break;
      case "ap-southeast-2":
        arrayAZs = this.apse1;
        break;
      case "ca-central-1":
        arrayAZs = this.cac1;
        break;
      case "eu-central-1":
        arrayAZs = this.euc1;
        break;
      case "eu-west-1":
        arrayAZs = this.euw1;
        break;
      case "eu-west-2":
        arrayAZs = this.euw2;
        break;
      case "eu-south-1":
        arrayAZs = this.eus1;
        break;
      case "eu-west-3":
        arrayAZs = this.euw3;
        break;
      case "eu-north-1":
        arrayAZs = this.eun1;
        break;
      case "sa-east-1":
        arrayAZs = this.sae1;
        break;
      case "ap-southeast-1":
        arrayAZs = this.apse1;
        break;
    }

    arrayAZs.forEach(
      arrayAZ => {
        this.src.push(arrayAZ);
      }
    );
    this.callDB();

    this.regionCtrlOne.setValue(null);
  }

  refresh(): void {
    this.table?.renderRows();
  }


  private _filterChipOne(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allRegionsOne.filter(region => region.toLowerCase().includes(filterValue));
  }

  addChipTwo(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our region
    if (value) {
      this.regionsTwo.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.regionCtrlTwo.setValue(null);
  }

  removeChipTwo(region: string): void {
    const index2 = this.regionsTwo.indexOf(region);
    if (index2 >= 0) {
      this.regionsTwo.splice(index2, 1);
      const dict2 = new AzNameLookupServiceComponent();
      const regionTranslated2 = dict2.LookupbyAZ(region);
      let check1 = false;
      let check2 = false;
      if (regionTranslated2?.length == 4) {
        if (this.dataArray.length == 0) {
          check1 = true;
        }
        while (check1 == false) {
          for (const arrayAZ of this.dataArray) {
            if (this.dataArray.indexOf(arrayAZ) == this.dataArray.length-1) {
              check1 = true;
            }
            if (regionTranslated2 == arrayAZ.AZPair.substring(9,13)) {
              this.dataArray.splice(this.dataArray.indexOf(arrayAZ),1);
              break;
            }
          }
        }
        while (check2 == false) {
          for (const elem of this.des) {
            if (this.des.indexOf(elem) == this.des.length-1) {
              check2 = true;
            }
            if (regionTranslated2 == elem.substring(0,4)) {
              this.des.splice(this.des.indexOf(elem),1);
              break;
            }
          }
        }
      } else {
        while (check1 == false) {
          for (const arrayAZ of this.dataArray) {
            if (this.dataArray.indexOf(arrayAZ) == this.dataArray.length-1) {
              check1 = true;
            }
            if (regionTranslated2 == arrayAZ.AZPair.substring(9,14)) {
              this.dataArray.splice(this.dataArray.indexOf(arrayAZ),1);
              break;
            }
          }
        }
        while (check2 == false) {
          for (const elem of this.des) {
            if (this.des.indexOf(elem) == this.des.length-1) {
              check2 = true;
            }
            if (regionTranslated2 == elem.substring(0,5)) {
              this.des.splice(this.des.indexOf(elem),1);
              break;
            }
          }
        }
      }
      this.refresh();
    }
  }

  selectedChipTwo(event: MatAutocompleteSelectedEvent): void {
    this.regionsTwo.push(event.option.viewValue);
    this.regionTwoInput.nativeElement.value = '';

    const arrayRegionName = event.option.viewValue;
    let arrayAZs : string[] = [];
    switch(arrayRegionName) {
      case "us-east-1":
        arrayAZs = this.use1;
        break;
      case "us-east-2":
        arrayAZs = this.use2;
        break;
      case "us-west-1":
        arrayAZs = this.usw1;
        break;
      case "us-west-2":
        arrayAZs = this.usw2;
        break;
      case "af-south-1":
        arrayAZs = this.afs1;
        break;
      case "ap-south-1":
        arrayAZs = this.aps1;
        break;
      case "ap-northeast-3":
        arrayAZs = this.apne3;
        break;
      case "ap-northeast-2":
        arrayAZs = this.apne2;
        break;
      case "ap-northeast-1":
        arrayAZs = this.apne1;
        break;
      case "ap-southeast-2":
        arrayAZs = this.apse1;
        break;
      case "ca-central-1":
        arrayAZs = this.cac1;
        break;
      case "eu-central-1":
        arrayAZs = this.euc1;
        break;
      case "eu-west-1":
        arrayAZs = this.euw1;
        break;
      case "eu-west-2":
        arrayAZs = this.euw2;
        break;
      case "eu-south-1":
        arrayAZs = this.eus1;
        break;
      case "eu-west-3":
        arrayAZs = this.euw3;
        break;
      case "eu-north-1":
        arrayAZs = this.eun1;
        break;
      case "sa-east-1":
        arrayAZs = this.sae1;
        break;
      case "ap-southeast-1":
        arrayAZs = this.apse1;
        break;
    }

    arrayAZs.forEach(
      arrayAZ => {
        this.des.push(arrayAZ);
      }
    );
    this.callDB();
    this.regionCtrlTwo.setValue(null);
  }

  private _filterChipTwo(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allRegionsTwo.filter(region => region.toLowerCase().includes(filterValue));
  }

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
          // if (data.sourceAZ == filterValue) {
          //   this.filteredDataArray.push(data);
          // }
        });
      });
    }
    this.table?.renderRows();
  }


  openGraph(): void {
    //COMENTED OUT LINES NEED TO BE FIXED
    //const graphData = this.parseGraph(this.fastestAZRecord);
    const pipe = new DisplayAZPairPipe();
    const AZname = pipe.transform(this.fastestFirstAZ + ',' + this.fastestSecondAZ);
    const dialogRef = this.dialog.open(GraphViewComponent, {
      width: '950px',
      height: '745px',
      data: {
        //dataArray: graphData,
        AZ1: AZname.split(' => ')[0],
        AZ2: AZname.split(' => ')[1],
        mind: this.fastestAZRecord.MinRTT.toFixed(2),
        maxd: this.fastestAZRecord.MaxRTT.toFixed(2),
        aved: this.fastestAZRecord.AveRTT.toFixed(2),
        medd: this.fastestAZRecord.MedRTT.toFixed(2),
        percent50: this.fastestAZRecord.Percentile50.toFixed(2),
        percent75: this.fastestAZRecord.Percentile75.toFixed(2),
        percent90: this.fastestAZRecord.Percentile90.toFixed(2),
        percent99: this.fastestAZRecord.Percentile99.toFixed(2)
      }
    });
  }

  openGraphFromList(Element: any): void {
    const graphData = this.parseGraph(Element.GraphDataString);
    const pipe = new DisplayAZPairPipe();
    const AZname = pipe.transform(Element.AZPair);
    const dialogRef = this.dialog.open(GraphViewComponent, {
      width: '950px',
      height: '745px',
      data: {
        dataArray: graphData,
        AZ1: AZname.split(' => ')[0],
        AZ2: AZname.split(' => ')[1],
        mind: Element.MinRTT.toFixed(2),
        maxd: Element.MaxRTT.toFixed(2),
        aved: Element.AveRTT.toFixed(2),
        medd: Element.MedRTT.toFixed(2),
        percent50: Element.Percentile50.toFixed(2),
        percent75: Element.Percentile75.toFixed(2),
        percent90: Element.Percentile90.toFixed(2),
        percent99: Element.Percentile99.toFixed(2)
      }
    });
  }

  parseGraph(dataString: string): { name: string; value: number; }[] {
    const buckets = dataString.trim().split('\n');
    const JSONthing: { name: string; value: number; }[] = [];
    //console.log("we split the main string");
    buckets.forEach( bucket => {
      const splitted = bucket.split(', ')
      //console.log("we split the bucket");
      const name = splitted[0].split(':')[1];
      //console.log("we split the name");
      const value = Number(splitted[1].split(':')[1]);
      //console.log("we split the number");
      JSONthing.push({
        "name": name,
        "value": value
      });

    });
    return JSONthing;
  }

  averageify(entryA: AZData, entryB: AZData): number{
    const avgA = entryA.AveRTT;
    const avgB = entryB.AveRTT;

    const fullAverage = (avgA + avgB) / 2;

    return fullAverage;
  }

  coAverage(): void{
    this.dataArray.forEach( entryA => {
      const pairA = entryA.AZPair.split(',');
      this.dataArray.forEach( entryB => {
        const pairB = entryB.AZPair.split(',');
        if (pairA[0] == pairB[1] && pairA[1] == pairB[0]){
          const avg = this.averageify(entryA, entryB);
          entryA.AveRTT = avg;
          entryB.AveRTT = avg;
          if (entryA.MinRTT < entryB.MinRTT){
            entryB.MinRTT = entryA.MinRTT;
          }
          else {
            entryA.MinRTT = entryB.MinRTT;
          }
          if (entryA.MaxRTT > entryB.MaxRTT){
            entryB.MaxRTT = entryA.MaxRTT;
          }
          else {
            entryA.MaxRTT = entryB.MaxRTT;
          }
        }
      });
    });
  }
}
