import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

export class Map2Service {
  map: Map;
  mapView: MapView;

  createMap(container: any) {
    this.map = new Map({
      basemap: 'topo-vector',
    });

    this.mapView = new MapView({
      map: this.map,
      container: container,
      zoom: 6,
      center: [-100.25322878, 38.714],
    });
  }
}
