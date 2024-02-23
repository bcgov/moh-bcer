
import React, { ReactElement, Fragment } from 'react';
import { Field } from 'formik'
import { TextField, MenuItem, styled } from '@mui/material';
import { InputFieldLabel } from '@/components/generic';
import { SelectInputProps, SelectOptionProps, StyledSelectProps } from '@/constants/interfaces/inputInterfaces';

/**
 * Uses react styled() to apply styles to the text field component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledSelect = styled(TextField)({
  '& .MuiSelect-root': {
    padding: '10px',
    fontSize: '14px',
    color: '#333333',
    backgroundColor: '#F5F5F5',
    borderRadius: '3px 3px 0px 0px'

  }
});

const StyledOutlinedSelect = styled(TextField)({
  '& .MuiSelect-root': {
    padding: '11px',
    fontSize: '14px',
    color: '#333333',
    backgroundColor: '#CDCED2',
    
  },
  '& .MuiOutlinedInput-root': {
    borderTopLeftRadius: '3px',
    borderBottomLeftRadius: '3px',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
  }
})

/**
 * Uses react styled() to apply styles to the MenuItem component
 * @returns A Material-UI ReactElement with specified styles
 */
const StyledMenuItem = styled(MenuItem)({
  
});

/**
 * Applies Formik implicit props to a Material-UI TextField
 * 
 * @param field - Formik's implicit field context `Type FieldAttributes<TextFieldProps>`
 * @param form - Formik's implicit form context `Type FormikProps<FormData>` 
 * @param props - Material-UI input props `Type TextFieldProps`
 * @returns A Material-UI ReactElement with Formik context
 */
function SelectInput ({
  field: { value, ...fieldRest },
  form,
  label,
  options,
  variant,
  ...props
}: SelectInputProps):ReactElement {

  const error = form.errors[fieldRest.name];
  const submitCount = form.submitCount;

  return (
    <Fragment>
      {label && <InputFieldLabel label={label} />}
      {variant === 'outlined' ? 
        <StyledOutlinedSelect
          select
          variant="outlined"
          fullWidth
          error={!!error && submitCount > 0}
          helperText={ error &&  submitCount > 0 ? error : ' '}
          inputProps={{ displayEmpty: true }}
          value={value || ''}
          {...fieldRest}
          {...props}
          as="div" // Explicitly define 'as' prop as 'div'
        >
          <StyledMenuItem value="" disabled>Please Select</StyledMenuItem>
          {
            options.map((element: {value: string, label: string}, index: number) => (
              <StyledMenuItem key={index} value={element.value}>{element.label}</StyledMenuItem>
            ))
          }
        </StyledOutlinedSelect>
      : <StyledSelect
          select
          variant="filled"
          fullWidth
          error={!!error && submitCount > 0}
          helperText={ error &&  submitCount > 0 ? error : ' '}
          inputProps={{ displayEmpty: true }}
          value={value || ''}
          {...fieldRest}
          {...props}
          as="div" // Explicitly define 'as' prop as 'div'
        >
          <StyledMenuItem value="" disabled>Please Select</StyledMenuItem>
          {
            options.map((element: {value: string, label: string}, index: number) => (
              <StyledMenuItem key={index} value={element.value}>{element.label}</StyledMenuItem>
            ))
          }
        </StyledSelect>
      }
    </Fragment>
  );
}

function SelectItems({options}: SelectOptionProps) {
  return (
    <Fragment>
      <StyledMenuItem value="" disabled>Please Select</StyledMenuItem>
        {
          options.map((element: {value: string, label: string}, index: number) => (
            <StyledMenuItem key={index} value={element.value}>{element.label}</StyledMenuItem>
          ))
        }
    </Fragment>
  )
}

/**
 * Styled select field reusable component
 *
 * @param isDisabled - `optional | default false` boolean flag for controlling disabled state
 * @param name - string for the field's name
 * @param label - string for the rfield's label text
 * @param fullWidth - `optional | default true` boolean flag for the field's layout width
 * @param  {Array} options - array of select MenuItem options
 * @param  options.value - string for menu item value
 * @param  options.label - string for menu item label
 * @returns object of type ReactElement
 *
 */
export function StyledSelectField ({
  isDisabled = false,
  name,
  label,
  fullWidth = true,
  options,
  variant,
}: StyledSelectProps) {
  return (
    <Field
      name={name}
      component={SelectInput}
      label={label}
      options={options}
      fullWidth={fullWidth}
      disabled={isDisabled}
      variant={variant}
    />
  );
}