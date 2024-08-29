import React from 'react';
import { StyledSelectField } from '@/index';
import { Formik, Form } from 'formik';

export default { title: 'Mui Styled Select Field' }

export const SelectInput = () => {
  return (
  <Formik
    initialValues={{test: 'test'}}
    onSubmit={() => (console.log('Test submit'))}
  >
    <Form>
      <StyledSelectField
        fullWidth={true}
        isDisabled={false}
        options={[
          { value: 'Select A', label: 'Select A'},
          { value: 'Select B', label: 'Select B'}
        ]}
        name="test" 
        label="A Label"
      />
    </Form>
  </Formik>
  )
}