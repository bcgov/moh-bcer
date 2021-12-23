import { useAxiosGet } from '@/hooks/axios';
import {
  Box,
  CircularProgress,
  InputAdornment,
  makeStyles,
  TextField,
} from '@material-ui/core';
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
} from '@material-ui/lab';
import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  StyledTextField,
  StyledTextInput,
} from 'vaping-regulation-shared-components';
import SearchIcon from '@material-ui/icons/Search';
import { BCGeocoderAutocompleteData } from '@/constants/localInterfaces';
import AutocompleteSearch from '@/components/generic/AutocompleteSearch';

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

function SearchLocation({ setSelect }: any) {
  const classes = useStyles();
  const [tOut, setTOut] = useState<any>();
  const [predictions, setPredictions] = useState<
    Array<BCGeocoderAutocompleteData>
  >([]);

  const [{ data, error, loading }, getSuggestions] = useAxiosGet('', {
    manual: true,
  });

  useEffect(() => {
    if (data && data.features?.length > 0) {
      setPredictions(data.features);
    }
  }, [data]);

  const handleAutocompleteSelect = (value: BCGeocoderAutocompleteData) => {
    setSelect(value);
  };

  const getAutocomplete = (value: any) => {
    if (tOut) {
      clearTimeout(tOut);
    }
    const a = setTimeout(() => {
      getSuggestions({
        url: `https://geocoder.api.gov.bc.ca/addresses.json?minScore=50&maxResults=5&echo=false&autoComplete=true&brief=false&matchPrecision=occupant,unit,site,civic_number,block&addressString=${value}`,
      });
    }, 500);
    setTOut(a);
  };

  return (
    <AutocompleteSearch
      options={predictions}
      getOptionLabel={(p: BCGeocoderAutocompleteData) =>
        p.properties.fullAddress
      }
      handleAutocompleteSelect={handleAutocompleteSelect}
      onTextChange={getAutocomplete}
    />
  );
}

export default SearchLocation;
