import React, { useState } from 'react';
import * as yup from 'yup';
import { useAxiosGet } from './axios';
import Axios  from 'axios'

export const useCsvValidator = () => {
  const [errors, setErrors] = useState<Array<{row: string, field: string, message: string}>>()
  const [validatedData, setValidatedData] = useState<Array<any>>()
  const [{ data, error, loading }, getSuggestions] = useAxiosGet('', { manual: true })

  return {
    errors,
    validatedData,
    validateCSV: async(validationSchema: yup.ObjectSchema<any>, uploadData: Array<any>) => {
      let errorArray: Array<any> = [];
      let validatedDataArray: Array<any> = [];
      
      await Promise.all(uploadData.map(async(element, index) => {

        element.error = undefined;
        try {
          const validatedDto = await validationSchema.validateSync(element, { abortEarly: false });

          try {
            const {data} = await Axios.get(`https://geocoder.api.gov.bc.ca/addresses.json?minScore=70&maxResults=1&echo=false&autoComplete=false&brief=false&matchPrecision=occupant,unit,site,civic_number,block&addressString=${validatedDto.addressLine1}`)
            // Features prop will only ever have length 0 or 1

            if (data.features.length === 0 || data.features[0]?.properties.precisionPoints < 70) {
              errorArray.push({row: index + 2, field: 'Geocoder Error', message: 'We were unable to find a matching address. Please edit the location details.'})
              element.error = true;
            } else {
              // Set the element's confidence interval, latitude, and longitude props from the retured geocoder data
              element.geoAddressConfidence = data.features[0].properties.precisionPoints
              element.longitude = data.features[0].geometry.coordinates[0]
              element.latitude = data.features[0].geometry.coordinates[1]
            }
          } catch (requestError) {
            console.log(requestError)
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