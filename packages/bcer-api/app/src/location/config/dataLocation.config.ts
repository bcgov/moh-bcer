export class LocationConfig {
  mapBoxAccessToken = process.env.MAP_BOX_ACCESS_TOKEN || '';
  mapBoxTileLayer = process.env.MAP_BOX_TILE_LAYER || '';
  mapBoxAttribution = process.env.MAP_BOX_ATTRIBUTION || '';
  mapBoxId = process.env.MAP_BOX_ID || '';
}