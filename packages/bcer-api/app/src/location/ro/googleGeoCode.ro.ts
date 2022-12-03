import { GeocodeResult } from '@googlemaps/google-maps-services-js';

export class GoogleGeoCodeRO {
  private geoAddress: string = '';
  private geoAddressId: string = '';
  private latitude: string = '';
  private longitude: string = '';
  private geoAddressConfidence: string = '';

  addGeoAddress(formattedAddress: string) {
    this.geoAddress = formattedAddress;
    return this;
  }

  addAddressId(addressId: string) {
    this.geoAddressId = addressId;
    return this;
  }

  addLatitude(latitude: string) {
    this.latitude = latitude;
    return this;
  }

  addLongitude(longitude: string) {
    this.longitude = longitude;
    return this;
  }

  addConfidence(confidence: string) {
    this.geoAddressConfidence = confidence;
    return this;
  }

  build(result: GeocodeResult) {
    this.addGeoAddress(result.formatted_address);
    this.addAddressId(result.place_id);
    this.addLatitude(result.geometry.location.lat + '');
    this.addLongitude(result.geometry.location.lng + '');
    this.addConfidence(result.geometry.location_type);
    return this;
  }
}
