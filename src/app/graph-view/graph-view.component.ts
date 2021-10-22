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
  xAxisLabel = 'Latency by floor (ms)';
  yAxisLabel = 'Frequency (%)';
  AZ1 = "USE2-AZ2";
  AZ2 = "EUW2-AZ2";

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

  graphDataFormatting(): void {
    // create the buckets and total counter
    // max out around say 20? starting with 10 for now
    const total = this.dataArray.length;

    const sortedArray = this.dataArray.sort((a, b) => a.rtt - b.rtt);

    const mini = sortedArray[0].rtt;
    const maxi = sortedArray[total - 1].rtt;

    const bucketSize = (maxi - mini)/10;

    const buckets: number[] = new Array(10);
    for (let i = 0;  i < buckets.length; i++){
      buckets[i] = Math.round(mini + (bucketSize * i));
    //  buckets[i] = 420696969
    }

    // convert into a list later?
    const counts: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    this.dataArray.forEach(azRecord => {
      const time = azRecord.rtt;
      // resolve it into ms? or just lop off the ends?
      // Bucket all the timing data into tallies
      if ((time >= buckets[0]) && (time < buckets[1])){
        counts[0] += 1
      }
      else if ((time >= buckets[1]) && (time < buckets[2])){
        counts[1] += 1
      }
      else if ((time >= buckets[2]) && (time < buckets[3])){
        counts[2] += 1
      }
      else if ((time >= buckets[3]) && (time < buckets[4])){
        counts[3] += 1
      }
      else if ((time >= buckets[4]) && (time < buckets[5])){
        counts[4] += 1
      }
      else if ((time >= buckets[5]) && (time < buckets[6])){
        counts[5] += 1
      }
      else if ((time >= buckets[6]) && (time < buckets[7])){
        counts[6] += 1
      }
      else if ((time >= buckets[7]) && (time < buckets[8])){
        counts[7] += 1
      }
      else if ((time >= buckets[8]) && (time < buckets[9])){
        counts[8] += 1
      }
      else if (time > buckets[9]) {
        counts[9] += 1
      }
    });

    //sub9k = sub9k/total;


    // convert those tallies into percentages in Points
    // Format:
    // {
    //   "name": "name the column here"
    //   "value": the data point here
    // }
    const shifter = Math.pow(10, -6);
    Object.assign(this, {points:[
          {
            "name": (buckets[0] * shifter).toFixed(2),
            "value": (counts[0])/total*100
          },
          {
            "name": (buckets[1] * shifter).toFixed(2),
            "value": (counts[1])/total*100
          },
          {
            "name": (buckets[2] * shifter).toFixed(2),
            "value": (counts[2])/total*100
          },
          {
            "name": (buckets[3] * shifter).toFixed(2),
            "value": (counts[3])/total*100
          },
          {
            "name": (buckets[4] * shifter).toFixed(2),
            "value": (counts[4])/total*100
          },
          {
            "name": (buckets[5] * shifter).toFixed(2),
            "value": (counts[5])/total*100
          },
          {
            "name": (buckets[6] * shifter).toFixed(2),
            "value": (counts[6])/total*100
          },
          {
            "name": (buckets[7] * shifter).toFixed(2),
            "value": (counts[7])/total*100
          },
          {
            "name": (buckets[8] * shifter).toFixed(2),
            "value": (counts[8])/total*100
          },
          {
            "name": (buckets[9] * shifter).toFixed(2),
            "value": (counts[9])/total*100
          }
        ]
      }
    )
  }
}
