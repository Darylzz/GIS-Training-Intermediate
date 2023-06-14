import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Map2Service } from '../service/map2.service';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import * as closestFacility from '@arcgis/core/rest/closestFacility';
import ClosestFacilityParameters from '@arcgis/core/rest/support/ClosestFacilityParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import Polyline from '@arcgis/core/geometry/Polyline';

@Component({
  selector: 'app-map2',
  templateUrl: './map2.component.html',
  styleUrls: ['./map2.component.css'],
})
export class Map2Component implements OnInit, OnChanges {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;
  @Output() sendCityName = new EventEmitter<any>();
  @Input() getPathCity: any;

  constructor(private map2Service: Map2Service) {}

  buffer: any;
  bufferGraphic: Graphic;
  pointBufferGraphic: Graphic;
  cityPoint: Graphic;
  citiesLayer: FeatureLayer;
  currentPathHighLight: Graphic;

  ngOnInit(): void {
    this.map2Service.createMap(this.viewMap.nativeElement);

    this.citiesLayer = new FeatureLayer({
      url: this.map2Service.url,
    });

    // this.map2Service.map.add(this.citiesLayer);

    this.map2Service.mapView.when(() => {
      this.map2Service.mapView.on('click', (event) => {
        const point = event.mapPoint;

        this.buffer = geometryEngine.geodesicBuffer(point, 20, 'kilometers');

        const newPointBufferGraphic = new Graphic({
          geometry: point,
          symbol: this.map2Service.marker,
        });

        const newBufferGraphic = new Graphic({
          geometry: this.buffer,
          symbol: this.map2Service.circle,
        });

        this.map2Service.mapView.graphics.removeAll();
        this.bufferGraphic = newBufferGraphic;
        this.pointBufferGraphic = newPointBufferGraphic;
        this.map2Service.mapView.graphics.addMany([
          newBufferGraphic,
          newPointBufferGraphic,
        ]);
        if (this.buffer.extent) {
          this.map2Service.mapView.extent = this.buffer.extent;
        }

        const query = this.citiesLayer.createQuery();
        query.geometry = this.buffer;
        query.spatialRelationship = 'intersects';
        query.returnGeometry = true;

        this.citiesLayer.queryFeatures(query).then((response) => {
          const res = response.features;
          const arr: any = [];
          res.map((value: any, idx: number) => {
            if (idx <= 9) {
              const geometry = value.geometry;
              const cityName = value.attributes.areaname;
              const cityInBuffer = new Graphic({
                geometry: geometry,
                symbol: this.map2Service.markerCity,
                attributes: {
                  name: cityName,
                },
              });

              const closestFacilityParameters = new ClosestFacilityParameters({
                incidents: new FeatureSet({
                  features: [this.pointBufferGraphic],
                }),
                facilities: new FeatureSet({
                  features: [cityInBuffer],
                }),
                returnRoutes: true,
                defaultTargetFacilityCount: 10,
              });

              closestFacility
                .solve(this.map2Service.facilityURL, closestFacilityParameters)
                .then((response: any) => {
                  const res = response.routes.features[0];
                  const path = res.geometry.paths;
                  console.log(res);

                  arr.push(res);

                  const pathLine = new Polyline({
                    paths: path,
                  });
                  const pathGraphic = new Graphic({
                    geometry: pathLine,
                    symbol: this.map2Service.line,
                  });
                  this.map2Service.mapView.graphics.add(pathGraphic);
                })
                .catch((error) => {
                  console.log(error);
                });
              this.map2Service.mapView.graphics.add(cityInBuffer);
              this.sendCityName.emit(arr);
            }
          });
        });
      });
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    const pathLine = new Polyline({
      paths: this.getPathCity,
    });

    const pathHighLight = new Graphic({
      geometry: pathLine,
      symbol: this.map2Service.lineHighLight,
    });

    if (pathLine.extent) {
      this.map2Service.mapView.extent = pathLine.extent.expand(2);
    }

    this.map2Service.mapView?.graphics.remove(this.currentPathHighLight);
    this.currentPathHighLight = pathHighLight;
    this.map2Service.mapView?.graphics.add(pathHighLight);
  }
}
