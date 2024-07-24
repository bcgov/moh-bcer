import React from 'react';
import { Autocomplete, AutocompleteProps, UseAutocompleteProps } from '@mui/material';
import { StyledTextInput } from '@/index';

type Props<T> = {
  customProp?: string;
  placeholder?: string;
} & Omit<AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>, "renderInput"> &
  UseAutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined >;

export function StyledAutocomplete(props: Props<any>) {
  const { placeholder, ...rest } = props;
  
  return (
    <Autocomplete 
      {...rest}
      fullWidth
      renderInput={(params) => (
        <StyledTextInput
          {...params}
          placeholder={placeholder}
          variant='filled'
          fullWidth
          color="primary"
          size="medium"
        />
      )}
    />
  )
}