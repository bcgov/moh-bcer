import React from 'react';
import { useFormikContext } from 'formik';
import { Grid, makeStyles } from '@material-ui/core';
import { StyledTextField, StyledRadioGroup } from 'vaping-regulation-shared-components';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import RequiredFieldLabel from '@/components/generic/RequiredFieldLabel';

const useStyles = makeStyles({
  groupHeader: {
    fontSize: '17px',
    fontWeight: 600,
    padding: '10px 0px'
  },
  headerDescription:{
    fontSize: '14px',
    fontWeight: 500,
    width: '800px'
  },
  gridItemLeft: {
    padding: '0px 15px 0px 0px'
  },
  gridItemRight: {
    padding: '0px 0px 0px 15px'
  },
  optionalWrapper:{
    display: 'flex',
    alignItems: 'flex-end'
  },
  radioWrapper: {
    padding: '0px 20px 15px 0px'
  },
  optionalField: {
  }
})

function BusinessLocationInputs() {
  const classes = useStyles();
  const { values } = useFormikContext<IBusinessLocationValues>();
  return (
    <>
      <div className={classes.groupHeader}>Address of sales premises from which restricted e-substance sold</div>
      <Grid container spacing={2}>

        <Grid item xs={12} md={6} className={classes.gridItemLeft}>
          <StyledTextField
            label={<RequiredFieldLabel label="Business address line 1"/>}
            name="addressLine1"
            fullWidth
          />
        </Grid>
        
        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <StyledTextField
            label="Business address line 2"
            name="addressLine2"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6} className={classes.gridItemLeft}>
          <StyledTextField
            label={<RequiredFieldLabel label="Postal Code"/>}
            name="postal"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <StyledTextField
            label={<RequiredFieldLabel label="City"/>}
            name="city"
            fullWidth
          />
        </Grid>

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

        <Grid item xs={12} md={6} className={classes.gridItemRight}>
          <StyledTextField
            label="The name this location is doing business as"
            name="doingBusinessAs"
            fullWidth
          />
        </Grid>

      </Grid>

      <div className={classes.groupHeader} >
        Please state if persons under 19 years of age are permitted on the sales premises <span style={{color: 'red'}}>*</span>
        <div className={classes.headerDescription} >
          If your retail location has unique circumstances surrounding age-restriction, please select "other" and describe in the comment box below.
        </div>
      </div>
      
      <div className={classes.optionalWrapper} >
        <div className={classes.radioWrapper}>
          <StyledRadioGroup
            name="underage"
            options={[
              {label: 'Yes', value: 'Yes'},
              {label: 'No', value: 'No'},
              {label: 'Other', value: 'other'}
            ]}
          />
        </div>
        <div className={classes.optionalField}>
          {values.underage === 'other' && <StyledTextField name="underage_other" placeholder="Please Specify" fullWidth={false}/>}
        </div>
      </div>

      <div className={classes.groupHeader}>
        Which regional health authority is the sales premises located in? A map of the regional health authorities can be found at the&nbsp;
        <a href="https://www2.gov.bc.ca/gov/content/data/geographic-data-services/land-use/administrative-boundaries/health-boundaries" target="_blank" rel="noopener noreferrer">following link</a>
        <span style={{color: 'red'}}> *</span>
      </div>
      <StyledRadioGroup
        name="health_authority"
        options={[
          {label: 'Fraser Health', value: 'fraser'},
          {label: 'Interior Health', value: 'interior'},
          {label: 'Island Health', value: 'island'},
          {label: 'Northern Health', value: 'northern'},
          {label: 'Vancouver Coastal Health', value: 'coastal'},
        ]}
      />

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
    </>
  );
}

export default BusinessLocationInputs;
