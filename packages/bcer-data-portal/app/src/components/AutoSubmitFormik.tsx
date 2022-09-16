import React, { useEffect } from 'react';

interface AutoSubmitFormikProps {
  values: any;
  submitForm: (() => Promise<void>) & (() => Promise<any>);
}
/**
 * Automatically Submits Formik forms on change
 * @param {Object} param0 contains formik values and submitForm 
 * @param {Object} param0.values contains the values from a formik form
 * @param {Function} param0.submitForm formik submitForm method
 * @returns a React Node
 */
function AutoSubmitFormik({ values, submitForm }: AutoSubmitFormikProps) {
  useEffect(() => {
    submitForm();
  }, [values]);
  return <></>;
}

export default AutoSubmitFormik;
