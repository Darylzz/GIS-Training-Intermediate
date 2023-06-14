import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';

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
  url =
    'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0';

  facilityURL =
    'https://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/ClosestFacility';

  marker = new SimpleMarkerSymbol({
    color: 'blue',
    outline: {
      color: 'tranparent',
      width: 2,
    },
  });

  circle = new SimpleFillSymbol({
    color: [0, 0, 255, 0.3],
    outline: {
      color: 'tranparent',
      width: 2,
    },
  });

  markerCity = new SimpleMarkerSymbol({
    style: 'square',
    color: 'purple',
    outline: {
      color: 'tranparent',
      width: 2,
    },
  });

  line = new SimpleLineSymbol({
    color: [0, 0, 90],
  });

  lineHighLight = new SimpleLineSymbol({
    color: 'red',
  });
}
