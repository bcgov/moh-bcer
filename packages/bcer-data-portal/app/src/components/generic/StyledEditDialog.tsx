import React, {useState, useEffect, ChangeEvent} from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import {IconButton, Tooltip, Grid} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason } from '@material-ui/lab';
import {
  addressValidationSchema, 
  webpageValidationSchema, 
  emailValidationSchema,
  phoneValidationSchema, 
  manufacturingValidationSchema, 
  underageValidationSchema, 
  postalValidationSchema} from '@/constants/validate';
import {StyledDialog, StyledTextField } from 'vaping-regulation-shared-components';
import { BCGeocoderAutocompleteData } from '@/constants/localInterfaces';
import { useAxiosGet } from '@/hooks/axios';
import { GeoCodeUtil } from '@/util/geoCoder.util';

interface StyledEditDialogProps {
  type: string;
  saveChange: (
    data:string, 
    city?:string,
    health_authority?:string,
    longitude?: number,
    latitude?: number,
    geo_confidence?:string
    ) => void
}

//This is the StyledEditDialog for the following location information on Location Details page, it validates the user's input and send the new content back to the StyledEditableTextField component
// addressLine1 || postal || webpage || phone || email || underage || manufacturing
export default function StyledEditDialog({type, saveChange}:StyledEditDialogProps) {
  const [content, setContent] = useState('');
  const [city, setCity] = useState('');
  const [health_authority, setHealth_authority] = useState('');
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [geo_confidence, setGeo_confidence] = useState('');
	const [open, setOpen] = useState(false);
  const [errorText, seterrorText] = useState('');
  
  const locationInfoType: { [key: string]: string } = {
    addressLine1: 'Address',
    webpage: 'Webpage',
    email: 'Email',
    phone: 'Phone',
    manufacturing: 'Manufacturing',
    underage: 'Underage',
    postal: 'Postal'
  };

  useEffect(() => { //input validation
    const contentObj: {[type: string]:any} = {}
    contentObj[type] = content;
    {type === 'addressLine1' && addressValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'webpage' && webpageValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'email' && emailValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'phone' && phoneValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'manufacturing' && manufacturingValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'underage' && underageValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
    {type === 'postal' && postalValidationSchema.isValid(contentObj).then((valid:any) => {if(valid){seterrorText('')}else{seterrorText('Input Not Valid')}})}
  }, [content])

  async function confirmContentChange() {
    saveChange(content, city, health_authority, longitude, latitude, geo_confidence)
    setOpen(false);
  }

  async function cancelContentChange() {
    saveChange("")
    setOpen(false);
  }

  //address auto complete
  const [ autocompleteOptions, setAutocompleteOptions ] = useState<Array<string>>([]);
  const [ predictions, setPredictions ] = useState<Array<BCGeocoderAutocompleteData>>([]);
  const [{ data: suggestions, error:suggestionsError, loading:suggestionsLoading }, getSuggestions] = useAxiosGet('', { manual: true })
  const [{ data: healthAuthority, error: haError, loading: haLoading }, determineHealthAuthority] = useAxiosGet('', { manual: true })

  useEffect(() => {
    if (suggestions && suggestions.features?.length > 0) {
      setPredictions(suggestions.features)
      setAutocompleteOptions(suggestions.features.map((e: BCGeocoderAutocompleteData) => e.properties.fullAddress))
    }    
  }, [suggestions])

  useEffect(() => {
    if(healthAuthority) {
      setHealth_authority(healthAuthority.toLowerCase())
    }
  }, [healthAuthority]);

  const getAutocomplete = (e: any) => {
    getSuggestions({url: GeoCodeUtil.getAutoCompleteUrl(e.target.value)})
  }

  const doDetermineHealthAuthority = (long: number, lat: number) => {
    determineHealthAuthority({url: `data/location/determine-health-authority-on-portal?lat=${lat}&long=${long}`})
  }

  const handleAutocompleteSelect = ( value: any, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any>) => {
    const fullLocation = predictions.find((e: { properties: { fullAddress: any; }; }) => e.properties.fullAddress === value)
    setContent(fullLocation ? fullLocation.properties.fullAddress : "")
    setCity(fullLocation.properties.localityName)
    setLongitude(fullLocation.geometry.coordinates[0])
    setLatitude(fullLocation.geometry.coordinates[1])
    setGeo_confidence(fullLocation.properties.precisionPoints)
    if (fullLocation) {
      doDetermineHealthAuthority(fullLocation.geometry.coordinates[0], fullLocation.geometry.coordinates[1]);
    }
  }

  return (
    <Grid>
      <Tooltip title="Edit" placement="top">
            <IconButton style={{color: '#0053A5'}} onClick={() => setOpen(true)}>
              <EditIcon />
            </IconButton>
      </Tooltip>
 			<StyledDialog 
        open={open}
        cancelButtonText="Cancel"
        acceptButtonText="Save"
        acceptHandler={confirmContentChange}
        cancelHandler={cancelContentChange}
        acceptDisabled={errorText!==''}
        title="Edit Info"
			>
        <DialogContent>
          {type === "addressLine1"?
             <Autocomplete
              options={autocompleteOptions} 
              freeSolo
              value={content}
              onChange={(e: ChangeEvent<{}>, value: any, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any> ) => {handleAutocompleteSelect(value, reason, details)}}
              renderInput={(params: any) => (
                <StyledTextField 
                  {...params}
                  name={locationInfoType[type]}
                  label={locationInfoType[type]}
                  error = {errorText===''? false : true}
                  helperText={errorText}
                  autoComplete='off'
                  onChange={(e: any) => {
                    setContent("")
                    getAutocomplete(e)
                  }}
                />
              )}
            />
            :
            <StyledTextField
              name={locationInfoType[type]}
              label={locationInfoType[type]}
              value={content}
              onChange={(e:any) => setContent(e.target.value)}
              error = {errorText===''? false : true}
              helperText={errorText}
            />
          }
        </DialogContent>
			</StyledDialog>
    </Grid>
  );
}