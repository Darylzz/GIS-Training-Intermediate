import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';

export class Map5Service {
  map: Map;
  mapView: MapView;
  censusUrl =
    'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer';
  OceanBaseUrl =
    'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer';

  mapImgaeLayer: MapImageLayer;
  tileLayer: TileLayer;

  createMap(container: any) {
    this.map = new Map({
      basemap: 'topo-vector',
    });

    this.mapView = new MapView({
      map: this.map,
      container: container,
      zoom: 6,
      center: [-108.127, 41.7601],
    });
    this.mapImgaeLayer = new MapImageLayer({
      url: this.censusUrl,
    });
    this.tileLayer = new TileLayer({
      url: this.OceanBaseUrl,
    });
  }
}
