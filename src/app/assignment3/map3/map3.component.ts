import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Map3Service } from '../service/map3.service';
import Sketch from '@arcgis/core/widgets/Sketch';
import GraphicLayer from '@arcgis/core/layers/GraphicsLayer';
import Polygon from '@arcgis/core/geometry/Polygon';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';

@Component({
  selector: 'app-map3',
  templateUrl: './map3.component.html',
  styleUrls: ['./map3.component.css'],
})
export class Map3Component implements OnInit {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;
  currentPolygon: Graphic;
  objectId: any
  deleteFeature: any;
  polygonSymBol: SimpleFillSymbol = new SimpleFillSymbol({
    color: [0, 0, 255, 0.3],
    outline: {
      color: 'tranparent',
      width: 2,
    },
  });
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
        creationMode: 'update',
      });
      this.map3Service.mapView.ui.add(sketch, 'top-right');

      const featureLayer = new FeatureLayer({
        url: featureLayerUrl,
      });

      sketch.on('create', (event: any) => {
        if (event.state === 'complete') {
          const geometry = event.graphic.geometry;
          const polygon = new Polygon({
            rings: geometry.rings,
            spatialReference: geometry.spatialReference,
          });

          const addFeaturePolygon = new Graphic({
            geometry: polygon,
            symbol: this.polygonSymBol,
            attributes: { description: 'ING-Point', symbolid: 0 },
          });
          
          this.map3Service.mapView.graphics.add(addFeaturePolygon);
          featureLayer
            .applyEdits({
              addFeatures: [addFeaturePolygon],
            })
            .then((response) => {
              console.log(response);
              
            });
          this.currentPolygon = addFeaturePolygon;
        }
      });

      sketch.on('update', (event: any) => {
        console.log(event);
        if(event.state === 'start') {
          const query = featureLayer.createQuery()
          query.geometry = event.graphics[0].geometry
          query.spatialRelationship = 'intersects'
          featureLayer.queryFeatures(query).then((response) => {
            console.log(response);
          })
        }
      });
    });
  }
}
