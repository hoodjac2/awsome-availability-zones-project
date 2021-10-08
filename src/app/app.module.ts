import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ListViewComponent } from './list-view/list-view.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { MapViewComponent } from './map-view/map-view.component';
import { MarkerService } from './marker.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from  '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button'
import {MatTableModule} from '@angular/material/table'
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'map-view', component: MapViewComponent},
      {path: 'list-view', component: ListViewComponent},
      {path: '', redirectTo: '/list-view', pathMatch: 'full'},
      {path: '**', component: NotFoundPageComponent}
    ]),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    HttpClientModule
  ],
  declarations: [
    AppComponent,
    ListViewComponent,
    NotFoundPageComponent,
    MapViewComponent
  ],
  providers: [
    MarkerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
