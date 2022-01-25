import { ProductUtil } from '@/utils/product.util';
import React, { useState } from 'react';
import * as yup from 'yup';

export const useValidator = () => {
  const [errors, setErrors] = useState<Array<{row: string, field: string, value: string, message: string}>>()
  const [validatedData, setValidatedData] = useState<Array<any>>();
  const [erroredOnlyData, setErroredOnlyData] = useState<Array<any>>([]);

  return {
    errors,
    validatedData,
    erroredOnlyData,
    validate: (validationSchema: yup.ObjectSchema<any>, uploadData: Array<any>) => {
      let errorArray: Array<any> = [];
      let validatedDataArray: Array<any> = [];
      let erroredDataArray: Array<any> = [];
      
      uploadData.map((element, index) => {
        element.error = undefined;
        try {
          const validatedDto = validationSchema.validateSync(element, { abortEarly: false });
          validatedDataArray.push(element);
        } catch (validationError) {
          //@ts-ignore
          // needed to access validationError.inner
          validationError.inner?.map((error: any) => errorArray.push({row: index + 2, field: ProductUtil.mapFields[error.path] || error.path, value: element[error.path], message: error.message})) as any
          element.error = true;
          validatedDataArray.push(element);
          erroredDataArray.push(element);
        }
      })

      setErrors(errorArray);
      setValidatedData(validatedDataArray);
      setErroredOnlyData(erroredDataArray);
    }
  }
}