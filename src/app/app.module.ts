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
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import { MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card';
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'map-view', component: MapViewComponent},
      {path: 'list-view', component: ListViewComponent},
      {path: '', redirectTo: '/map-view', pathMatch: 'full'},
      {path: '**', component: NotFoundPageComponent}
    ]),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    HttpClientModule,
    MatSidenavModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule
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
