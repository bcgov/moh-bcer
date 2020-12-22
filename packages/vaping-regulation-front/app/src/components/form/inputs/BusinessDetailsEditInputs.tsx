import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import { StyledTextField } from 'vaping-regulation-shared-components'

const useStyles = makeStyles({
  form: {
    padding: '25px 20px 15px 20px',
    border: '1px solid #CDCED2',
    borderRadius: '5px',
    backgroundColor: '#fff'
  },
  formTitle: {
    fontSize: '17px',
    fontWeight: 600,
    paddingBottom: '24px'
  },
  gridItemLeft: {
    padding: '0px 15px 0px 0px'
  },
  gridItemRight: {
    padding: '0px 0px 0px 15px'
  }
})

// BIG TODO: update with the 'is your location manufacturing' fields once Noel's PR is in
export default function BusinessDetailsEditInputs() {
  const classes = useStyles();

  return (
    <Grid container >

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

      <Grid className={classes.gridItemRight} item xs={12} md={6}>
        <StyledTextField
          label="Postal code"
          name="postal"
          fullWidth
        />
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

    </Grid>
  );
}