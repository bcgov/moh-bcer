export const getDurationInMilliseconds = (start: [number, number]): string => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return ((diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS).toLocaleString();
};

/**
 * Converting null, undefined value to "", used in csv
 * @param str 
 * @returns 
 */
export const convertNullToEmptyString = (str: string | null) => str == null ? '' : str;

export class GeneralUtil {
  static getRawPhoneNumber(phoneNumber: string){
    let rawPhoneNumber = phoneNumber ? phoneNumber.replace(/\D+/g, '') : '';
    return rawPhoneNumber.substring(rawPhoneNumber.length - 10);
  }
}