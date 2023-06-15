import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Map3Service } from '../service/map3.service';
import Sketch from '@arcgis/core/widgets/Sketch';
import GraphicLayer from '@arcgis/core/layers/GraphicsLayer';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { __values } from 'tslib';

@Component({
  selector: 'app-map3',
  templateUrl: './map3.component.html',
  styleUrls: ['./map3.component.css'],
})
export class Map3Component implements OnInit {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;
  polygonSymBol: SimpleFillSymbol = new SimpleFillSymbol({
    color: [0, 0, 255, 0.3],
    outline: {
      color: 'tranparent',
      width: 2,
    },
  });
  objectId: any;
  addFeature: Graphic;
  queryGeometry: any;
  deleteGeometry: any;
  constructor(private map3Service: Map3Service) {}

  ngOnInit(): void {
    this.map3Service.createMap(this.viewMap.nativeElement);

    const featureLayerUrl =
      'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2';

    const graphicLayer = new GraphicLayer();

    this.map3Service.mapView.when(() => {
      const sketch = new Sketch({
        view: this.map3Service.mapView,
        layer: graphicLayer,
        availableCreateTools: ['polygon'],
      });
      this.map3Service.mapView.ui.add(sketch, 'top-right');

      const featureLayer = new FeatureLayer({
        url: featureLayerUrl,
      });

      sketch.on('create', (event: any) => {
        if (event.state === 'complete') {
          const pointGraphic = event.graphic.geometry;
          const polygonGraphic = new Graphic({
            geometry: pointGraphic,
            symbol: this.polygonSymBol,
            attributes: { description: 'ING-Point', symbolid: 1 },
          });
          this.map3Service.mapView.graphics.add(polygonGraphic);
          this.addFeature = polygonGraphic;
          featureLayer
            .applyEdits({
              addFeatures: [this.addFeature],
            })
            .then((response) => {
              console.log(response);
            });
        }
      });

      sketch.on('update', (event) => {
        // console.log(event);
        if (event.state === 'start' && event.type === 'update') {
          const mapGraphic = event.graphics;
          mapGraphic.forEach((value: any) => {
            this.queryGeometry = value.geometry;
          });
          const query = featureLayer.createQuery();
          query.geometry = this.queryGeometry;
          query.spatialRelationship = 'intersects';
          query.returnGeometry = true;
          featureLayer.queryFeatures(query).then((response) => {
            const feature = response.features;
            feature.map((value: any) => {
              this.objectId = value.attributes.objectid;
            });
            // console.log(this.objectId);
          });
        }
        if (event.state === 'complete' && event.type === 'update') {
          const newPointPolygon = event.graphics[0].geometry;
          const newPolygonGraphic = new Graphic({
            geometry: newPointPolygon,
            symbol: this.polygonSymBol,
            attributes: { description: 'ING-Point', objectid: this.objectId },
          });
          this.map3Service.mapView.graphics.remove(this.addFeature);
          this.addFeature = newPolygonGraphic;
          this.map3Service.mapView.graphics.add(newPolygonGraphic);
          featureLayer.applyEdits({
            updateFeatures: [newPolygonGraphic],
          });
        }
      });

      sketch.on('delete', (event) => {
        if (event.type === 'delete') {
          const geometry = event.graphics;
          geometry.forEach((value) => {
            this.deleteGeometry = value.geometry;
          });
          const deletePointPolygon = this.deleteGeometry;
          const deletePolygonGraphic = new Graphic({
            geometry: deletePointPolygon,
            attributes: { objectid: this.objectId },
          });
          this.map3Service.mapView.graphics.remove(this.addFeature);
          featureLayer.applyEdits({
            deleteFeatures: [deletePolygonGraphic],
          });
        }
      });
    });
  }
}
