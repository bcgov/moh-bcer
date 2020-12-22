
import React, { ReactElement, Fragment, ChangeEvent } from 'react';
import { Field, ErrorMessage } from 'formik'
import { 
  styled,
  Radio,
  RadioGroup,
  FormControlLabel,
  makeStyles
} from '@material-ui/core';

import { InputFieldLabel, InputFieldError } from '@/components/generic';
import { RadioGroupInputProps, StyledRadioProps } from '@/constants/interfaces/inputInterfaces';

const useStyles = makeStyles({
  icon: {
    borderRadius: '50%',
    width: 24,
    height: 24,
    boxShadow: 'inset 0 0 0 1px #808080, inset 0 -1px 0 #808080',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    boxShadow: 'none',
    backgroundColor: '#0053A4',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 24,
      height: 24,
      backgroundImage: 'radial-gradient(#fff,#fff 32%,transparent 36%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#2e6ead',
    },
  },
  emptyHelper: {
    height: '22px'
  }
})

const StyledGroup = styled(RadioGroup)({
});

const StyledControlLabel = styled(FormControlLabel)({

});

const StyledControl = styled(Radio)({
  root: {
    '&:hover': {
      backgroundColor: 'rgba(0, 83, 164, 0.15)',
    },
  },
});

function GroupedRadioButtons ({
  field,
  form,
  label,
  options,
  disabled,
  ...props
}: RadioGroupInputProps):ReactElement {
  const classes = useStyles();

  const touched = form.touched[field.name];
  const error = form.errors[field.name];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const handler = field.onChange as Function
    if (value === 'true' || value === 'false') {
      handler({ target: { name: field.name, value: value === 'true' } });
    } else {
      handler({ target: { name: field.name, value } });
    }
  };

  return (
    <Fragment>
      {label && <InputFieldLabel label={label} />}
      <StyledGroup
        {...field}
        {...props}
        onChange={handleChange}
      >
        {options.map((option: any) => (
          <StyledControlLabel
            key={option.value}
            value={option.value}
            checked={field.value === option.value}
            label={option.label}
            disabled={disabled}
            labelPlacement="end"
            control={
              <StyledControl 
                checkedIcon={<span className={`${classes.icon} ${classes.checkedIcon}`} />}
                icon={<span className={classes.icon} />}
                color={option.color || 'primary'} 
              />
            }
          />
        ))}
      </StyledGroup>
      {
        touched && !!error 
          ? <InputFieldError error={<ErrorMessage name={field.name} />} />
          : <div className={classes.emptyHelper} >{' '}</div>
      }
    </Fragment>
  )
}

/**
 * Styled radio group reusable component
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
export function StyledRadioGroup ({
  isDisabled = false,
  name,
  label,
  row = false,
  options,
}: StyledRadioProps) {
  return (
    <Field
      name={name}
      component={GroupedRadioButtons}
      label={label}
      options={options}
      row={row}
      disabled={isDisabled}
    />
  )
}
