import React, { useEffect } from 'react';

interface AutoSubmitFormikProps {
  values: any;
  submitForm: (() => Promise<void>) & (() => Promise<any>);
}
/**
 * Automatically Submits Formik forms on change
 * @param param0 
 * @returns 
 */
function AutoSubmitFormik({ values, submitForm }: AutoSubmitFormikProps) {
  useEffect(() => {
    submitForm();
  }, [values]);
  return <></>;
}

export default AutoSubmitFormik;
