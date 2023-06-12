import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnChanges,
  Input,
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
  @Input() getGeometry: {
    rings: number[][][] | undefined;
    spatialRef: any | undefined;
  };
  featureLayer: FeatureLayer | null;
  graphic: Graphic;

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

  ngOnChanges(): void {
    const polygon = new Polygon({
      rings: this.getGeometry?.rings,
      spatialReference: this.getGeometry?.spatialRef,
    });
    const symbols = new SimpleFillSymbol({
      color: [0, 0, 255, 0.3],
      outline: {
        color: 'tranparent',
        width: 2,
      },
    });
    const graphic = new Graphic({
      symbol: symbols,
      geometry: polygon,
    });
    this.map1Service.mapView!.extent = polygon.extent.expand(2);
    this.map1Service.mapView?.graphics.remove(this.graphic);
    this.graphic = graphic;
    this.map1Service.mapView?.graphics.add(graphic);
  }
}
