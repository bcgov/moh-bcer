import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, makeStyles } from '@mui/material';
import { StyledSelectField, StyledTextField } from 'vaping-regulation-shared-components'
import RequiredFieldLabel from '@/components/generic/RequiredFieldLabel';
import { provinceOptions } from '@/constants/arrays';

const PREFIX = 'BusinessDetailsEditInputs';

const classes = {
  form: `${PREFIX}-form`,
  formTitle: `${PREFIX}-formTitle`,
  gridItemLeft: `${PREFIX}-gridItemLeft`,
  gridItemRight: `${PREFIX}-gridItemRight`
};

const StyledGrid = styled(Grid)({
  [`& .${classes.form}`]: {
    padding: '25px 20px 15px 20px',
    border: '1px solid #CDCED2',
    borderRadius: '5px',
    backgroundColor: '#fff'
  },
  [`& .${classes.formTitle}`]: {
    fontSize: '17px',
    fontWeight: 600,
    paddingBottom: '24px'
  },
  [`& .${classes.gridItemLeft}`]: {
    padding: '0px 15px 0px 0px'
  },
  [`& .${classes.gridItemRight}`]: {
    padding: '0px 0px 0px 15px'
  }
});

// BIG TODO: update with the 'is your location manufacturing' fields once Noel's PR is in
export default function BusinessDetailsEditInputs() {


  return (
    <StyledGrid container >

      <Grid className={classes.gridItemLeft} item xs={12} md={6}>
        <StyledTextField
          label="Business legal name"
          name="legalName"
          fullWidth
        />
      </Grid>

      <Grid className={classes.gridItemRight} item xs={12} md={6}>
        <StyledTextField
          label="Name under which business is conducted"
          name="businessName"
          fullWidth
        />
      </Grid>

      <Grid className={classes.gridItemLeft} item xs={12} md={6}>
        <StyledTextField
          label="Business address line 1"
          name="addressLine1"
          fullWidth
        />
      </Grid>

      <Grid className={classes.gridItemRight} item xs={12} md={6}>
        <StyledTextField
          label="Business address line 2"
          name="addressLine2"
          fullWidth
        />
      </Grid>

      <Grid className={classes.gridItemLeft} item xs={12} md={6}>
        <StyledTextField
          label="City"
          name="city"
          fullWidth
        />
      </Grid>

      <Grid container className={classes.gridItemRight} item xs={12} md={6} spacing={2}>

        <Grid item xs={6}>
          <StyledSelectField
            label={<RequiredFieldLabel label="Province"/>}
            name="province"
            options={provinceOptions}            
          />
        </Grid>

        <Grid item xs={6}>
          <StyledTextField
            label="Postal code"
            name="postal"            
          />
        </Grid>
      </Grid>

      <Grid className={classes.gridItemLeft} item xs={12} md={6}>
        <StyledTextField
          label="Business phone number"
          name="phone"
          fullWidth
        />
      </Grid>
      <Grid className={classes.gridItemRight} item xs={12} md={6}>
        <StyledTextField
          label="Business email"
          name="email"
          fullWidth
        />
      </Grid>

      <Grid className={classes.gridItemLeft} item xs={12} md={6}>
        <StyledTextField
          label="Business web page"
          name="webpage"
          fullWidth
        />
      </Grid>

    </StyledGrid>
  );
}