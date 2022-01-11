import { BusinessLocation } from '@/constants/localInterfaces';
import React, { useEffect, useState } from 'react';
import { useAxiosGet } from '@/hooks/axios';
import AutocompleteSearch from '@/components/generic/AutocompleteSearch';
import { Box } from '@material-ui/core';
import { StyledButton } from 'vaping-regulation-shared-components';

interface LocationAutoCompleteProps {
  selectedLocations: BusinessLocation[];
  addLocationToSelectedHandler: (l: BusinessLocation) => void;
}

function LocationAutoComplete({
  addLocationToSelectedHandler,
  selectedLocations = [],
}: LocationAutoCompleteProps) {
  const [predictions, setPredictions] = useState<BusinessLocation[]>([]);
  const [tOut, setTOut] = useState<any>();
  const [add, setAdd] = useState<boolean>(false);

  const selectedIds = selectedLocations.reduce(
    (prev, current) => [...prev, current.id],
    []
  );

  const [{ data, error, loading }, getSuggestions] = useAxiosGet('', {
    manual: true,
  });

  const handleAutocompleteSelect = (value: BusinessLocation) => {
    if (value) {
      addLocationToSelectedHandler(value);
      setAdd(false);
    }
  };

  useEffect(() => {
    if (data?.rows?.length) {
      setPredictions(data.rows);
    }
  }, [data]);

  const getOptionLabel = (l: BusinessLocation) => {
    return `${l.business?.businessName || l.business?.legalName}, ${
      l.addressLine1
    }, ${l.city}, ${l.postal}`;
  };

  const getAutocompleteDebounced = (search: string) => {
    if (tOut) {
      clearTimeout(tOut);
    }
    const a = setTimeout(() => {
      getSuggestions({
        url: `/data/location?page=1&numPerPage=10&includes=business&search=${search}`,
      });
    }, 1000);
    setTOut(a);
  };

  return (
    <Box>
      {add && (
        <AutocompleteSearch
          options={
            predictions?.filter((p) => !selectedIds?.includes(p.id)) || []
          }
          handleAutocompleteSelect={handleAutocompleteSelect}
          getOptionLabel={getOptionLabel}
          onTextChange={getAutocompleteDebounced}
          placeholder="Search Location (Business Name or Address)"
        />
      )}
      <Box mt={2} />
      <StyledButton
        disabled={add}
        variant="small-outlined"
        onClick={() => setAdd(true)}
      >
        Add
      </StyledButton>
    </Box>
  );
}

export default LocationAutoComplete;
