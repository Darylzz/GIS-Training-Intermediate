import { Component } from '@angular/core';

@Component({
  selector: 'app-assignment1',
  templateUrl: './assignment1.component.html',
  styleUrls: ['./assignment1.component.css'],
})
export class Assignment1Component {
  layerInfo: any[] = [];

  getLayer(info: any) {
    this.layerInfo = info;
  }
}
