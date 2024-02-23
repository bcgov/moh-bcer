import { Checkbox, FormControlLabel, makeStyles, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import React, { Fragment, ReactElement, useState } from 'react';
import * as yup from 'yup';
import DateFnsUtils from '@date-io/date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { InputFieldError } from '../generic';
import { StyledCheckboxProps, CheckboxInputProps, DtPickerProps, StyledDatePickerProps } from '@/constants/interfaces/inputInterfaces';
import { StyledDialog } from '@/index';
import { StyledConfirmDateDialogProps, StyledConfirmDialogProps } from '@/constants/interfaces/dialogInterfaces';


const PREFIX = 'StyledConfirmDateDialog';

const classes = {
  emptyHelper: `${PREFIX}-emptyHelper`,
  formControl: `${PREFIX}-formControl`,
  contentWrapper: `${PREFIX}-contentWrapper`,
  root: `${PREFIX}-root`,
  picker: `${PREFIX}-picker`,
  icon: `${PREFIX}-icon`
};

const StyledField
 = styled(Field
)({
  [`& .${classes.emptyHelper}`]: {
    height: '22px'
  },
  [`& .${classes.formControl}`]: {
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
  [`& .${classes.contentWrapper}`]: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px'
  },
  [`& .${classes.root}`]: {
    backgroundColor: '#F5F5F5',
    height: '58px',
    width: '100%',
    borderRadius: '2px',
    '& .MuiInput-underline::before': {
      display: 'none',
    },
    cursor: 'pointer',
  },
  [`& .${classes.picker}`]: {
    color: '#535353',
    fontSize: '16px',
    marginLeft: '9px',
    minWidth: '56px',
    height: '19px'
  },
  [`& .${classes.icon}`]: {
    color: 'white',
  },
});

function CheckboxInput ({
  field: { value, ...fieldRest },
  form,
  label,
  disabled,
  ...props
}: CheckboxInputProps):ReactElement {

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

export function StyledConfirmDateDialog(
  {
    setOpen,
    confirmHandler,
    dialogMessage,
    checkboxLabel,
    dialogTitle,
    dateLabel,
    maxDate,
    minDate,
    ...props
  }: StyledConfirmDateDialogProps): ReactElement {


  return (
    <Formik
      initialValues={
        {
          date: new Date(),
          confirmed: false
        }
      }
      onSubmit={(values: { date: Date, confirmed: boolean }) => confirmHandler(values)}
      validationSchema={
        yup.object({
          date: yup.date().required(),
          confirmed: yup.bool().required().oneOf([true], 'Field must be checked.')
        })
      }
    >
      <Form>
        <StyledDialog
          {...props}
          title={dialogTitle}
          cancelButtonText="Cancel"
          acceptButtonText="Confirm"
          cancelHandler={() => setOpen(false)}
          acceptHandler='submit'
        >
          <div className={classes.contentWrapper}>
            {dialogMessage}
            <DtPickerField 
              name="date" 
              label={dateLabel}
              maxDate={maxDate}
              minDate={minDate}
            />
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
function StyledCheckbox ({
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


const TextFieldComponent = (props: any) => {
  return <TextField variant="standard" {...props} disabled={true} />;
};

function DtPicker ({
  field: { value, ...fieldRest },
  form,
  label,
  disabled,
  ...props
}: DtPickerProps):ReactElement {

  /** open calendar */
  const [open, setOpen] = useState(false);

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
          <LocalizationProvider>
             <DatePicker
              className={classes.root}
              inputProps={{ className: classes.picker }}
              TextFieldComponent={TextFieldComponent}
              label="Closing Date"
              format="LLLL dd, yyyy"
              value={value}
              onChange={(date: Date | null) => {
                form.setFieldValue('date', date)
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              onClick={() => setOpen(true)}
              onClose={() => setOpen(false)}
              open={open}
              {...props}
             />
          </LocalizationProvider>
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

export function DtPickerField ({
  disabled = false,
  name,
  label,
  ...props
}: StyledDatePickerProps) {
  return (
    <Field
      name={name}
      component={DtPicker}
      label={label}
      disabled={disabled}
      {...props}
    />
  )
}
