/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Inject } from "@angular/core";
import { AZData } from "../classes-and-interfaces/az.model";
import { HttpClientServiceComponent } from "../http-client.service/http-client.service.component";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface GraphViewData {
  dataArray: { name: string; value: number; }[]; //data pulled from database
  AZ1: string;
  AZ2: string;
  mind : '0';
  maxd : '0';
  aved : '0';
  medd : '0';
  percent50 : '0';
  percent75 : '0';
  percent90 : '0';
  percent99 : '0';
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
export class GraphViewComponent{

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

  // on creation, pull in injected data of graph data
  ngOnInit(): void{
    this.AZ1 = this.data.AZ1;
    this.AZ2 = this.data.AZ2;
    Object.assign(this, {points: this.data.dataArray});
    this.mind = this.data.mind;
    this.maxd = this.data.maxd;
    this.aved = this.data.aved;
    this.medd = this.data.medd;
    this.percent50 = this.data.percent50;
    this.percent75 = this.data.percent75;
    this.percent90 = this.data.percent90;
    this.percent99 = this.data.percent99;
  }

  // Example data entry and variable where graph data goes
  points = [
    {
      "name": " ",
      "value": 100
    }
  ]


  // options/settings for the graph
  // there's no title setting on this so we gotta DIY
  view: [number, number] = [700, 580]
  legend = false;
  legendTitle = "Legend"
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = '';
  yAxisLabel = 'Frequency (%)';
  yScaleMax = 100;
  rotateXAxis = true;

  onClick(): void{

  }


}
