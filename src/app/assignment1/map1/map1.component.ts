import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnChanges,
} from '@angular/core';
import { Map1Service } from '../service/map1.service';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Polygon from '@arcgis/core/geometry/Polygon';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import Graphic from '@arcgis/core/Graphic';

@Component({
  selector: 'app-map1',
  templateUrl: './map1.component.html',
  styleUrls: ['./map1.component.css'],
})
export class Map1Component implements OnInit, OnChanges {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;
  featureLayer: FeatureLayer | null;
  graphic: Graphic;

  constructor(private map1Service: Map1Service) {
    this.map1Service.emitRings.subscribe((data) => {
      const polygon = new Polygon({
        rings: data?.rings,
        spatialReference: data?.spatialRef,
      });
      const symbols = new SimpleFillSymbol({
        color: 'blue',
        outline: {
          color: 'tranparent',
          width: 2,
        },
      });
      const graphic = new Graphic({
        symbol: symbols,
        geometry: polygon,
      });
      this.map1Service.mapView?.graphics.remove(this.graphic);
      this.graphic = graphic;
      this.map1Service.mapView?.graphics.add(graphic);
    });
  }

  ngOnInit(): void {
    this.map1Service.createMap(this.viewMap.nativeElement);
    const url =
      'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer';

    const layer = new MapImageLayer({
      url: url,
    });

    this.map1Service.map?.add(layer);
  }

  ngOnChanges(): void {}
}
