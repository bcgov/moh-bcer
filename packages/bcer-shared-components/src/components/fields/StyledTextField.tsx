import React, { ReactElement, Fragment } from 'react';
import { Field, ErrorMessage } from 'formik';
import { TextFieldProps } from '@mui/material';
import TextField from '@mui/material/TextField';
import { InputFieldLabel, InputFieldError } from '@/components/generic';
import { TextInputProps, StyledTextProps } from '@/constants/interfaces/inputInterfaces';

/**
 * Uses react styled() to apply styles to the text field component
 * @returns A MUI ReactElement with specified styles
 */
export const StyledTextInput = (props: TextFieldProps) => (
  <TextField
    {...props}
    sx={{
      '& .MuiFilledInput-root': {
        backgroundColor: '#F5F5F5',
      },
      '& .MuiFilledInput-input': {
        padding: '10px 10px 10px 14px',
      },
      '& .MuiFilledInput-underline': {
        '&:after': {
          borderBottom: '2px solid #0053A4',
        },
      },
    }}
  />
);

export const StyledOutlinedInput = (props: TextFieldProps) => (
  <TextField
    {...props}
    sx={{
      '& .MuiOutlinedInput-root': {
        backgroundColor: '#FAFAFA',
        borderRadius: '3px',
      },
      '& .MuiOutlinedInput-input': {
        padding: '12px 10px 12px 14px',
        fontSize: '14px',
        lineHeight: '19px',
      },
    }}
  />
);

/**
 * Applies Formik implicit props to a MUI TextField
 * 
 * @param field - Formik's implicit field context `Type FieldAttributes<TextFieldProps>`
 * @param form - Formik's implicit form context `Type FormikProps<FormData>` 
 * @param props - MUI input props `Type TextFieldProps`
 * @returns A MUI ReactElement with Formik context
 */
function TextInput ({
  field: { value, ...fieldRest },
  form,
  label,
  variant,
  placeholder,
  warningMessage,
  ...props
}: TextInputProps): ReactElement {
  const touched = form.touched[fieldRest.name as keyof typeof form.touched];
  const error = form.errors[fieldRest.name as keyof typeof form.errors];
  return (
    <Fragment>
      {label && <InputFieldLabel label={label} />}
      {variant === 'outlined' ? (
        <StyledOutlinedInput
          variant="outlined"
          placeholder={placeholder || ''}
          fullWidth
          error={touched && !!error}
          value={value || ''}
          {...fieldRest}
          {...props}
        />
      ) : (
        <StyledTextInput
          variant="filled"
          fullWidth
          error={touched && !!error}
          value={value || ''}
          {...fieldRest}
          {...props}
        />
      )}
      {
        touched && !!error ? (
          <InputFieldError error={<ErrorMessage name={fieldRest.name} />} />
        ) : warningMessage ? (
          <p className="MuiFormHelperText-root Mui-error css-53ej5y-MuiFormHelperText-root" style={{ color: '#FFA500' }}> {warningMessage} </p>
        ) : (
          <div style={{ height: '22px' }}>{' '}</div>
        )
      }
    </Fragment>
  );
}

/**
 * Styled text field reusable component
 *
 * @param isDisabled - `optional | default false` boolean flag for controlling disabled state
 * @param name - string for the field's name
 * @param label - string for the field's label text
 * @param fullWidth - `optional | default true` boolean flag for the field's layout width
 * @returns object of type ReactElement
 *
 */
export function StyledTextField({
  isDisabled = false,
  name,
  label,
  fullWidth = true,
  variant,
  placeholder,
  warningMessage,
  ...rest
}: StyledTextProps) {
  return (
    <Field
      name={name}
      component={TextInput}
      label={label}
      fullWidth={fullWidth ? fullWidth : undefined}
      disabled={isDisabled}
      variant={variant}
      placeholder={placeholder}
      warningMessage={warningMessage}
      {...rest}
    />
  );
}