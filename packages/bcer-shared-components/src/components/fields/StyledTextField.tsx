
import React, { ReactElement, Fragment } from 'react';
import { Field, ErrorMessage } from 'formik'
import { TextField, makeStyles, styled } from '@material-ui/core';

import { InputFieldLabel, InputFieldError } from '@/components/generic';
import { TextInputProps, StyledTextProps } from '@/constants/interfaces/inputInterfaces';

const useStyles = makeStyles({
  emptyHelper: {
    height: '22px'
  }
})

/**
 * Uses react styled() to apply styles to the text field component
 * @returns A Material-UI ReactElement with specified styles
 */
export const StyledTextInput = styled(TextField)({
  '& .MuiFilledInput-root': {
    backgroundColor: '#F5F5F5',
  },
  '& .MuiFilledInput-input':{
    padding: '10px 10px 10px 14px'
  },
  '& .MuiFilledInput-underline': {
    '&:after': {
      borderBottom: '2px solid #0053A4'
    }
  }
});

/**
 * Applies Formik implicit props to a Material-UI TextField
 * 
 * @param field - Formik's implicit field context `Type FieldAttributes<TextFieldProps>`
 * @param form - Formik's implicit form context `Type FormikProps<FormData>` 
 * @param props - Material-UI input props `Type TextFieldProps`
 * @returns A Material-UI ReactElement with Formik context
 */
function TextInput ({
  field: { value, ...fieldRest },
  form,
  label,
  ...props
}: TextInputProps):ReactElement {
  const classes = useStyles();

  const touched = form.touched[fieldRest.name];
  const error = form.errors[fieldRest.name];
  
  return (
    <Fragment>
      {label && <InputFieldLabel label={label} />}
      <StyledTextInput
        variant="filled"
        fullWidth
        error={touched && !!error}
        value={value || ''}
        {...fieldRest}
        {...props}
      />
      {
        touched && !!error 
          ? <InputFieldError error={<ErrorMessage name={fieldRest.name} />} />
          : <div className={classes.emptyHelper} >{' '}</div>
      }
    </Fragment>
  );
}

/**
 * Styled text field reusable component
 *
 * @param isDisabled - `optional | default false` boolean flag for controlling disabled state
 * @param name - string for the field's name
 * @param label - string for the rfield's label text
 * @param fullWidth - `optional | default true` boolean flag for the field's layout width
 * @returns object of type ReactElement
 *
 */
export function StyledTextField ({
  isDisabled = false,
  name,
  label,
  fullWidth = true
}: StyledTextProps) {
  return (
    <Field
      name={name}
      component={TextInput}
      label={label}
      fullWidth={fullWidth}
      disabled={isDisabled}
    />
  );
}