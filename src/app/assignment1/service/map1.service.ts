import { EventEmitter } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

export class Map1Service {
  map: Map | null;
  mapView: MapView;
  rings: any | null;
  spatialRef: any | null;
  emitRings = new EventEmitter<any>();

  createMap(container: any) {
    this.map = new Map({
      basemap: 'topo-vector',
    });

    this.mapView = new MapView({
      map: this.map,
      container: container,
      center: [-100.25322878, 38.714],
      zoom: 6,
    });
  }

  clickEmitGeometry() {
    this.emitRings.emit({ rings: this.rings, spatialRef: this.spatialRef });
  }
}
