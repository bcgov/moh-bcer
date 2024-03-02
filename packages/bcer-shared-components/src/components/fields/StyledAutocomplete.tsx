import React from 'react';
import { Autocomplete, AutocompleteProps, UseAutocompleteProps } from '@mui/material';
import { StyledTextInput } from '@/index';

type Props<T> = {
  customProp?: string;
  placeholder?: string;
} & Omit<AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>, "renderInput"> &
  UseAutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined >;

export function StyledAutocomplete(props: Props<any>) {
  const { placeholder } = props;
  return (
    <Autocomplete 
      {...props}
      fullWidth
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <StyledTextInput 
            {...params.inputProps}
            placeholder={placeholder}
            variant='filled'
            fullWidth
            color="primary"
            size="medium"
          />
        </div>
      )}
    />
  )
}
