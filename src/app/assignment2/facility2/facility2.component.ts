import {
  Component,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-facility2',
  templateUrl: './facility2.component.html',
  styleUrls: ['./facility2.component.css'],
})
export class Facility2Component implements OnChanges {
  @Input() cityName: any;
  @Output() sendPathCity = new EventEmitter<any>();

  arrCityName: any[] = [];
  isselected: any;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.arrCityName = this.cityName;
  }

  clickCity(value: any) {
    this.isselected = value.uid;
    // console.log(value);
    const path = value.geometry.paths;
    this.sendPathCity.emit(path);
  }
}
