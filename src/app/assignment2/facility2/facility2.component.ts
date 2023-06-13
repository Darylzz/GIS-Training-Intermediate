import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-facility2',
  templateUrl: './facility2.component.html',
  styleUrls: ['./facility2.component.css'],
})
export class Facility2Component implements OnChanges {
  @Input() cityName: any[];
  isselected: boolean = false;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.cityName);
  }

  clickCity(value: any) {
    this.isselected = value.uid;
    console.log(value);
  }
}
