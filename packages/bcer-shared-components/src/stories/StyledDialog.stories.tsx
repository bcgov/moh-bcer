import React, { useState } from 'react';
// import { Select, DialogProps, MenuItem } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { SelectChangeEvent } from '@mui/material/Select';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { StyledDialog } from '@/index';
import { StyledButton } from '@/index';
import { StyledTextField } from '@/index';

export default { title: 'Mui Styled Dialog' }

export const Dialog = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [maxWidth, setMaxWidth] = useState<DialogProps['maxWidth']>('sm');

  const handleMaxWidthChange = (event: SelectChangeEvent<unknown>) => {
    setMaxWidth(event.target.value as DialogProps['maxWidth']);
  };

  return (
    <div>
      <StyledDialog
        open={isOpen}
        title='Uploading Report'
        cancelButtonText="Cancel"
        acceptButtonText="Return to Dashboard"
        maxWidth={maxWidth}
        cancelHandler={() => setOpen(false)}
        acceptHandler={() => window.alert('accepted')}
      >
      <Select
        variant="standard"
        autoFocus
        value={maxWidth}
        onChange={handleMaxWidthChange}
        inputProps={{
          name: 'max-width',
          id: 'max-width',
        }}
      >
        <MenuItem value={false as any}>false</MenuItem>
        <MenuItem value="xs">xs</MenuItem>
        <MenuItem value="sm">sm</MenuItem>
        <MenuItem value="md">md</MenuItem>
        <MenuItem value="lg">lg</MenuItem>
        <MenuItem value="xl">xl</MenuItem>
      </Select>
      </StyledDialog>

      <StyledButton variant="contained" onClick={() => setOpen(true)}>Click to open dialog</StyledButton>
    </div>
  );
}
export const FormDialog = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const formSchema = Yup.object().shape({
    firstName: Yup.string()
     .min(2, 'Too Short!')
     .max(50, 'Too Long!')
     .required('Required'),
   lastName: Yup.string()
     .min(2, 'Too Short!')
     .max(50, 'Too Long!')
     .required('Required'),
   address: Yup.string()
     .min(10, 'Invalid address')
     .required('Required'),
  })

  const submitHandler = (values: any) => {
    window.alert(JSON.stringify(values))
  }

  return (
    <div>
      <Formik
        onSubmit={submitHandler}
        validationSchema={formSchema}
        initialValues={{
          address: '1234 W. East St. Ave',
          firstName: 'Your name',
          lastName: 'also your name'
        }}
      >
        <Form>
          <StyledDialog
            open={isOpen}
            title='Uploading Report'
            cancelButtonText="Cancel"
            acceptButtonText="Return to Dashboard"
            maxWidth="sm"
            cancelHandler={() => setOpen(false)}
            acceptHandler="submit"
          >
            <StyledTextField
              name="address"
              label="address"
            />
            <StyledTextField
              name="firstName"
              label="First name"
            />
            <StyledTextField
              name="lastName"
              label="Last name"
            />
          </StyledDialog>
        </Form>
      </Formik>
      <StyledButton variant="contained" onClick={() => setOpen(true)}>Click to open form dialog</StyledButton>
    </div>
  )
}