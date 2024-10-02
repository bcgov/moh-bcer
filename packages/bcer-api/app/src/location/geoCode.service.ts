import { Client } from '@googlemaps/google-maps-services-js';
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGeoCodeRO } from './ro/googleGeoCode.ro';
import * as HealthAuthorityJson from '../assets/BCHA_HEALTH_AUTHORITY_BNDRY_SP.json';
import geojsonUtils from 'geojson-utils';

@Injectable()
export class GeoCodeService {
  private client: Client;
  private readonly googleApiKey = process.env.GA_KEY;
  private readonly googleGeoCoderComponent =
    process.env.GOOGLE_GEO_CODER_COMPONENT || 'country:CA';

  constructor() {
    this.client = new Client({});
  }

  async getGeoCode(address: string) {
    try {
      const { data } = await this.client.geocode({
        params: {
          address,
          components: this.googleGeoCoderComponent,
          key: this.googleApiKey,
        },
      });
      if (!data?.results?.length) {
        throw 'No result was returned from Google';
      }

      const addr = data.results[0];
      return new GoogleGeoCodeRO().build(addr);
    } catch (error) {
      Logger.error(error?.message)
      throw error;
    }
  }

  /**
   * Determine if a location is within the boundary of a health authority
   * @param lat Latitude of the location
   * @param lng Longitude of the location
   * @returns Name of health authority if location is within boundary, otherwise 'Other'
   */
  async determineHealthAuthority(lat: number, lng: number) {
    const healthAuthorityData = HealthAuthorityJson as { features: Array<{ geometry: any, properties: { HLTH_AUTHORITY_NAME: string } }> };

    const ha = healthAuthorityData.features.find(f => {      
      return geojsonUtils.pointInPolygon({type: "Point", coordinates: [lng, lat]}, f.geometry);
    });

    return ha? ha.properties.HLTH_AUTHORITY_NAME : 'Other';
  }
}
