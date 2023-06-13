import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Assignment1Component } from './assignment1/assignment1.component';
import { Map1Component } from './assignment1/map1/map1.component';
import { Query1Component } from './assignment1/query1/query1.component';
import { RouterModule } from '@angular/router';
import { Map1Service } from './assignment1/service/map1.service';
import { TableModule } from 'primeng/table';
import { Assignment2Component } from './assignment2/assignment2.component';
import { Map2Component } from './assignment2/map2/map2.component';
import { Facility2Component } from './assignment2/facility2/facility2.component';
import { Map2Service } from './assignment2/service/map2.service';

const routes = [
  { path: '1', component: Assignment1Component },
  { path: '2', component: Assignment2Component },
];

@NgModule({
  declarations: [
    AppComponent,
    Assignment1Component,
    Map1Component,
    Query1Component,
    Assignment2Component,
    Map2Component,
    Facility2Component,
  ],
  imports: [BrowserModule, TableModule, RouterModule.forRoot(routes)],
  providers: [Map1Service, Map2Service],
  bootstrap: [AppComponent],
})
export class AppModule {}
