import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Map4Service } from '../service/map4.service';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';

@Component({
  selector: 'app-map4',
  templateUrl: './map4.component.html',
  styleUrls: ['./map4.component.css'],
})
export class Map4Component implements OnInit {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;
  @Output() sendPoint = new EventEmitter<Graphic[]>();
  @Input() updatePointArr: any;
  pointStopMarker = new SimpleMarkerSymbol({
    color: [0, 0, 255, 0.3],
    outline: {
      color: 'tranparent',
      width: 2,
    },
  });

  arrPointStop: Graphic[] = [];

  constructor(private map4Service: Map4Service) {}

  ngOnInit(): void {
    this.map4Service.createMap(this.viewMap.nativeElement);

    this.map4Service.mapView.when(() => {
      this.map4Service.mapView.on('click', (event) => {
        const mapPoint = event.mapPoint;
        const pointStop = new Point({
          latitude: mapPoint.latitude,
          longitude: mapPoint.longitude,
        });

        const pointGraphic = new Graphic({
          geometry: pointStop,
          symbol: this.pointStopMarker,
        });

        this.map4Service.mapView.graphics.add(pointGraphic);
        this.arrPointStop.push(pointGraphic);
        this.sendPoint.emit(this.arrPointStop);
      });
    });
  }
}
