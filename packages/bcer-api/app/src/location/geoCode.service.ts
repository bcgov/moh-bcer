import { Client } from '@googlemaps/google-maps-services-js';
import { Injectable } from '@nestjs/common';
import { GoogleGeoCodeRO } from './ro/googleGeoCode.ro';

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
        return new GoogleGeoCodeRO();
      }

      const addr = data.results[0];
      return new GoogleGeoCodeRO().build(addr);
    } catch (error) {
      //Add log
      throw error;
    }
  }
}
