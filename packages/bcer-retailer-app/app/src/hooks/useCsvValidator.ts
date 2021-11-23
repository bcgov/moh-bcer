import React, { useState } from 'react';
import * as yup from 'yup';

export const useCsvValidator = () => {
  const [errors, setErrors] = useState<Array<{row: string, field: string, message: string}>>()
  const [validatedData, setValidatedData] = useState<Array<any>>()

  return {
    errors,
    validatedData,
    validateCSV: (validationSchema: yup.ObjectSchema<any>, uploadData: Array<any>) => {
      let errorArray: Array<any> = [];
      let validatedDataArray: Array<any> = [];

      uploadData.map((element, index) => {
        element.error = undefined;
        try {
          const validatedDto = validationSchema.validateSync(element, { abortEarly: false });
          validatedDataArray.push(validatedDto);
        } catch (validationError) {
          //@ts-ignore
          // needed to access validationError.inner
          validationError.inner.map((error: any) => errorArray.push({row: index + 2, field: error.path, message: error.message})) as any
          element.error = true;
          validatedDataArray.push(element)
        }
      })

      setErrors(errorArray)
      setValidatedData(validatedDataArray)
    }
  }
}