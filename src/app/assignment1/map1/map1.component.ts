import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Map1Service } from '../service/map1.service';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';

@Component({
  selector: 'app-map1',
  templateUrl: './map1.component.html',
  styleUrls: ['./map1.component.css'],
})
export class Map1Component implements OnInit {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;

  constructor(private map1Service: Map1Service) {}

  ngOnInit(): void {
    this.map1Service.createMap(this.viewMap.nativeElement);
    const url =
      'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer';

    const layer = new MapImageLayer({
      url: url,
    });

    this.map1Service.map?.add(layer);
  }
}
