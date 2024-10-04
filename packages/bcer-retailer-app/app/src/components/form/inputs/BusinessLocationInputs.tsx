import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { FormikHelpers, useFormikContext } from 'formik';
import { Grid, InputAdornment, Tooltip, TextField, Typography, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SearchIcon from '@mui/icons-material/Search';
import { StyledTextField, StyledRadioGroup, locationTypeOptions, StyledConfirmDialog, InputFieldLabel } from 'vaping-regulation-shared-components';
import Autocomplete from '@mui/material/Autocomplete';
import { AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import RequiredFieldLabel from '@/components/generic/RequiredFieldLabel';
import { useAxiosGet } from '@/hooks/axios';
import { BCGeocoderAutocompleteData } from '@/constants/localInterfaces';
import { GeoCodeUtil } from '@/utils/geoCoder.util';

import { debounce } from 'lodash';
import axios, { CancelTokenSource } from 'axios';

const PREFIX = 'BusinessLocationInputs';

const classes = {
  groupHeader: `${PREFIX}-groupHeader`,
  headerDescription: `${PREFIX}-headerDescription`,
  gridItemLeft: `${PREFIX}-gridItemLeft`,
  gridItemRight: `${PREFIX}-gridItemRight`,
  optionalWrapper: `${PREFIX}-optionalWrapper`,
  radioWrapper: `${PREFIX}-radioWrapper`,
  autocompleteField: `${PREFIX}-autocompleteField`,
  helpIcon: `${PREFIX}-helpIcon`,
  tooltip: `${PREFIX}-tooltip`,
  arrow: `${PREFIX}-arrow`
};

const Root = styled('div')({
  [`& .${classes.groupHeader}`]: {
    display: 'flex',
    fontSize: '17px',
    fontWeight: 600,
    padding: '10px 0px'
  },
  [`& .${classes.headerDescription}`]: {
    fontSize: '14px',
    fontWeight: 500,
    width: '800px'
  },
  [`& .${classes.gridItemLeft}`]: {
    padding: '0px 15px 0px 0px'
  },
  [`& .${classes.gridItemRight}`]: {
    padding: '0px 0px 0px 15px'
  },
  [`& .${classes.optionalWrapper}`]: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  [`& .${classes.radioWrapper}`]: {
    padding: '0px 20px 15px 0px'
  },
  [`& .${classes.autocompleteField}`]: {
    '& .MuiAutocomplete-inputRoot': {
      padding: '0px 12px 0px 0px !important'
    }
  },
  [`& .${classes.helpIcon}`]: {
    fontSize: '22px',
    color: '#0053A4'
  },
  [`& .${classes.tooltip}`]: {
    backgroundColor: '#0053A4',
    fontSize: '14px'
  },
  [`& .${classes.arrow}`]: {
    color: '#0053A4'
  }
});

const LabelContainer = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'normal',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: '#0053A4',
  padding: '0 4px',
  marginLeft: theme.spacing(1),
  verticalAlign: 'middle',
}));

const HealthAuthorities: { [key: string]: string } = {
  fraser: 'Fraser Health',
  interior: 'Interior Health',
  island: 'Island Health',
  northern: 'Northern Health',
  coastal: 'Vancouver Coastal Health',
  other: 'Other (e.g. Out of Province)',
};

function BusinessLocationInputs({formikValues, formikHelpers }: {formikValues: IBusinessLocationValues, formikHelpers: FormikHelpers<IBusinessLocationValues>}) {

  const { values, handleBlur } = useFormikContext<IBusinessLocationValues>();
  const [ predictions, setPredictions ] = useState<Array<BCGeocoderAutocompleteData>>([]);
  const [ autocompleteOptions, setAutocompleteOptions ] = useState<Array<string>>([]);
  const [{ data, error, loading }, getSuggestions] = useAxiosGet('', { manual: true })
  const [{ data: healthAuthority, error: haError, loading: haLoading }, determineHealthAuthority] = useAxiosGet('', { manual: true })
  const [{ data: addressExistsData }, checkAddressExists] = useAxiosGet('', { manual: true });
  const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource | null>(null);
  const [duplicateWarningDialog, openDuplicateWarningDialog] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [editingField, setEditingField] = useState<string | null>(null);

  useEffect(() => {
    formikHelpers.setFieldValue('location_type', values.location_type? values.location_type: 'physical');
    if (values) {
      const haName = HealthAuthorities[values.health_authority.toLowerCase()];
      formikHelpers.setFieldValue('health_authority_display', haName);
    }
    if(values.underage === 'other'){
      values.underage ='Yes';
      values.underage_other ='';
    }
  }, [])

  useEffect(() => {
    if (data && data.features?.length > 0) {
      setPredictions(data.features);
      setAutocompleteOptions(data.features.map((e: BCGeocoderAutocompleteData) => e.properties.fullAddress));
    } else {
      setPredictions([]);
      setAutocompleteOptions([]);
    }
  }, [data]);

  useEffect(() => {
    if(healthAuthority) {
      const haName = HealthAuthorities[healthAuthority.toLowerCase()];
      formikHelpers.setFieldValue('health_authority', healthAuthority.toLowerCase());
      formikHelpers.setFieldValue('health_authority_display', haName);
    }
  }, [healthAuthority]);

  const docheckAddressExists = async(fullAddress: string) => {
    const addressExist = await checkAddressExists({ url: `/location/check-address-exists?address=${fullAddress}` });
    if (addressExist.data) {
      setWarningMessage("Warning: This is a duplicate address.");
    }else{
      setWarningMessage("");
    }
    openDuplicateWarningDialog(addressExist.data);
    formikHelpers.setFieldValue('addressExists', addressExist.data);
  }

  const doDetermineHealthAuthority = async(long: number, lat: number) => {
    determineHealthAuthority({url: `/location/determine-health-authority?lat=${lat}&long=${long}`})
  }

  const debouncedGetAutocomplete = useCallback(
    debounce((value: string) => {
      if (cancelTokenSource) { cancelTokenSource.cancel('Operation canceled due to new request.'); }
      const source = axios.CancelToken.source();
      setCancelTokenSource(source);
      getSuggestions({
        url: GeoCodeUtil.getAutoCompleteUrl(value),
        cancelToken: source.token,
      }).catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        }
      });
    }, 300),
    []
  )

  const resetFieldsOnChange = () => {
    formikHelpers.setFieldValue('addressLine1', '')
    formikHelpers.setFieldValue('city', '')
    formikHelpers.setFieldValue('postal', '')
    formikHelpers.setFieldValue('geoAddressConfidence', '')
    formikHelpers.setFieldValue('latitude', '')
    formikHelpers.setFieldValue('longitude', '')
  }
  
  const handleAutocompleteSelect = async (value: any, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any>) => {
    const fullLocation = predictions.find(e => e.properties.fullAddress === value);
    
    if (!fullLocation) { // Handle the case when no matching prediction is found
      console.log('No matching location found');
      formikHelpers.setFieldValue('addressLine1', value || '');
      formikHelpers.setFieldValue('geoAddressConfidence', '');
      formikHelpers.setFieldValue('city', '');
      formikHelpers.setFieldValue('longitude', '');
      formikHelpers.setFieldValue('latitude', '');
      return;
    }
  
    await docheckAddressExists((fullLocation.properties.fullAddress)); //check if this address exists in the database

    formikHelpers.setFieldValue('addressLine1', fullLocation.properties.fullAddress);
    formikHelpers.setFieldValue('geoAddressConfidence', fullLocation.properties.precisionPoints);
    formikHelpers.setFieldValue('city', fullLocation.properties.localityName);
    formikHelpers.setFieldValue('longitude', fullLocation.geometry.coordinates[0]);
    formikHelpers.setFieldValue('latitude', fullLocation.geometry.coordinates[1]);
    
    await doDetermineHealthAuthority(fullLocation.geometry.coordinates[0], fullLocation.geometry.coordinates[1]);
  }

  const handleFocus = (field: string) => {
    setEditingField(field);
  };

  const handleBlurOfDoingBusinessAs = (event:any) => {
    setEditingField(null);
    handleBlur(event);
  };

  return (
    <Root>
      <div className={classes.groupHeader}>
        Please state your type of location
      </div>
      <div className={classes.radioWrapper}>
        <StyledRadioGroup
          name="location_type"
          options={locationTypeOptions()}
        />
      </div>
      {(values.location_type === "physical" || values.location_type === "both") &&
      <div className={classes.groupHeader}>
        Address of sales premises from which restricted e-substance sold 
        <Tooltip classes={{tooltip: classes.tooltip, arrow: classes.arrow}} title="Type in your address and select the one that matches it the best. If you cannot find your address then please contact the Ministry of Health at vaping.info@gov.bc.ca" arrow>
          <HelpIcon className={classes.helpIcon}/>
        </Tooltip>
      </div>      
      }
      <Grid container spacing={2}>
        {(values.location_type === "physical" || values.location_type === "both") &&
        <Grid item xs={12} md={12} className={classes.gridItemLeft}>
          <Autocomplete             
            classes={{root: classes.autocompleteField}}
            options={autocompleteOptions} 
            freeSolo
            value={values.addressLine1}
            onChange={(e: ChangeEvent<{}>, value: any, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any> ) => handleAutocompleteSelect(value, reason, details)}
            renderInput={(params) => (
              <StyledTextField 
                {...params} 
                label={<RequiredFieldLabel label="Business address line 1"/>}
                InputProps={{ 
                  ...params.InputProps,
                  endAdornment: <InputAdornment position="end"><SearchIcon/></InputAdornment>,
                  type: 'search'
                }}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password'
                }}
                autoComplete='off'
                onChange={(e: any) => {
                  resetFieldsOnChange()
                  debouncedGetAutocomplete(e.target.value);
                }}
                name="addressLine1"
                fullWidth
                warningMessage={warningMessage}
              />
            )}
          />
        </Grid>
        }

        <Grid item xs={12}>
          <div className={classes.groupHeader}>Business Contact Info of sales premises from which restricted e-substance sold</div>
        </Grid>

        <Grid item xs={12} md={6} className={classes.gridItemLeft}>
          <StyledTextField
            label={<RequiredFieldLabel label="Business Email"/>}
            name="email"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <StyledTextField
            label={<RequiredFieldLabel label="Business Phone Number"/>}
            name="phone"
            fullWidth
          />
        </Grid>

        {(values.location_type === "physical" || values.location_type === "both") &&
        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <StyledTextField
            label={<RequiredFieldLabel label="City"/>}
            name="city"
            fullWidth
            disabled={true}
          />
        </Grid>
        }

        {(values.location_type === "physical" || values.location_type === "both") &&
        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <StyledTextField
            label={<RequiredFieldLabel label="Postal Code"/>}
            name="postal"
            fullWidth
          />
        </Grid> 
        }

        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <LabelContainer>
            <InputFieldLabel label="The name this location is doing business as" />
            {editingField === 'doingBusinessAs' && (
              <Tooltip title="This is the business name with the location. Enter only if the same business exists at more than one location (i.e., Shell Ltd Shelbourne)." arrow>
                <StyledIconButton name='doingBusinessAsTooltip' size="small">
                  <HelpOutlineIcon fontSize="small" />
                </StyledIconButton>
              </Tooltip>
            )}
          </LabelContainer>
          <StyledTextField
            name="doingBusinessAs"
            fullWidth
            onFocus={() => handleFocus('doingBusinessAs')}
            onBlur={handleBlurOfDoingBusinessAs}
          />
        </Grid>

        {(values.location_type === "online" || values.location_type === "both") &&
        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <StyledTextField 
            label = {<Typography>Businesss URL<span style={{color: 'red'}} > *</span>&nbsp;&nbsp;<b>Please note that your website must be age restricted</b></Typography>}         
            name="webpage"
            fullWidth
          />
        </Grid>
        }

      </Grid>
      {(values.location_type === "physical" || values.location_type === "both") &&
      <>
      <div className={classes.groupHeader} >
        Are persons under 19 years of age permitted on  the sales premises?<span style={{color: 'red'}}>*</span>
      </div>

      <div className={classes.optionalWrapper} >
        <div className={classes.radioWrapper}>
          <StyledRadioGroup
            name="underage"
            options={[
              {label: 'Yes', value: 'Yes'},
              {label: 'No', value: 'No'},
            ]}
          />
        </div>
      </div>      

      <div className={classes.groupHeader}>
        Which regional health authority is the sales premises located in? A map of the regional health authorities can be found at the&nbsp;
        <a href="https://www2.gov.bc.ca/gov/content/health/about-bc-s-health-care-system/partners/health-authorities/regional-health-authorities" target="_blank" rel="noopener noreferrer">following link</a>
        <span style={{color: 'red'}}> *</span>
      </div>
      {values.health_authority !== 'other' && (<><StyledTextField
        label={<RequiredFieldLabel label="Health Authority"/>}
        name="health_authority_display"
        fullWidth
        disabled={true}/>

      <TextField variant="standard" name="health_authority" type="hidden" /></>
      )}
      
      {values.health_authority === 'other' && <StyledTextField name="health_authority_other" placeholder="Please Specify" fullWidth={false}/>}
      </>
      }
      <div className={classes.groupHeader}>
        Do you produce, formulate, package, repackage or prepare restricted e-substances for sale from this sales premises? <span style={{color: 'red'}}>*</span>
      </div>
      <StyledRadioGroup
        defaultValue="none"
        name="manufacturing"
        default
        options={[
          {label: 'Yes', value: 'yes'},
          {label: 'No', value: 'no'},
        ]}
      />
      {duplicateWarningDialog &&
        <StyledConfirmDialog
          open={duplicateWarningDialog}
          setOpen={openDuplicateWarningDialog}
          confirmHandler={() => openDuplicateWarningDialog(false)}
          maxWidth='xs'
          dialogTitle='Duplicate Location Warning'
          dialogMessage={
            <Typography variant="body1">
              Warning: you are trying to create an account for an address that already exists in the system.
              If you recognize this address, please try to recover your previous account by contacting{' '}
              <a href="https://www.bceid.ca/clp/account_recovery.aspx" style={{ display: 'inline' }}>
                Service BC Help Desk
              </a>.
              If this is a brand new business location, please proceed.
            </Typography>
          }      
          checkboxLabel="I confirm this is a brand new business location."
          acceptButtonText="OK"
          showCancelButton={false}
        />
      }
    </Root>
  );
}

export default BusinessLocationInputs;
