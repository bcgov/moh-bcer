import { DateFormat } from '@/constants/localEnums';
import moment from 'moment';

export class GeneralUtil {
  static getFormattedDate(date: string | Date, format?: DateFormat, utc: boolean = false): string {
    !format ? (format = DateFormat.MMM_DD_YYYY) : null;
    return moment(date).utc(utc).format(format);
  }

  static upperCaseFirstLetter(str: string): string {
    return str ? str[0].toUpperCase() + str.slice(1) : '';
  }
}
