import React, { useState, useEffect, useRef, useCallback } from 'react';
import DialogContent from '@mui/material/DialogContent';
import { Grid, Autocomplete } from '@mui/material';
import {
  addressValidationSchema,
  webpageValidationSchema,
  emailValidationSchema,
  phoneValidationSchema,
  manufacturingValidationSchema,
  underageValidationSchema,
  postalValidationSchema
} from '@/constants/validate';
import { StyledDialog, StyledTextField } from 'vaping-regulation-shared-components';
import { BCGeocoderAutocompleteData } from '@/constants/localInterfaces';
import { useAxiosGet } from '@/hooks/axios';
import { GeoCodeUtil } from '@/util/geoCoder.util';

interface StyledEditDialogProps {
  type: string;
  saveChange: (
    data: string,
    city?: string,
    health_authority?: string,
    longitude?: number,
    latitude?: number,
    geo_confidence?: string
  ) => void;
  dialogOpen: boolean;
  handleDialogClose: () => void;
}

export default function StyledEditDialog({ type, saveChange, dialogOpen, handleDialogClose }: StyledEditDialogProps) {
  const [content, setContent] = useState('');
  const [city, setCity] = useState('');
  const [health_authority, setHealth_authority] = useState('');
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [geo_confidence, setGeo_confidence] = useState('');
  const [errorText, seterrorText] = useState('');
  const requestQueue = useRef<string[]>([]);
  const isRequesting = useRef(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<Array<string>>([]);
  const [predictions, setPredictions] = useState<Array<BCGeocoderAutocompleteData>>([]);
  const [{ data: suggestions, error: suggestionsError, loading: suggestionsLoading }, getSuggestions] = useAxiosGet('', { manual: true });
  const [{ data: healthAuthority, error: haError, loading: haLoading }, determineHealthAuthority] = useAxiosGet('', { manual: true });
  const locationInfoType: { [key: string]: string } = {
    addressLine1: 'Address',
    webpage: 'Webpage',
    email: 'Email',
    phone: 'Phone',
    manufacturing: 'Manufacturing',
    underage: 'Underage',
    postal: 'Postal'
  };

  // Field validation
  useEffect(() => {
    const contentObj: { [type: string]: any } = {};
    contentObj[type] = content;
    const validationSchema = {
      addressLine1: addressValidationSchema,
      webpage: webpageValidationSchema,
      email: emailValidationSchema,
      phone: phoneValidationSchema,
      manufacturing: manufacturingValidationSchema,
      underage: underageValidationSchema,
      postal: postalValidationSchema
    }[type];

    if (validationSchema) {
      validationSchema.isValid(contentObj).then((valid: boolean) => {
        seterrorText(valid ? '' : 'Input Not Valid');
      });
    }
  }, [content, type]);

  useEffect(() => {
    if (suggestions && suggestions.features?.length > 0) {
      setPredictions(suggestions.features);
      setAutocompleteOptions(suggestions.features.map((e: BCGeocoderAutocompleteData) => e.properties.fullAddress));
    }
  }, [suggestions]);

  useEffect(() => {
    if (healthAuthority) {
      setHealth_authority(healthAuthority.toLowerCase());
      seterrorText('');
    }
  }, [healthAuthority]);

  // Fetch suggestions
  const getAutocomplete = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent('');
    const value = e.target.value;
    requestQueue.current.push(value);
    processQueue();
  };

  // Determine health authority based on longitude and latitude
  const doDetermineHealthAuthority = useCallback(
    async (long: number, lat: number) => {
      try {
        await determineHealthAuthority({
          url: `data/location/determine-health-authority-on-portal?lat=${lat}&long=${long}`
        });
      } catch (error) {
        console.error('Error determining health authority:', error);
      }
    },
    [determineHealthAuthority]
  );

  // Ensures that only one autocomplete request is made at a time and processes the most recent request in the queue
  const processQueue = useCallback(async () => {
    if (isRequesting.current || requestQueue.current.length === 0) return;
    isRequesting.current = true;
    const value = requestQueue.current.pop();
    requestQueue.current = [];
    try {
      await getSuggestions({ url: GeoCodeUtil.getAutoCompleteUrl(value) });
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
    isRequesting.current = false;
    processQueue();
  }, [getSuggestions]);

  // Store the values when user selects an option from the dropdown
  const handleAutocompleteSelect = async (event: React.SyntheticEvent<Element, Event>, value: string | null) => {
    // Clear the request queue to prevent further API calls
    requestQueue.current = [];
    isRequesting.current = false;

    const fullLocation = predictions.find((e: { properties: { fullAddress: any } }) => e.properties.fullAddress === value);
    if (fullLocation) {
      setContent(fullLocation.properties.fullAddress);
      setCity(fullLocation.properties.localityName);
      setLongitude(fullLocation.geometry.coordinates[0]);
      setLatitude(fullLocation.geometry.coordinates[1]);
      setGeo_confidence(fullLocation.properties.precisionPoints);
      await doDetermineHealthAuthority(fullLocation.geometry.coordinates[0], fullLocation.geometry.coordinates[1]); // Wait for health authority determination
    }
  };

  // Save changes when the user clicks the SAVE button
  async function confirmContentChange() {
    if (type === 'addressLine1' && !health_authority) {
      seterrorText('Please wait for the system to determine the Health Authority');
    } else {
      saveChange(content, city, health_authority, longitude, latitude, geo_confidence);
      handleDialogClose();
    }
  }

  // Cancel changes when the user clicks the CANCEL button
  async function cancelContentChange() {
    saveChange('');
    handleDialogClose();
  }

  return (
    <Grid>
      <StyledDialog
        open={dialogOpen}
        cancelButtonText="Cancel"
        acceptButtonText="Save"
        acceptHandler={confirmContentChange}
        cancelHandler={cancelContentChange}
        acceptDisabled={errorText !== ''}
        title="Edit Info"
      >
        <DialogContent>
          {type === 'addressLine1' ? (
            <Autocomplete
              options={autocompleteOptions}
              freeSolo
              onChange={async (event, newValue, reason) => {
                if (reason === 'selectOption') {
                  await handleAutocompleteSelect(event, newValue);
                  console.log('Autocomplete onChange completed');
                } else if (reason === 'clear') {
                  console.log('Autocomplete clear button clicked');
                }
              }}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  name={locationInfoType[type]}
                  label={locationInfoType[type]}
                  error={!!errorText}
                  helperText={errorText}
                  autoComplete="off"
                  onChange={getAutocomplete} // Fetch suggestions
                />
              )}
            />
          ) : (
            <StyledTextField
              name={locationInfoType[type]}
              label={locationInfoType[type]}
              value={content}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value)}
              error={!!errorText}
              helperText={errorText}
            />
          )}
        </DialogContent>
      </StyledDialog>
    </Grid>
  );
}