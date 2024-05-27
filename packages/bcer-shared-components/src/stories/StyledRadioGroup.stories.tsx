import React from 'react';
import { StyledRadioGroup } from '@/index';
import { Formik, Form } from 'formik';

export default { title: 'Mui Styled Radio' }

export const RadioGroup = () => {
  return (
  <Formik
    initialValues={{test: 'test'}}
    onSubmit={() => (console.log('Test submit'))}
  >
    <Form>
      <StyledRadioGroup 
        isDisabled={false} 
        name="test group 1" 
        label="Multiple radio - row"
        row={true}
        options={[
          {value: true, label: 'Option 1'},
          {value: false, label: 'Option 2'}
        ]}
      />
      <StyledRadioGroup 
        isDisabled={false} 
        name="test group 2" 
        label="Multiple radio - collumn"
        row={false}
        options={[
          {value: true, label: 'Option 1'},
          {value: false, label: 'Option 2'}
        ]}
      />

      <br/>
      <h2> Single radio </h2>
      <StyledRadioGroup 
        isDisabled={false} 
        name="test single" 
        label=""
        row={false}
        options={[
          {value: true, label: 'Option 1'},
        ]}
      />

      <h2> Single radios grouped with components in between</h2>
      <StyledRadioGroup 
        isDisabled={false} 
        name="test single 2" 
        label=""
        row={false}
        options={[
          {value: true, label: 'Option 2'},
        ]}
      />
      <div> some content </div>
      <div> some more content</div>
      <StyledRadioGroup 
        isDisabled={false} 
        name="test single 2" 
        label=""
        row={false}
        options={[
          {value: false, label: 'Option 1'},
        ]}
      />
    </Form>
  </Formik>
  )
}