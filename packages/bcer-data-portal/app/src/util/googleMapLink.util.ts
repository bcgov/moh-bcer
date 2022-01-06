import { BCGeocoderAutocompleteData, BusinessLocation } from '@/constants/localInterfaces';

export class GoogleMapLinkBuilder {
  readonly baseLink = 'https://www.google.com/maps/dir/?api=1';
  query = ''

  addLocations(locations: BusinessLocation[]) {
    this.query += this.addDestination(locations[locations.length - 1]);
    this.query += this.addWayPoints(locations);
    return this;
  }

  addStartingPoint(sp: BCGeocoderAutocompleteData){
    if(sp?.geometry?.coordinates){
      this.query += `&origin=${sp.geometry.coordinates[1]},${sp.geometry.coordinates[0]}`
    }
    return this;
  }

  private addDestination(location: BusinessLocation) {
    const { latitude, longitude } = location;
    if (latitude && longitude) {
      return `&destination=${latitude},${longitude}`;
    }
    return '';
  }

  private addWayPoints(locations: BusinessLocation[]) {
    const waypointsArray = locations.reduce((prev, current, index) => {
      const { latitude, longitude } = current;
      if (index + 1 < locations.length && latitude && longitude) {
        return [...prev, `${latitude},${longitude}`];
      }
      return prev;
    }, []);
    return waypointsArray.length
      ? `&waypoints=${waypointsArray.join('|')}`
      : '';
  }

  build(){
    return encodeURI(`${this.baseLink}${this.query}`);
  }
}
