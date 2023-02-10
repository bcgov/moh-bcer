import React, {useState, useEffect, ChangeEvent} from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import {IconButton, Tooltip, Grid, TextField, InputAdornment} from '@material-ui/core';
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
import {StyledDialog} from 'vaping-regulation-shared-components';
import { StyledTextField, StyledRadioGroup, locationTypeOptions } from 'vaping-regulation-shared-components';
import { BCGeocoderAutocompleteData } from '@/constants/localInterfaces';
import { useAxiosGet } from '@/hooks/axios';
import { FormikHelpers, useFormikContext } from 'formik';
import SearchIcon from '@material-ui/icons/Search';
import { GeoCodeUtil } from '@/util/geoCoder.util';

interface StyledEditDialogProps {
  type: string;
  saveChange?: (data:string) => void
}

//This is the StyledEditDialog for the following location information on Location Details page, it validates the user's input and send the new content back to the StyledEditableTextField component
// addressLine1 || postal || webpage || phone || email || underage || manufacturing
export default function StyledEditDialog({type, saveChange}:StyledEditDialogProps) {
  const [content, setContent] = useState('');
	const [open, setOpen] = useState(false);
  const [errorText, seterrorText] = useState('');

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
    saveChange(content)
    setOpen(false);
  }

  async function cancelContentChange() {
    saveChange("")
    setOpen(false);
  }


  //auto complete
  const [ autocompleteOptions, setAutocompleteOptions ] = useState<Array<string>>([]);
  const [{ data, error, loading }, getSuggestions] = useAxiosGet('', { manual: true })

  useEffect(() => {
    if (data && data.features?.length > 0) {
      setPredictions(data.features)
      setAutocompleteOptions(data.features.map((e: BCGeocoderAutocompleteData) => e.properties.fullAddress))
    }    
  }, [data])

  const [ predictions, setPredictions ] = useState<Array<BCGeocoderAutocompleteData>>([]);
  const [{ data: healthAuthority, error: haError, loading: haLoading }, determineHealthAuthority] = useAxiosGet('', { manual: true })
  const doDetermineHealthAuthority = (long: number, lat: number) => {
    determineHealthAuthority({url: `/location/determine-health-authority?lat=${lat}&long=${long}`})
  }



  const getAutocomplete = (e: any) => {
    getSuggestions({url: GeoCodeUtil.getAutoCompleteUrl(e.target.value)})
  }

  const handleAutocompleteSelect = ( value: any, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any>) => {
    const fullLocation = predictions.find(e => e.properties.fullAddress === value)
    // formikHelpers.setFieldValue('addressLine1', fullLocation ? fullLocation.properties.fullAddress : '')
    // formikHelpers.setFieldValue('geoAddressConfidence', fullLocation.properties.precisionPoints)
    // formikHelpers.setFieldValue('city', fullLocation.properties.localityName)
    // formikHelpers.setFieldValue('longitude', fullLocation.geometry.coordinates[0])
    // formikHelpers.setFieldValue('latitude', fullLocation.geometry.coordinates[1])
    
    // if (fullLocation) {
    //   doDetermineHealthAuthority(fullLocation.geometry.coordinates[0], fullLocation.geometry.coordinates[1]);
    // }
    // console.log("value: ")
    // console.log(value)
    // console.log("reason: ")
    // console.log(reason)
    // console.log("details: ")
    // console.log(details)
    console.log(fullLocation)
  }

  return (
    <Grid>
      <Tooltip title="Edit" placement="top">
            <IconButton
              style={{
                color: '#0053A5',
              }}
              onClick={() => setOpen(true)}
            >
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
              onChange={(e: ChangeEvent<{}>, value: any, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any> ) => handleAutocompleteSelect(value, reason, details)}
              renderInput={(params: any) => (
                <StyledTextField 
                  {...params}
                  name={type}
                  label={"Address"}
                  error = {errorText===''? false : true}
                  helperText={errorText}
                  autoComplete='off'
                  onChange={(e: any) => {
                    //  resetFieldsOnChange()
                    getAutocomplete(e)
                    setContent(e.target.value)
                  
                  }}
                />
              )}
            />
            :
            <StyledTextField
              name={type}
              label={type}
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