import React, { ChangeEvent, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { FormikHelpers, useFormikContext } from 'formik';
import { Grid, InputAdornment, makeStyles, Tooltip, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { StyledTextField, StyledRadioGroup, locationTypeOptions } from 'vaping-regulation-shared-components';
import Autocomplete from '@mui/material/Autocomplete';
import { AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import RequiredFieldLabel from '@/components/generic/RequiredFieldLabel';
import { useAxiosGet } from '@/hooks/axios';
import { BCGeocoderAutocompleteData } from '@/constants/localInterfaces';
import { GeoCodeUtil } from '@/utils/geoCoder.util';

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

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
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

const HealthAuthorities: { [key: string]: string } = {
  fraser: 'Fraser Health',
  interior: 'Interior Health',
  island: 'Island Health',
  northern: 'Northern Health',
  coastal: 'Vancouver Coastal Health',
  other: 'Other (e.g. Out of Province)',
};

function BusinessLocationInputs({formikValues, formikHelpers }: {formikValues: IBusinessLocationValues, formikHelpers: FormikHelpers<IBusinessLocationValues>}) {

  const { values } = useFormikContext<IBusinessLocationValues>();
  const [ predictions, setPredictions ] = useState<Array<BCGeocoderAutocompleteData>>([]);
  const [ autocompleteOptions, setAutocompleteOptions ] = useState<Array<string>>([]);
  const [{ data, error, loading }, getSuggestions] = useAxiosGet('', { manual: true })
  const [{ data: healthAuthority, error: haError, loading: haLoading }, determineHealthAuthority] = useAxiosGet('', { manual: true })
  
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
      setPredictions(data.features)
      setAutocompleteOptions(data.features.map((e: BCGeocoderAutocompleteData) => e.properties.fullAddress))
    }    
  }, [data])

  useEffect(() => {
    if(healthAuthority) {
      const haName = HealthAuthorities[healthAuthority.toLowerCase()];
      formikHelpers.setFieldValue('health_authority', healthAuthority.toLowerCase());
      formikHelpers.setFieldValue('health_authority_display', haName);
    }
  }, [healthAuthority]);

  const handleAutocompleteSelect = ( value: any, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<any>) => {
    const fullLocation = predictions.find(e => e.properties.fullAddress === value)
    formikHelpers.setFieldValue('addressLine1', fullLocation ? fullLocation.properties.fullAddress : '')
    formikHelpers.setFieldValue('geoAddressConfidence', fullLocation.properties.precisionPoints)
    formikHelpers.setFieldValue('city', fullLocation.properties.localityName)
    formikHelpers.setFieldValue('longitude', fullLocation.geometry.coordinates[0])
    formikHelpers.setFieldValue('latitude', fullLocation.geometry.coordinates[1])
    
    if (fullLocation) {
      doDetermineHealthAuthority(fullLocation.geometry.coordinates[0], fullLocation.geometry.coordinates[1]);
    }
  }
  
  const getAutocomplete = (e: any) => {
    getSuggestions({url: GeoCodeUtil.getAutoCompleteUrl(e.target.value)})
  }

  const doDetermineHealthAuthority = (long: number, lat: number) => {
    determineHealthAuthority({url: `/location/determine-health-authority?lat=${lat}&long=${long}`})
  }

  const resetFieldsOnChange = () => {
    formikHelpers.setFieldValue('addressLine1', '')
    formikHelpers.setFieldValue('city', '')
    formikHelpers.setFieldValue('postal', '')
    formikHelpers.setFieldValue('geoAddressConfidence', '')
    formikHelpers.setFieldValue('latitude', '')
    formikHelpers.setFieldValue('longitude', '')
  }

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
                  getAutocomplete(e)
                }}
                name="addressLine1"
                fullWidth 
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
          <StyledTextField
            label="The name this location is doing business as"
            name="doingBusinessAs"
            fullWidth
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
        Please state if persons under 19 years of age are permitted on the sales premises <span style={{color: 'red'}}>*</span>
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
        <a href="https://www2.gov.bc.ca/gov/content/data/geographic-data-services/land-use/administrative-boundaries/health-boundaries" target="_blank" rel="noopener noreferrer">following link</a>
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
    </Root>
  );
}

export default BusinessLocationInputs;
