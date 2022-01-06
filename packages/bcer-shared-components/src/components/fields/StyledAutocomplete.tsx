
import React from 'react';
import { Autocomplete, AutocompleteProps, UseAutocompleteProps } from '@material-ui/lab';
import { StyledTextInput } from '@/index';

/**
 * Type override for StyledAutocomplete props to omit renderInput, to be defined manually
 */
type Props<T> = {
  customProp?: string;
} & Omit<AutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined>, "renderInput"> &
  UseAutocompleteProps<T, boolean | undefined, boolean | undefined, boolean | undefined >;

/**
 * Applies field styling to the Autocomplete text field
 *  
 * @param props - Material-UI input props `Type AutocompleteProps & UseAutocompleteProps`
 * @returns A Material-UI ReactElement
 */
export function StyledAutocomplete
(props: Props<any>  ) {
  const { placeholder } = props;
  return (
    <Autocomplete 
      {...props}
      fullWidth
      renderInput={(params) => (
        <div ref={params.InputProps.ref}>
          <StyledTextInput {...params.inputProps} placeholder={placeholder} variant='filled' fullWidth/>
        </div>
      )}
    />
  )
}
