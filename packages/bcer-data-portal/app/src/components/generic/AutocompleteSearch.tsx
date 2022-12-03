import { Box, InputAdornment, makeStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import { StyledTextInput } from 'vaping-regulation-shared-components';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles({
  groupHeader: {
    display: 'flex',
    fontSize: '17px',
    fontWeight: 600,
    padding: '10px 0px',
  },
  radioWrapper: {
    padding: '0px 20px 15px 0px',
  },
  optionalField: {},
  autocompleteField: {
    '& .MuiAutocomplete-inputRoot': {
      padding: '0px 12px 0px 0px !important',
    },
  },
  helpIcon: {
    fontSize: '22px',
    color: '#0053A4',
  },
  tooltip: {
    backgroundColor: '#0053A4',
    fontSize: '14px',
  },
  arrow: {
    color: '#0053A4',
  },
});

interface AutoCompleteSearchProps {
  options: any[];
  getOptionLabel: (p: any) => string;
  handleAutocompleteSelect: (p: any) => void;
  onTextChange: (s: string) => void;
  placeholder?: string;
}

function AutocompleteSearch({
  options,
  getOptionLabel,
  handleAutocompleteSelect,
  onTextChange,
  placeholder,
}: AutoCompleteSearchProps) {
  const classes = useStyles();
  return (
    <Box>
      <Autocomplete
        classes={{ root: classes.autocompleteField }}
        options={options || []}
        getOptionLabel={getOptionLabel}
        freeSolo
        onChange={(e: any, value: any) => handleAutocompleteSelect(value)}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <StyledTextInput
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
                type: 'search',
              }}
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
              autoComplete="off"
              onChange={(e: any) => {
                onTextChange(e.target.value);
              }}
              name="addressLine1"
              fullWidth
              variant="filled"
              placeholder={placeholder ?? ''}
            />
          </div>
        )}
      />
    </Box>
  );
}

export default AutocompleteSearch;
