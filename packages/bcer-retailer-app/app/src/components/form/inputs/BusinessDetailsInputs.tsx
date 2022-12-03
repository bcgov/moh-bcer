import React from 'react';
import { Grid, Typography, styled } from '@material-ui/core';
import { StyledSelectField, StyledTextField } from 'vaping-regulation-shared-components'
import RequiredFieldLabel from '@/components/generic/RequiredFieldLabel';
import { provinceOptions } from '@/constants/arrays';

const FormBorderGrid = styled(Grid)({
  padding: '25px 20px 15px 20px',
  border: '1px solid #CDCED2',
  borderRadius: '5px',
  backgroundColor: '#fff'
})

const FormTitle = styled(Typography)({
  fontSize: '17px',
  fontWeight: 600,
  paddingBottom: '24px'
})

function BusinessDetailsInputs() {
  return (
    <FormBorderGrid container spacing={2}>
      <Grid item xs={12}>
        <FormTitle variant='h6'>
          Please confirm your business details below
        </FormTitle>
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="Business legal name"/>}
          name="legalName"
          fullWidth
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="Name under which business is conducted"/>}
          name="businessName"
          fullWidth
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="Business address line 1"/>}
          name="addressLine1"
          fullWidth
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledTextField
          label="Business address line 2"
          name="addressLine2"
          fullWidth
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="City"/>}
          name="city"
          fullWidth
        />
      </Grid>

      <Grid container item xs={12} md={6} spacing={2}>  
        
        <Grid item xs={6}>
          <StyledSelectField
            label={<RequiredFieldLabel label="Province"/>}
            name="province"
            options={provinceOptions}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <StyledTextField
            label={<RequiredFieldLabel label="Postal code"/>}
            name="postal"          
          />
        </Grid>

      </Grid>

      <Grid item xs={12} md={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="Business phone number"/>}
          name="phone"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <StyledTextField
          label={<RequiredFieldLabel label="Business email"/>}
          name="email"
          fullWidth
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <StyledTextField
          label="Business web page"
          name="webpage"
          fullWidth
        />
      </Grid>
    </FormBorderGrid>
  );
}

export default BusinessDetailsInputs;
