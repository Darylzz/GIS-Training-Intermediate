import { Component, DoCheck } from '@angular/core';
import { Query1Service } from '../service/query1.service';

@Component({
  selector: 'app-query1',
  templateUrl: './query1.component.html',
  styleUrls: ['./query1.component.css'],
})
export class Query1Component implements DoCheck {
  infos: any[] = [];

  constructor(private query1Service: Query1Service) {
    this.infos = this.query1Service.layerInfo;
  }
  ngDoCheck() {
    // console.log(this.infos);
  }
}
