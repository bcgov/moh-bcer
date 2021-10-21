import { Checkbox, FormControlLabel, makeStyles } from '@material-ui/core';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import React, { Fragment, ReactElement } from 'react';
import * as yup from 'yup';
import { InputFieldError } from '../generic';
import { StyledCheckboxProps, CheckboxInputProps } from '@/constants/interfaces/inputInterfaces';
import { StyledDialog } from '@/index';
import { StyledConfirmDialogProps } from '@/constants/interfaces/dialogInterfaces';

const useStyles = makeStyles({
  emptyHelper: {
    height: '22px'
  },
  formControl:{
    paddingTop: '15px',
    fontSize: '14px',
    '& .MuiIconButton-colorSecondary':{
      '&:hover': {
        background: 'rgba(0, 83, 164, .03)',
      }
    },
    '& .MuiCheckbox-root': {
      color: 'rgba(0, 0, 0, 0.54)',

    },
    '& .Mui-checked': {
      color: '#0053A4'
    },
  },
  contentWrapper:{
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px'
  },
})

function CheckboxInput ({
  field: { value, ...fieldRest },
  form,
  label,
  disabled,
  ...props
}: CheckboxInputProps):ReactElement {
  const classes = useStyles();

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
          <Checkbox
            checked={value}
            color='primary'
            {...props}
            {...fieldRest}
          />
        }
      />
      {
        touched && !!error 
          ? <InputFieldError error={<ErrorMessage name={fieldRest.name} />} />
          : <div className={classes.emptyHelper} >{' '}</div>
      }
    </Fragment>
  )
}

/**
 * Self-contained validated form wrapping a dialog - used for confirmations
 * 
 * @param setOpen -  `function` open state handler 
 * @param confirmHandler -  `function` confirmation callback handler 
 * @param dialogTitle -  `string` confirmation dialog title content 
 * @param dialogMessage -  `string` confirmation dialog body content 
 * @param checkboxMessage -  `string` checkbox label text 
 * @param props - MUI defined `DialogProps`
 * @returns A Material-UI ReactElement with Formik context
 */
export function StyledConfirmDialog(
  {
    setOpen,
    confirmHandler,
    dialogMessage,
    checkboxLabel,
    dialogTitle,
    acceptButtonText,
    ...props
  }: StyledConfirmDialogProps): ReactElement {
    const classes = useStyles();

  return (
    <Formik
      initialValues={
        {
          confirmed: false
        }
      }
      onSubmit={() => confirmHandler()}
      validationSchema={
        yup.object({
          confirmed: yup.bool().required().oneOf([true], 'Field must be checked.')
        })
      }
    >
      <Form>
        <StyledDialog
          {...props}
          title={dialogTitle}
          cancelButtonText="Cancel"
          acceptButtonText={acceptButtonText || "Confirm"}
          cancelHandler={() => setOpen(false)}
          acceptHandler='submit'
        >
          <div className={classes.contentWrapper}>
            {dialogMessage}
            <StyledCheckbox
              name='confirmed'
              label={checkboxLabel}
            />
          </div>
        </StyledDialog>
      </Form>
    </Formik>
  )
}

/**
 * Applies Formik implicit props to a Material-UI Checkbox
 *
 * @param isDisabled - `optional | default false` boolean flag for controlling disabled state
 * @param name - string for the radio group's name
 * @param label - string for the radio group's top label text
 * @param row - `optional | default false` boolean flag for group layout orientation
 * @param  {Array} options - array of radio element options
 * @param  options.value - boolean for radio option's initial checked state
 * @param  options.label - string for radio option's label text
 * @returns object of type ReactElement
 *
 */
export function StyledCheckbox ({
  disabled = false,
  name,
  label,
}: StyledCheckboxProps) {
  return (
    <Field
      name={name}
      component={CheckboxInput}
      label={label}
      disabled={disabled}
    />
  )
}
