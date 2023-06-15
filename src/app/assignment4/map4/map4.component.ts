import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map4Service } from '../service/map4.service';

@Component({
  selector: 'app-map4',
  templateUrl: './map4.component.html',
  styleUrls: ['./map4.component.css'],
})
export class Map4Component {
  @ViewChild('viewMap', { static: true }) viewMap: ElementRef;

  constructor(private map4Service: Map4Service) {}
}
