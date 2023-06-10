import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Map1Service } from '../service/map1.service';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { Query1Service } from '../service/query1.service';

@Component({
  selector: 'app-map1',
  templateUrl: './map1.component.html',
  styleUrls: ['./map1.component.css'],
})
export class Map1Component implements OnInit {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;
  featureLayer: FeatureLayer | null;

  constructor(
    private map1Service: Map1Service,
    private query1Service: Query1Service
  ) {}

  ngOnInit(): void {
    this.map1Service.createMap(this.viewMap.nativeElement);
    const url =
      'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer';

    const layer = new MapImageLayer({
      url: url,
    });

    this.map1Service.map?.add(layer);

    const urlLayer =
      'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2 ';
    this.featureLayer = new FeatureLayer({
      url: urlLayer,
    });

    const query = this.featureLayer.createQuery();
    query.where = '1=1';
    query.outFields = ['*'];
    query.returnGeometry = true;

    this.featureLayer.queryFeatures(query).then((response) => {
      const res = response.features;
      // console.log(res);
      this.query1Service.layerInfo.push(res);
      console.log(this.query1Service.layerInfo);
    });
  }
}
