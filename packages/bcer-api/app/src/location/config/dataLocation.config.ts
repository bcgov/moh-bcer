export class LocationConfig {
  bcDirectionApiKey = process.env.BC_DIRECTION_API_KEY || '';
  mapBoxAccessToken = process.env.MAP_BOX_ACCESS_TOKEN || '';
  mapBoxTileLayer = process.env.MAP_BOX_TILE_LAYER || '';
  mapBoxAttribution = process.env.MAP_BOX_ATTRIBUTION || '';
  mapBoxId = process.env.MAP_BOX_ID || '';
}