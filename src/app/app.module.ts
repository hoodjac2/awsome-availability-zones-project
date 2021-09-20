import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ListViewComponent } from './list-view/list-view.component';
import { UploadCsvComponent } from './upload-csv/upload-csv.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from  '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button'
import {MatTableModule} from '@angular/material/table'
@NgModule({
  declarations: [
    AppComponent,
    UploadCsvComponent,
    NotFoundPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'upload-csv', component: UploadCsvComponent},
      {path: 'list-view', component: ListViewComponent},
      {path: '', redirectTo: '/list-view', pathMatch: 'full'},
      {path: '**', component: NotFoundPageComponent}
    ]),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
