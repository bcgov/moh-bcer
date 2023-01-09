import { LocationClosingWindow } from '@/constants/localEnums';
import moment from 'moment';

export class LocationUtil {
    /**
   * function to calculate the location closing window for the current year
   * use case example:
   * Current date = October 2nd, 2021. Component should allow me to choose date between Oct 1st, 2021 and Sept 30, 2022
   * Current date = August 25th, 2022. Component should allow me to choose date between Oct 1st, 2021 and Sept 30, 2022
   * @returns {min: least date when location can be closed, max: max date when location can be closed}
   */

  static getLocationCloseWindow(): {max: Date, min: Date} {
    let minYear = new Date().getFullYear();
    if(new Date().getMonth() < 8){
      minYear -= 1;
    }
    return ({
      max: moment(`${minYear+1}-${LocationClosingWindow.Max}`, 'YYYY-MM-DD').toDate(),
      min: moment(`${minYear}-${LocationClosingWindow.Min}`, 'YYYY-MM-DD').toDate(),
    })
  }
}