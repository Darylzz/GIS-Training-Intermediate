import { Component } from '@angular/core';

@Component({
  selector: 'app-assignment1',
  templateUrl: './assignment1.component.html',
  styleUrls: ['./assignment1.component.css'],
})
export class Assignment1Component {
  geometry: {
    rings: number[][][] | undefined;
    spatialRef: any | undefined;
  };

  getData(event: any) {
    this.geometry = event;
    // console.log(this.geometry);
  }
}
