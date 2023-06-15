import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as route from '@arcgis/core/rest/route';
import RouteParameters from '@arcgis/core/rest/support/RouteParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import { Map4Service } from '../service/map4.service';
import Graphic from '@arcgis/core/Graphic';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';

@Component({
  selector: 'app-route4',
  templateUrl: './route4.component.html',
  styleUrls: ['./route4.component.css'],
})
export class Route4Component implements OnChanges {
  @Input() getPointArr: Graphic[];
  @Output() updateArrPoint = new EventEmitter<any>();
  routeUrl =
    'https://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/Route';

  lineSymbol = new SimpleLineSymbol({
    color: [0, 0, 80, 0.8],
    style: 'dash',
  });
  currentDirectionPath: Graphic;
  directions: any[] = [];
  isSelected: any;
  constructor(private map4Service: Map4Service) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.getPointArr);
  }

  clickToRoute() {
    const routeParam: any = new RouteParameters({
      stops: new FeatureSet({
        features: this.getPointArr,
      }),
      returnDirections: true,
    });
    route
      .solve(this.routeUrl, routeParam)
      .then((response) => {
        const routeResult = response.routeResults[0];
        this.directions = routeResult.directions.features;
        console.log(this.directions);

        const geometry: any = routeResult.route.geometry;

        const pathLine = new Graphic({
          geometry: geometry,
          symbol: this.lineSymbol,
        });
        this.map4Service.mapView.graphics.add(pathLine);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  clickClearRoute() {
    this.map4Service.mapView.graphics.removeAll();
    this.getPointArr = [];
    this.directions = [];
    this.updateArrPoint.emit(this.getPointArr);
  }

  clickDirection(value: any) {
    this.isSelected = value.uid;
    console.log(value);
    const geometry = value.geometry;

    const directionSymbol = new SimpleLineSymbol({
      color: 'red',
      style: 'solid',
    });

    const directionPath = new Graphic({
      geometry: geometry,
      symbol: directionSymbol,
    });
    this.map4Service.mapView.graphics.remove(this.currentDirectionPath);
    this.currentDirectionPath = directionPath;
    this.map4Service.mapView.graphics.add(directionPath);

    this.map4Service.mapView.extent = geometry.extent.expand(2);
  }
}
