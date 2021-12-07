# CapstoneTest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

--- ABOVE IS AUTO GENERATED ------
Welcome to the AWSome Availibility Zones project!


This was a project for a university course at Michigan State University. 

This project was done by five Michigan State University students in the fall of 2021. The purpose of this front end is to display latency data between regions by using Leaflet and OpenStreetMap and AngularMaterials. To get this project to work correctly, please follow the instructions for the back-end to setup the data collection algorithms before using this front end. In the AWS console, a API will need to be created to retrieve data from a DynamoDB. As long as the api address is up and running the front end should function as intended.


The map-view.ts is the main file for this webapp. It is designed to be almost a one page application. The data flow is as follows: data is brought in on load from an API Gateway setup on AWS services. The data then is stored in a local DB dictionary with the keys being az-to-az strings. For example, "use1-az1,use1-az2" is the key for the local DB dictionary that will return the latency test that starts at use1-az1 and travels to use1-az2 and then returns to az1.

 The map view shows the average between the test from az1-az2 and az2-az1, while the list-view only shows the raw data. 

This front end utilizes:
- OpenStreetMap
- Leaflet
- Angular Materials 
- Ngx-Charts
