import Axios from 'axios';
import store from 'store';

export class GeoCodeUtil {
  private static readonly baseUrl = `https://geocoder.api.gov.bc.ca/addresses.json`;

  /**
   * Gets the geocoded data for a given address
   * @param {string} address Address of a location 
   * @returns Geocoded address data from BC geocoder
   */
  static async geoCodeAddress(address: string) {
    const { data } = await Axios.get(this.getGeoCodeUrl(address));
    return data;
  }

  /**
   * Gets Geocoded location suggestion for a given address
   * @param {string} address Address of a location 
   * @returns AutoComplete address data from BC geocoder
   */
  static async autoCompleteAddress(address: string) {
    const { data } = await Axios.get(this.getAutoCompleteUrl(address));
    return data;
  }

  /**
   * Gets the Health Authority of a given lat lng pair
   * @param {string}  request string containing the request URL with lat lng coordinates of a location
   * @returns {string} the string representation of the health authority name 
   */
  static async getHealthAuthority(request: string) {
    const {data} = await Axios.get(request, {headers: {'Authorization': `Bearer ${store.get('TOKEN')}`}})
    return data;

  }

  /**
   * Checks if a address is valid.
   * 
   * @param address Address of a location
   * @returns {boolean} true/false based on api data
   */
  static async isValidAddress(address: string) {
    if (!address){
      return false;
    }
    try{
      const data = await this.geoCodeAddress(address);
      // Features prop will only ever have length 0 or 1
      if (data.features.length === 0 || data.features[0]?.properties.precisionPoints < 70) {
        return false;
      }
      return true;
    }catch(e){
      return false;
    }
  }

  /**
   * Gets the url to get autocomplete address data from api
   * 
   * @param {string} address Address of a location to be geoCoded 
   * @param {number} [minScore=70] acceptable minimum confidence of a address match
   * @param {number} [maxResults=1] maximum number of results the api will send back  
   * @returns {string} complete url to autocomplete an address
   */
  static getAutoCompleteUrl(
    address: string,
    minScore: number = 50,
    maxResults: number = 5,
  ) {
    return `${this.baseUrl}${this.makeQueryParams(address, minScore, maxResults, true)}`;
  }

  /**
   * Gets the url to get geo coded data from api
   * 
   * @param {string} address Address of a location to be geoCoded 
   * @param {number} [minScore=70] acceptable minimum confidence of a address match
   * @param {number} [maxResults=1] maximum number of results the api will send back  
   * @returns {string} complete url to get geocode data from api
   */
  static getGeoCodeUrl(
    address: string,
    minScore: number = 70,
    maxResults: number = 1,
  ) {
    return `${this.baseUrl}${this.makeQueryParams(address, minScore, maxResults, false)}`;
  }

  /**
   * Makes Query parameter based on given data
   * 
   * @param {string} address Address of a location to be geoCoded 
   * @param {number} minScore acceptable minimum confidence of a address match
   * @param {number} maxResults maximum number of results the api will send back 
   * @param {boolean} autoComplete use Autocomplete api 
   * @returns {string} URL Query parameters to get geocoded data from api
   */
  private static makeQueryParams(
    address: string,
    minScore: number,
    maxResults: number,
    autoComplete: boolean,
  ) {
    return `?minScore=${minScore}&maxResults=${maxResults}&echo=false&autoComplete=${autoComplete}&brief=false&matchPrecision=occupant,unit,site,civic_number,block&addressString=${address}`;
  }
}
