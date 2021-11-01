/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, AfterViewInit, Inject } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AZDataResponse, JsonObj, AZData } from "../classes-and-interfaces/az.model";
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface GraphViewData {
  dataArray: AZData[]; //data pulled from database
  AZ1: string;
  AZ2: string;
}

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
  AZ1 = 'TEST1';
  AZ2 = 'TEST2';
  mind = '0';
  maxd = '0';
  aved = '0';
  medd = '0';
  percent50 = '0';
  percent75 = '0';
  percent90 = '0';
  percent99 = '0';

  constructor(
    private dbService: HttpClientServiceComponent,
    @Inject (MAT_DIALOG_DATA) public data: GraphViewData
    ){

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
      "value": 100
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


  onClick(): void{
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


    let ave  = 0;

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
      ave += time;
      if ((time >= buckets[0]) && (time < buckets[1])){
        counts[0] += 1;
      }
      else if ((time >= buckets[1]) && (time < buckets[2])){
        counts[1] += 1;
      }
      else if ((time >= buckets[2]) && (time < buckets[3])){
        counts[2] += 1;
      }
      else if ((time >= buckets[3]) && (time < buckets[4])){
        counts[3] += 1;
      }
      else if ((time >= buckets[4]) && (time < buckets[5])){
        counts[4] += 1;
      }
      else if ((time >= buckets[5]) && (time < buckets[6])){
        counts[5] += 1;
      }
      else if ((time >= buckets[6]) && (time < buckets[7])){
        counts[6] += 1;
      }
      else if ((time >= buckets[7]) && (time < buckets[8])){
        counts[7] += 1;
      }
      else if ((time >= buckets[8]) && (time < buckets[9])){
        counts[8] += 1;
      }
      else if (time > buckets[9]) {
        counts[9] += 1;
      }
    });

    //sub9k = sub9k/total;


    // convert those tallies into percentages in Points
    // Format:
    // {
    //   "name": "name the column here"
    //   "value": the data point here
    // }
    // also format any extra statistics
    ave = ave / total;

    let medi = 0;
    if (total%2 == 0){
      medi = (sortedArray[total/2].rtt + sortedArray[(total/2) + 1].rtt)/2
    }
    else{
      medi = sortedArray[(total+1)/2].rtt
    }

    //percentile calcs:
    const p50index = Math.round((50/100)*total);
    const p75index = Math.round((75/100)*total);
    const p90index = Math.round((90/100)*total);
    const p99index = Math.round((99/100)*total);

    const shifter = Math.pow(10, -6);
    const JSONthing = [];
    for( let i = 0; i < buckets.length; i++){
      JSONthing.push({
        "name": (buckets[i] * shifter).toFixed(2),
        "value": (counts[i])/total*100
      });
    }

    Object.assign(this, {points: JSONthing});
    this.maxd = (maxi * shifter).toFixed(2);
    this.mind = (mini * shifter).toFixed(2);
    this.aved = (ave * shifter).toFixed(2);
    this.medd = (medi * shifter).toFixed(2);
    this.percent50 = (sortedArray[p50index].rtt * shifter).toFixed(2);
    this.percent75 = (sortedArray[p75index].rtt * shifter).toFixed(2);
    this.percent90 = (sortedArray[p90index].rtt * shifter).toFixed(2);
    this.percent99 = (sortedArray[p99index].rtt * shifter).toFixed(2);

  }
}
