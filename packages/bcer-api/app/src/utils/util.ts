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

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Performs difference operation between two provided array (ignoring repeated elements)
 * @param arr1 `Array<string | number>` Base array
 * @param arr2 `Array<string | number>` Array to be subtracted 
 * @returns `Set(arr1 - arr2)`
 */
export const arrayDifference = (arr1: Array<string | number>, arr2: Array<string | number>) => {
  let set1 = new Set(arr1);
  let set2 = new Set(arr2);

  let difference: Set<any> = new Set();
   
  for (let elem of set1) {
    if (!set2.has(elem)) {
        difference.add(elem);
    }
  }
    
  return [...difference];
}