import { InputFieldError } from '@/components/generic';
import { styled } from '@mui/material/styles';
import {
  CheckboxInputProps,
  StyledCheckboxProps,
} from '@/constants/interfaces/inputInterfaces';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { ErrorMessage, Field } from 'formik';
import React, { Fragment, ReactNode } from 'react';

const PREFIX = 'StyledCheckedInput';

const classes = {
  emptyHelper: `${PREFIX}-emptyHelper`,
  formControl: `${PREFIX}-formControl`
};

const StyledField
 = styled(Field
)({
  [`& .${classes.emptyHelper}`]: {
    height: '22px',
  },
  [`& .${classes.formControl}`]: {
    fontSize: '14px',
    '& .MuiIconButton-colorSecondary': {
      '&:hover': {
        background: 'rgba(0, 83, 164, .03)',
      },
    },
    '& .MuiCheckbox-root': {
      color: 'rgba(0, 0, 0, 0.54)',
    },
    '& .Mui-checked': {
      color: '#0053A4',
    },
  },
});

function CheckboxInput({
  field: { value, ...fieldRest },
  form,
  label,
  disabled,
  showError,
  ...props
}: CheckboxInputProps): ReactNode {


  const touched = form.touched[fieldRest.name];
  const error = form.errors[fieldRest.name];

  return (
    <Fragment>
      <FormControlLabel
        className={classes.formControl}
        label={label}
        disabled={disabled}
        labelPlacement="end"
        control={
          <Checkbox checked={value} color="primary" {...props} {...fieldRest} />
        }
      />
      {showError &&
        (touched && !!error ? (
          <InputFieldError error={<ErrorMessage name={fieldRest.name} />} />
        ) : (
          <div className={classes.emptyHelper}> </div>
        ))}
    </Fragment>
  );
}

export function StyledCheckboxInput({
  disabled = false,
  name,
  label,
  showError = false,
}: StyledCheckboxProps) {
  return (
    <Field
      name={name}
      component={CheckboxInput}
      label={label}
      disabled={disabled}
      showError={showError}
    />
  );
}
