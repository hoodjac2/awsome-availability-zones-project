/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, AfterViewInit } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Subject } from "rxjs";
import { PassThrough } from "stream";
import { AZDataResponse, JsonObj, AZData } from "../classes-and-interfaces/az.model";
import { MOCK_DATA } from '../classes-and-interfaces/temp-mock-data';
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";

/**
 * Graph view created by Wynton using ngx-charts by Swimlane
 * Documentation can be found here: https://swimlane.gitbook.io/ngx-charts/examples/line-area-charts/line-chart
 */

@Component({
  selector: 'graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent implements AfterViewInit{

  dataArray: AZData[] = []; //data pulled from database

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

  }

  // buncha testing data
  points = [
    {
      "name": " ",
      "value": 1000
    }
  ]


  // options/settings
  // there's no title setting on this so we gotta DIY
  legend = true;
  legendTitle = "Legend"
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Latency (ms)';
  yAxisLabel = 'Frequency (%)';


  onClick(): void{
    // Object.assign(this, {points: [
    //   {
    //     "name": "test",
    //     "value": 5000
    //   }
    // ]})
    //construct graphed Dataset
    this.graphDataFormatting();
  }
  // constructor() {
  //   Object.assign(this, { points });
  // }

  // in theory this stuff is to let you do mouseovers of the data
  // onSelect(data): void {
  //   console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  // }

  // onActivate(data): void {
  //   console.log('Activate', JSON.parse(JSON.stringify(data)));
  // }

  // onDeactivate(data): void {
  //   console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  // }
  graphDataFormatting(): void {
    // create the buckets and total counter
    const total = this.dataArray.length;

    let below900k = 0;
    let over900k = 0;
    let over903 = 0;
    let over904 = 0;
    let over910 = 0;
    let over913 = 0;
    let over920 = 0;
    let over921 = 0;
    let over922 = 0;

    this.dataArray.forEach(azRecord => {
      const time = azRecord.rtt;
      // resolve it into ms? or just lop off the ends?
      // Bucket all the timing data into tallies
      if(time < 1000000){
        below900k += 1
      }
      else if ((time >= 1000000) && (time < 90300000)){
        over900k += 1
      }
      else if ((time >= 90300000) && (time < 90400000)){
        over903 += 1
      }
      else if ((time >= 90400000) && (time < 91000000)){
        over904 += 1
      }
      else if ((time >= 91000000) && (time < 91300000)){
        over910 += 1
      }
      else if ((time >= 91300000) && (time < 92000000)){
        over913 += 1
      }
      else if ((time >= 92000000) && (time < 92100000)){
        over920 += 1
      }
      else if ((time >= 92100000) && (time < 92200000)){
        over921 += 1
      }
      else if (time > 92200000) {
        over922 += 1
      }
    });

    //sub9k = sub9k/total;


    // convert those tallies into percentages in Points
    // Format:
    // {
    //   "name": "name the column here"
    //   "value": the data point here
    // }
    Object.assign(this, {points:[
          {
            "name": "> 900k",
            "value": (below900k)/total*100
          },
          {
            "name": "900k-90.2m",
            "value": (over900k)/total*100
          },
          {
            "name": "90.3m",
            "value": (over903)/total*100
          },
          {
            "name": "90.4m",
            "value": (over904)/total*100
          },
          {
            "name": "91m",
            "value": (over910)/total*100
          },
          {
            "name": "91.3m",
            "value": (over913)/total*100
          },
          {
            "name": "92m",
            "value": (over920)/total*100
          },
          {
            "name": "92.1m",
            "value": (over921)/total*100
          },
          {
            "name": "92.2m <",
            "value": (over922)/total*100
          }
        ]
      }
    )
  }
}
