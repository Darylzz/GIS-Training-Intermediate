import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import TileLayer from '@arcgis/core/layers/TileLayer';
export class Map6Service {
  map: Map;
  mapView: MapView;
  worldTileLayer: TileLayer;
  oceanTileLayer: TileLayer;

  worldStreetUrl =
    'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer';
  oceanBaseUrl =
    'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer';

  createMap(container: any) {
    this.map = new Map({
      basemap: 'topo-vector',
    });

    this.mapView = new MapView({
      map: this.map,
      container: container,
      center: [-108.127, 41.7601],
      zoom: 6,
    });
    this.worldTileLayer = new TileLayer({
      url: this.worldStreetUrl,
    });
    this.oceanTileLayer = new TileLayer({
      url: this.oceanBaseUrl,
    });
  }
}
