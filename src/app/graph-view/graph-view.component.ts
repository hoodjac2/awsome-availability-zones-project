/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MOCK_DATA } from '../classes-and-interfaces/temp-mock-data';

/**
 * Graph view created by Wynton using ngx-charts by Swimlane
 * Documentation can be found here: https://swimlane.gitbook.io/ngx-charts/examples/line-area-charts/line-chart
 */

@Component({
  selector: 'graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent {
  // buncha testing data
  points = [
    {
      "name": "US-East-1a",
      series: [
        {
          "name": "10/6/21",
          "value": 406,
        },
        {
          "name": "10/7/21",
          "value": 500,
        },
        {
          "name": "10/8/21",
          "value": 300,
        },
        {
          "name": "10/9/21",
          "value": 400,
        },
        {
          "name": "10/10/21",
          "value": 350,
        },
        {
          "name": "10/11/21",
          "value": 150,
        },
        {
          "name": "10/12/21",
          "value": 233,
        },
      ]
    },
  ]

  // options/settings
  // there's no title setting on this so we gotta DIY
  legend = true;
  legendTitle = "Availability Zones"
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  yAxisLabel = 'Latency (ms)';
  timeline = true;

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
}
