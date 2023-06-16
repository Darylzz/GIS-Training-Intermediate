import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Map6Service } from '../service/map6.service';
import Swipe from '@arcgis/core/widgets/Swipe.js';

@Component({
  selector: 'app-map6',
  templateUrl: './map6.component.html',
  styleUrls: ['./map6.component.css'],
})
export class Map6Component implements OnInit {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;
  swipeMap: Swipe;

  constructor(private map6Service: Map6Service) {}

  ngOnInit(): void {
    this.map6Service.createMap(this.viewMap.nativeElement);

    this.map6Service.map.addMany([
      this.map6Service.oceanTileLayer,
      this.map6Service.worldTileLayer,
    ]);

    this.swipeMap = new Swipe({
      view: this.map6Service.mapView,
      leadingLayers: [this.map6Service.worldTileLayer],
      trailingLayers: [this.map6Service.oceanTileLayer],
      direction: 'horizontal',
      position: 50,
    });

    this.map6Service.mapView.ui.add(this.swipeMap);
  }
}
