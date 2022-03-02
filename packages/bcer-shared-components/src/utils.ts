/**
 * This Util function is used to map the keys of the targetKeys object to the values of the sourceObject, 
 * where the shared identifier is targetKeys.value === sourceObject.key.
 * Primarily used to format an object with known keys to an expected DTO keys format
 * 
 * @param targetKeys - `Enum` containing the expected output props as keys, and values matching the keys of the sourceObject 
 * @param sourceObject - `Object` containing keys matching the targetKeys Enum's values
 */
export const mapToObject = (targetKeys: Object, sourceObject: Object): any => {
  let constructedObject = {};

  for (let property in targetKeys) {
    constructedObject[property] = sourceObject[targetKeys[property]]
  }

  return constructedObject;
}

export const truncateString = (s: string, length: number) => {
  if((s || '').length > length){
    s = `${s.slice(0, length)}..`;
  }
  return s;
}