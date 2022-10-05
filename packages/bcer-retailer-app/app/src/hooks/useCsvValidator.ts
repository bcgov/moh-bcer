import React, { useState } from 'react';
import * as yup from 'yup';
import { useAxiosGet } from './axios';
import Axios  from 'axios'
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
  const [errors, setErrors] = useState<Array<{row: string, field: string, message: string}>>()
  const [validatedData, setValidatedData] = useState<Array<any>>();

  return {
    errors,
    validatedData,
    validateCSV: async(validationSchema: yup.ObjectSchema<any>, uploadData: Array<any>) => {
      let errorArray: Array<any> = [];
      let validatedDataArray: Array<any> = [];
      
      await Promise.all(uploadData.map(async(element, index) => {        
          element.location_type = element.location_type ? element.location_type : 'physical';
          element.error = undefined;
          try {
              const validatedDto = await validationSchema.validateSync(element, { abortEarly: false });
              
              if (validatedDto.addressLine1 !== "") {
                try {                  
                  const data = await GeoCodeUtil.geoCodeAddress(validatedDto.addressLine1);

                  // Features prop will only ever have length 0 or 1

                  if (data.features.length === 0 || data.features[0]?.properties.precisionPoints < 70) {
                    errorArray.push({row: index + 2, field: 'Geocoder Error', message: 'We were unable to find a matching address. Please edit the location details.'})
                    element.error = true;
                  } else {
                    const ha = await GeoCodeUtil.getHealthAuthority(`/location/determine-health-authority?lat=${data.features[0].geometry.coordinates[1]}&long=${data.features[0].geometry.coordinates[0]}`)
                    const formattedHealthAuthority = ha.toLowerCase()
                    // Set the element's confidence interval, latitude, longitude, health authority, and props from the retured geocoder data
                    element.geoAddressConfidence = data.features[0].properties.precisionPoints
                    element.longitude = data.features[0].geometry.coordinates[0]
                    element.latitude = data.features[0].geometry.coordinates[1]
                    element.health_authority = formattedHealthAuthority
                    element.health_authority_display = HealthAuthorities[formattedHealthAuthority]
                  }
                } catch (requestError) {
                  console.log(requestError)
                }
              }   
            validatedDataArray.push(element);
          } catch (validationError) {
            console.log(validationError)
            //@ts-ignore
            // needed to access validationError.inner
            validationError.inner.map((error: any) => errorArray.push({row: index + 2, field: error.path, message: error.message})) as any
            element.error = true;
            validatedDataArray.push(element)
          }        
      }))

      setErrors(errorArray)
      setValidatedData(validatedDataArray)
    }
  }
}