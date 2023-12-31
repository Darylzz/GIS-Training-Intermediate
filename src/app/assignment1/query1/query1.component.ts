import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

@Component({
  selector: 'app-query1',
  templateUrl: './query1.component.html',
  styleUrls: ['./query1.component.css'],
})
export class Query1Component implements OnInit {
  @Output() sendGeometry = new EventEmitter<any>();
  infos: any[] = [];
  featureLayer: FeatureLayer | null;
  selectedId: any;

  constructor() {}
  ngOnInit(): void {
    const urlLayer =
      'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2';
    this.featureLayer = new FeatureLayer({
      url: urlLayer,
    });

    const query = this.featureLayer.createQuery();
    query.where = '1=1';
    query.outFields = ['*'];
    query.returnGeometry = true;

    this.featureLayer.queryFeatures(query).then((response) => {
      const res = response.features;
      console.log(res);

      this.infos.push(res);
    });
  }

  clickGetId(id: any) {
    // console.log(id);
    this.selectedId = id.uid;
    const rings = id.geometry.rings;
    const spatialRef = id.geometry.spatialReference;
    this.sendGeometry.emit({ rings, spatialRef });
    // console.log(this.map1Service.rings, this.map1Service.spatialRef);
  }
}
