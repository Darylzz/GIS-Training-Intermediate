import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

export class Map1Service {
  map: Map | null;
  mapView: MapView | null;

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
}
