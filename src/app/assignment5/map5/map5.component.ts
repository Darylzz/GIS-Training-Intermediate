import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Map5Service } from '../service/map5.service';
import LayerList from '@arcgis/core/widgets/LayerList';

@Component({
  selector: 'app-map5',
  templateUrl: './map5.component.html',
  styleUrls: ['./map5.component.css'],
})
export class Map5Component implements OnInit {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;

  layerList: LayerList;

  constructor(private map5Service: Map5Service) {}

  ngOnInit(): void {
    this.map5Service.createMap(this.viewMap.nativeElement);

    this.map5Service.mapView.when(() => {
      this.layerList = new LayerList({
        view: this.map5Service.mapView,
      });

      this.map5Service.map.addMany([
        this.map5Service.mapImgaeLayer,
        this.map5Service.tileLayer,
      ]);
      this.map5Service.mapView.ui.add(this.layerList, 'top-right');
    });
  }
}
