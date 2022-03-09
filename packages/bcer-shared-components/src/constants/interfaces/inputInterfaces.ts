import { FormikProps, FieldAttributes } from "formik";
import { TextFieldProps, RadioGroupProps, CheckboxProps} from "@material-ui/core";
import { DatePickerProps } from '@material-ui/pickers';
import React, { Dispatch, SetStateAction } from "react";

export interface TextInputProps {
  field: FieldAttributes<TextFieldProps>;
  form: FormikProps<FormData>;
  label: string;
  variant?: 'outlined' | 'filled' | undefined;
  placeholder?: string;
  props: TextFieldProps;
}

export interface StyledTextProps {
  name: string;
  label: string;
  isDisabled?: boolean;
  fullWidth?: boolean | undefined;
  [s: string]: unknown;
}

export interface SelectOptionProps {
  options : Array<{
    value: string;
    label: string;
  }>;
}

export interface SelectInputProps extends TextInputProps {
  options: Array<{
    value: string;
    label: string;
  }>
}

export interface StyledSelectProps {
  name: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
  }>
  isDisabled?: boolean;
  fullWidth?: boolean | undefined;
  variant?: 'outlined' | 'filled' | undefined;
}

export interface RadioGroupInputProps {
  field: FieldAttributes<RadioGroupProps>;
  form: FormikProps<FormData>;
  label: string;
  additionalChange: Function | undefined;
  props: TextFieldProps;
  disabled: boolean;
  options: Array<{
    value: boolean | string;
    label: string;
  }>
}

export interface StyledRadioProps {
  name: string;
  label: string;
  options: Array<{
    value: boolean | string;
    label: string;
  }>
  isDisabled?: boolean;
  row?: boolean | undefined;
  onChange?: Function | undefined;
}

export interface CheckboxInputProps {
  field: FieldAttributes<CheckboxProps>;
  form: FormikProps<FormData>;
  name: string;
  label: string;
  props: CheckboxProps;
  disabled?: boolean;
  showError?: boolean;
}

export interface StyledCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
  showError?: boolean;
}

export interface StyledDatePickerProps extends StyledCheckboxProps {
  maxDate?: Date;
  minDate?: Date;
}

export interface StyledHeaderMapperProps {
  requiredHeaders: any;
  providedHeaders: Array<string>;
  updateMapCallback: Function;
  cancelHandler?: Function;
}

export interface ContextProps {
  setOptionsHandler: Dispatch<SetStateAction<{ value: string; label: string; }[]>>;
  stateOptions: Array<{label: string, value: string}>;
}

export interface DtPickerProps {
  field: FieldAttributes<DatePickerProps>;
  form: FormikProps<FormData>;
  name: string;
  label: string;
  props: DatePickerProps;
  disabled?: boolean;
  minDate?: Date,
  maxDate?: Date,
}