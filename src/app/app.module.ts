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
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatIconModule} from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GraphViewComponent } from './graph-view/graph-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSortModule} from '@angular/material/sort';
import { DisplayAZPairPipe } from './az-name-lookup.service/az-name-lookup.service/display-azpair.pipe';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'map-view', component: MapViewComponent},
      {path: 'list-view', component: ListViewComponent},
      {path: 'graph-view', component: GraphViewComponent},
      {path: '', redirectTo: '/map-view', pathMatch: 'full'},
      {path: '**', component: NotFoundPageComponent}
    ]),
    BrowserAnimationsModule,
    MatToolbarModule,
    HttpClientModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    HttpClientJsonpModule,
    HttpClientModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatSelectModule,
    MatTabsModule,
    MatSidenavModule,
    MatRadioModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    NgxChartsModule,
    MatSortModule
  ],
  declarations: [
    AppComponent,
    ListViewComponent,
    DisplayAZPairPipe,
    NotFoundPageComponent,
    MapViewComponent,
    GraphViewComponent,
  ],
  providers: [
    MarkerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
