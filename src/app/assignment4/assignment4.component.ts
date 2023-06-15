import { Component } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';

@Component({
  selector: 'app-assignment4',
  templateUrl: './assignment4.component.html',
  styleUrls: ['./assignment4.component.css'],
})
export class Assignment4Component {
  getPointArr: Graphic[];

  updatePoint: any;

  getPointFromMap(value: Graphic[]) {
    this.getPointArr = value;
  }

  updatePointArr(value: any) {
    this.updatePoint = value;
    console.log(this.updatePoint);
  }
}
