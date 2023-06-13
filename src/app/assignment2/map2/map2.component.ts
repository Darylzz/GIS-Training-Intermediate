import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
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
export class Map2Component implements OnInit {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;

  constructor(private map2Service: Map2Service) {}

  buffer: any;
  bufferGraphic: Graphic;
  pointBufferGraphic: Graphic;
  cityPoint: Graphic;
  citiesLayer: FeatureLayer;
  arr: Graphic[] = [];
  path: any;

  ngOnInit(): void {
    this.map2Service.createMap(this.viewMap.nativeElement);

    const url =
      'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0';

    const facilityURL =
      'https://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/ClosestFacility';

    this.citiesLayer = new FeatureLayer({
      url: url,
    });

    // this.map2Service.map.add(this.citiesLayer);

    this.map2Service.mapView.when(() => {
      this.map2Service.mapView.on('click', (event) => {
        const point = event.mapPoint;

        const circle = new SimpleFillSymbol({
          color: [0, 0, 255, 0.3],
          outline: {
            color: 'transparent',
            width: 2,
          },
        });

        const marker = new SimpleMarkerSymbol({
          color: [0, 0, 80, 0.3],
          outline: {
            color: 'transparent',
            width: 2,
          },
        });

        this.buffer = geometryEngine.geodesicBuffer(point, 20, 'kilometers');

        const newPointBufferGraphic = new Graphic({
          geometry: point,
          symbol: marker,
        });

        const newBufferGraphic = new Graphic({
          geometry: this.buffer,
          symbol: circle,
        });

        this.map2Service.mapView.graphics.removeAll();
        this.bufferGraphic = newBufferGraphic;
        this.pointBufferGraphic = newPointBufferGraphic;
        this.map2Service.mapView.graphics.addMany([
          newBufferGraphic,
          newPointBufferGraphic,
        ]);

        const query = this.citiesLayer.createQuery();
        query.geometry = this.buffer;
        query.spatialRelationship = 'intersects';
        query.returnGeometry = true;

        this.citiesLayer.queryFeatures(query).then((response) => {
          const res = response.features;
          res.map((value: any) => {
            const geometry = value.geometry;
            const cityName = value.attributes.areaname;
            const cityInBuffer = new Graphic({
              geometry: geometry,
              symbol: marker,
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
              .solve(facilityURL, closestFacilityParameters)
              .then((response: any) => {
                const res = response.routes.features[0];
                const path = res.geometry.paths;
                // console.log(path);
                const line = new SimpleLineSymbol({
                  color: [0, 0, 90],
                });
                const pathLine = new Polyline({
                  paths: path,
                });
                const pathGraphic = new Graphic({
                  geometry: pathLine,
                  symbol: line,
                });
                this.map2Service.mapView.graphics.add(pathGraphic);
              })
              .catch((error) => {
                console.log(error);
              });

            this.map2Service.mapView.graphics.add(cityInBuffer);
          });
        });
      });
    });
  }
}
