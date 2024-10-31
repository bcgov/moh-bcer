import React from 'react';
import { StyledTextField } from '@/index';
import { Formik, Form } from 'formik';

export default { title: 'Mui Styled Text Field' }

export const TextInput = () => {
  return (
  <Formik
    initialValues={{test: 'test', testB: 'testB'}}
    onSubmit={() => (console.log('Test submit'))}
    initialErrors={{test: 'Error has occurred'}}
    validationSchema={{test: false}}
  >
    <Form>
      <StyledTextField 
        isDisabled={false} 
        name="test" 
        label="Type for error"
      />
      <StyledTextField 
        isDisabled={false} 
        name="testB" 
        label="A Label"
      />
    </Form>
  </Formik>
  )
}