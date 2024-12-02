import React, { useState } from 'react';
import * as yup from 'yup';
import { useAxiosGet } from './axios';
import { GeoCodeUtil } from '@/utils/geoCoder.util';

const HealthAuthorities: { [key: string]: string } = {
  fraser: 'Fraser Health',
  interior: 'Interior Health',
  island: 'Island Health',
  northern: 'Northern Health',
  coastal: 'Vancouver Coastal Health',
  other: 'Other (e.g. Out of Province)',
};

export const useCsvValidator = () => {
  const [errors, setErrors] = useState<Array<{ row: string; field: string; message: string }>>();
  const [validatedData, setValidatedData] = useState<Array<any>>();
  const [{ data: addressExistsData }, checkAddressExists] = useAxiosGet('', { manual: true });
  const [duplicateWarning, setDuplicateWarning] = useState<string>('');
  const [duplicateCount, setDuplicateCount] = useState<number>(0);

  const docheckAddressExists = async (fullAddress: string) => {
    try {
      const response = await checkAddressExists({ url: `/location/check-address-exists?address=${fullAddress}` });
      return response.data;
    } catch (error) {
      console.error('Error checking address exists:', error);
    }
  };

  const validateCSV = async (validationSchema: yup.ObjectSchema<any>, uploadData: Array<any>) => {
    let errorArray: Array<any> = [];
    let validatedDataArray: Array<any> = [];
    let duplicateWarnings = '';
    let duplicateCount = 0;
    let hasChanges = false;

    const updatedLocations = [...uploadData];

    await Promise.all(
      uploadData.map(async (element, index) => {
        element.location_type = element.location_type ? element.location_type : 'physical';
        element.error = undefined;

      if (!element.tableData) { element.tableData = { id: index };}
        try {
          const validatedDto = await validationSchema.validateSync(element, { abortEarly: false });
          // Check for errors
          if (validatedDto.addressLine1 !== '') {
            try {
              const data = await GeoCodeUtil.geoCodeAddress(validatedDto.addressLine1);
              // Features prop will only ever have length 0 or 1
              if (data.features.length === 0 || data.features[0]?.properties.precisionPoints < 70) {
                errorArray.push({
                  row: index + 2,
                  field: 'Geocoder Error',
                  message: 'We were unable to find a matching address. Please edit the location details.',
                });
                element.error = true;
              } else {
                const ha = await GeoCodeUtil.getHealthAuthority(
                  `/location/determine-health-authority?lat=${data.features[0].geometry.coordinates[1]}&long=${data.features[0].geometry.coordinates[0]}`
                );
                const formattedHealthAuthority = ha.toLowerCase();
                element.geoAddressConfidence = data.features[0].properties.precisionPoints;
                element.longitude = data.features[0].geometry.coordinates[0];
                element.latitude = data.features[0].geometry.coordinates[1];
                element.health_authority = formattedHealthAuthority;
                element.health_authority_display = HealthAuthorities[formattedHealthAuthority];
              }
            } catch (requestError) {
              console.log(requestError);
            }
          }

          //Check for duplicates (when there is no error and addressLine1 is not empty)
          if (!element.error && validatedDto.addressLine1) {
            const addressExists = await docheckAddressExists(validatedDto.addressLine1);
            if (addressExists) {
              duplicateWarnings += validatedDto.addressLine1 + '; ';
              duplicateCount++;
            }
            if (updatedLocations[index].addressExists !== addressExists) {
              updatedLocations[index] = { ...element, addressExists: addressExists };
              hasChanges = true;
            }
          }
          validatedDataArray.push(element);
        } catch (validationError) {
          //@ts-ignore
          if (Array.isArray(validationError.inner)) {
            //@ts-ignore
            validationError.inner.forEach((error: any) => {
              errorArray.push({
                row: index + 2,
                field: error.path,
                message: error.message,
              });
            });
          } else {
            console.error("Validation error does not have an 'inner' array:", validationError);
          }

          element.error = true;
          validatedDataArray.push(element);
        }
      })
    );

    setErrors(errorArray);
    setValidatedData(validatedDataArray);
    setDuplicateWarning(duplicateWarnings);
    setDuplicateCount(duplicateCount);
  }

  return {
    errors,
    validatedData,
    duplicateWarning,
    duplicateCount,
    validateCSV,
  };
};