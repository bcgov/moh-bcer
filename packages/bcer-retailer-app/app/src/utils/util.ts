import { DateFormat } from '@/constants/localEnums';
import moment from 'moment';

export class GeneralUtil {
  static getFormattedDate(
    date: string | Date,
    format?: DateFormat,
    utc: boolean = false
  ): string {
    !format ? (format = DateFormat.MMM_DD_YYYY) : null;
    return date ? moment(date).utc(utc).format(format) : '';
  }

  static upperCaseFirstLetter(str: string): string {
    return str ? str[0].toUpperCase() + str.slice(1) : '';
  }

  static keepOnlyDigits = (s: string) => s.replace(/\D/g, '');

  static formatPhoneNumber(input: string): string {
    input = this.keepOnlyDigits(input);
    let size = input.length;
    if (size > 0) {
      input = '(' + input;
    }
    if (size > 3) {
      input = input.slice(0, 4) + ') ' + input.slice(4, 11);
    }
    if (size > 6) {
      input = input.slice(0, 9) + '-' + input.slice(9);
    }
    return input;
  }

  static formatPhoneNumberForApi(input: string): string {
    input = this.keepOnlyDigits(input);
    return input ? `+1${input}` : input;
  }
}
