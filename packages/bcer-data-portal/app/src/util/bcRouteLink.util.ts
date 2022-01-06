import {
  BCGeocoderAutocompleteData,
  BusinessLocation,
  RouteOptions,
} from '@/constants/localInterfaces';

export class BcRouteLinkBuilder {
  readonly baseLink = 'https://router.api.gov.bc.ca';
  readonly directionBaseRoute = '/directions.json?';
  readonly optimalDirectionBaseRoute = '/optimalDirections.json?';

  optimalRoute = false;
  params: string = '';

  /**
   * Adds points in the query parameters
   * 
   * @param startingPoint Starting point data
   * @param locations Business Location Array
   * @returns this
   */
  addPoints(
    startingPoint: BCGeocoderAutocompleteData,
    locations: BusinessLocation[]
  ) {
    let points: any[] = [];
    const startingLatLng = startingPoint?.geometry?.coordinates ?? [];
    points =[...startingLatLng];
    points = locations.reduce(
      (prev, current) => {
        if (current.longitude && current.latitude){
          return [...prev, current.longitude, current.latitude]
        }
        return prev;
      },
      points
    );

    if (points.length) {
      this.params += `points=${points.join(',')}`;
    }
    return this;
  }

  /**
   * Adds optional query parameters
   * 
   * @param {RouteOptions} options BCDirection route options 
   * @returns this
   */
  addOptions(options: RouteOptions) {
    // setting return type for future
    this.optimalRoute = options.optimizeOrder;

    // query holds the optional query parameters
    let query = `&criteria=${options.option}`;
    query += `&correctSide=${options.turnRestriction}`;
    query += `&roundTrip=${options.roundTrip}`;

    // list of features to be enabled (turn cose, ferry schedule etc)
    let enable: string[] = [];
    let timeDependent = false;
    if (options.ferrySchedule) {
      enable.push('sc');
      timeDependent = true;
    }

    if (options.traffic) {
      enable.push('tf');
      timeDependent = true;
    }

    if (options.turnRestriction) enable.push('tr');

    if (options.events) {
      enable.push('ev');
      timeDependent = true;
    }

    if (options.crossingCost) {
      enable.push('xc');
      query += '&xingCost=3.0,10.0,7.0,1.2';
    }

    if (options.turnCost) {
      enable.push('tc');
      query += '&turnCost=3.0,1.0&';
    }

    if (timeDependent || options.timeDependent) {
      enable.push('td');
      query += `&departure=${new Date().toISOString()}`;
    }
    query += `&enable=${enable.join(',')}`;

    // adding query to the link parameter
    this.params += query;
    return this;
  }

  build() {
    if (this.optimalRoute) {
      return `${this.baseLink}${this.optimalDirectionBaseRoute}${this.params}`;
    }
    return `${this.baseLink}${this.directionBaseRoute}${this.params}`;
  }
}
