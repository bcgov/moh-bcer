
import React, { ReactElement, Fragment, ChangeEvent } from 'react';
import { Field, ErrorMessage } from 'formik'
import { Radio, RadioGroup, FormControlLabel, RadioGroupProps, FormControlLabelProps, RadioProps } from '@mui/material';
import { InputFieldLabel, InputFieldError } from '@/components/generic';
import { RadioGroupInputProps, StyledRadioProps } from '@/constants/interfaces/inputInterfaces';
import styled from 'styled-components';


const Icon = styled.span`
  border-radius: 50%;
  width: 24px;
  height: 24px;
  box-shadow: inset 0 0 0 1px #808080, inset 0 -1px 0 #808080;
  background-image: linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0));

  input:hover ~ & {
    background-color: #ebf1f5;
  }

  input:disabled ~ & {
    box-shadow: none;
    background: rgba(206,217,224,.5);
  }
`;

const CheckedIcon = styled(Icon)`
  box-shadow: none;
  background-color: #0053A4;
  background-image: linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0));

  &:before {
    display: block;
    width: 24px;
    height: 24px;
    background-image: radial-gradient(#fff,#fff 32%,transparent 36%);
    content: "";
  }

  input:hover ~ & {
    background-color: #2e6ead;
  }
`;

const EmptyHelper = styled.span`
  height: 22px;
`;


const StyledGroup = (props: RadioGroupProps) => (
  <RadioGroup {...props}/>
);

const StyledControlLabel = (props: FormControlLabelProps) => (
  <FormControlLabel {...props}/>
);

const StyledControl = (props: RadioProps) => (
  <Radio
  {...props}
  sx={{
    root: {
      '&:hover': {
        backgroundColor: 'rgba(0, 83, 164, 0.15)',
      },
    },
  }}
  />
);

function GroupedRadioButtons ({
  field,
  form,
  label,
  options,
  disabled,
  additionalChange,
  ...props
}: RadioGroupInputProps & { form: { touched: Record<string, boolean>, errors: Record<string, string> } }) {

  const touched = form.touched[field.name];
  const error = form.errors[field.name];
  const { value = "" } = field; // Provide a default value if `field.value` is `undefined`


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (additionalChange) {
      additionalChange(event.target.value)
    }
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
        value={value} // Use the destructured `value` here
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
                checkedIcon={<CheckedIcon />}
                icon={<Icon />}
                color={option.color || 'primary'} 
              />
            }
          />
        ))}
      </StyledGroup>
      {
        touched && !!error 
          ? <InputFieldError error={<ErrorMessage name={field.name} />} />
          : <EmptyHelper>{' '}</EmptyHelper>
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
  onChange = undefined
}: StyledRadioProps) {
  return (
    <Field
      name={name}
      component={GroupedRadioButtons}
      label={label}
      row={row? row : undefined}
      options={options}
      disabled={isDisabled}
      additionalChange={onChange}
    />
  )
}
