import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { BCGeocoderAutocompleteData } from '@/constants/localInterfaces';
import AutocompleteSearch from '@/components/generic/AutocompleteSearch';
import { useAxiosGet } from '@/hooks/axios';

const StyledAutocompleteSearch = styled(AutocompleteSearch)(({ theme }) => ({
  '& .MuiAutocomplete-inputRoot': {
    padding: '0px 12px 0px 0px !important',
  },
}));

interface SearchLocationProps {
  setSelect: (value: BCGeocoderAutocompleteData) => void;
}

function SearchLocation({ setSelect }: SearchLocationProps) {
  const [tOut, setTOut] = useState<NodeJS.Timeout | null>(null);
  const [predictions, setPredictions] = useState<BCGeocoderAutocompleteData[]>([]);

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

  const getAutocomplete = (value: string) => {
    if (tOut) {
      clearTimeout(tOut);
    }
    const newTimeout = setTimeout(() => {
      getSuggestions({
        url: `https://geocoder.api.gov.bc.ca/addresses.json?minScore=50&maxResults=5&echo=false&autoComplete=true&brief=false&matchPrecision=occupant,unit,site,civic_number,block&addressString=${value}`,
      });
    }, 500);
    setTOut(newTimeout);
  };

  return (
    <StyledAutocompleteSearch
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