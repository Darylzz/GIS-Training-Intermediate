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
import Point from '@arcgis/core/geometry/Point';
import Graphic from '@arcgis/core/Graphic';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
@Component({
  selector: 'app-map4',
  templateUrl: './map4.component.html',
  styleUrls: ['./map4.component.css'],
})
export class Map4Component implements OnInit {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;
  @Output() sendPoint = new EventEmitter<Graphic>();
  @Input() getPointArr: Graphic[] = [];

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

        const pointStopMarker = new PictureMarkerSymbol({
          url:
            this.getPointArr.length === 0
              ? '../../../assets/pin.svg'
              : '../../../assets/pin2.svg',
        });

        const pointGraphic = new Graphic({
          geometry: pointStop,
          symbol: pointStopMarker,
        });

        this.map4Service.mapView.graphics.add(pointGraphic);
        this.sendPoint.emit(pointGraphic);
      });
    });
  }
}
