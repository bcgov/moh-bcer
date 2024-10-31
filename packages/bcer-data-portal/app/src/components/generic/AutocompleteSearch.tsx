import React from 'react';
import { Box, InputAdornment } from '@mui/material';
import { Autocomplete } from '@mui/material';
import { styled } from '@mui/system';
import { StyledTextInput } from 'vaping-regulation-shared-components';
import SearchIcon from '@mui/icons-material/Search';

const AutocompleteField = styled(Autocomplete)({
  '& .MuiAutocomplete-inputRoot': {
    padding: '0px 12px 0px 0px !important',
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
  return (
    <Box>
      <AutocompleteField
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