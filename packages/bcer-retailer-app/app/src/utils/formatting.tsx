import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import { ApiOperation } from '@/constants/localEnums';

export function formatError (error: any) {
  const data = error?.response?.data;
  return (
    <Box>
      {data ?
        <>
          <Typography variant='body1'>{data.message ? data.message : ''}</Typography>
          {data.id && <Typography variant='body2'>Error ID: {data.id}</Typography>}
        </>
        : <><Typography variant='body1'>Unknown Error</Typography></>
      }
    </Box>
  );
}

/**
 * Function that maps the 'Underage' and 'Health Authority' fields correctly from the database location object to the form location object.
 * Contains checks for each param in the object to initiialize the object key to a blank string, as all fields need 
 * to be present on the object, otherwise validation breaks.
 * As this function is used for the edit location form and that form can be used to add missing data, if we just pass location to Formik as initialValues,
 * whatever field is missing will never validate on submit until after it has been touched at least once due to having a missing key.
 * @param location Location data from the context
 * @returns Object:IBusinessLocationValues - a location object that has been converted to be compatable with the edit form
 */
export function editLocationFormatting (location: IBusinessLocationValues):IBusinessLocationValues {
  let formattedLocation = {
    id: location.id ? location.id : '',
    addressLine1: location.addressLine1 ? location.addressLine1 : '' ,
    addressLine2: location.addressLine2 ? location.addressLine2 : '',
    postal: location.postal ? location.postal : '',
    city: location.city ? location.city : '',
    phone: location.phone ? location.phone : '',
    email: location.email ? location.email : '',
    underage: '',
    underage_other: '',
    health_authority: '',
    health_authority_other: '',
    doingBusinessAs: location.doingBusinessAs ? location.doingBusinessAs : '',
    manufacturing: '',
    tableData: location.tableData ? location.tableData : {id: undefined},
    error: location.error ? location.error : undefined
  }

  const underageMatchString = location.underage.toLowerCase();
  if (underageMatchString.includes('yes')) {
    formattedLocation.underage = 'Yes';
  } else if (underageMatchString.includes('no')) {
    formattedLocation.underage = 'No';
  } else {
    formattedLocation.underage = 'other';
    if (location.underage_other) {
      formattedLocation.underage_other = location.underage_other;
    } else {
      formattedLocation.underage_other = location.underage;
    }
  } 

  const healthAuthorityMatchString = location.health_authority.toLowerCase();
  if (healthAuthorityMatchString.includes('viha') || healthAuthorityMatchString.includes('island')) {
    formattedLocation.health_authority = 'island';
  } else if (healthAuthorityMatchString.includes('fha') || healthAuthorityMatchString.includes('fraser')) {
    formattedLocation.health_authority = 'fraser';
  } else if (healthAuthorityMatchString.includes('iha') || healthAuthorityMatchString.includes('interior')) {
    // Overlap with VIHA, however all cases of VIHA should get caught first, leaving all others with the string 'iha' to be interior only
    formattedLocation.health_authority = 'interior';
  } else if (healthAuthorityMatchString.includes('vcha') || healthAuthorityMatchString.includes('coastal')) {
    formattedLocation.health_authority = 'coastal';
  } else if (healthAuthorityMatchString.includes('nha') || healthAuthorityMatchString.includes('northern')) {
    formattedLocation.health_authority = 'northern';
  } else {
    //TODO: for now just put the location.health_authority value back into the formatted object. Eventually once the 'other' option is ready
    formattedLocation.health_authority = 'other';
    if (location.health_authority_other) {
      formattedLocation.health_authority_other = location.health_authority_other;
    } else {
      formattedLocation.health_authority_other = location.health_authority;
    }
  }

  const manufacturingMatchString = location.manufacturing.toLowerCase();
  if (manufacturingMatchString === 'yes' || manufacturingMatchString === 'no') {
    // explicitly set formattedLocation.manufacturing to manufacturingMatchString 
    // as this will cover cases where the user uploaded a CSV with 'yes', 'Yes', and 'YES' variants
    formattedLocation.manufacturing = manufacturingMatchString;
  }

  return formattedLocation
}

export class ErrorMessageFormat {
  static salesError(error: any, generationPoint?: ApiOperation): JSX.Element {
    const data = error?.response?.data;
    if (
      data.message?.includes('UQ_9b83599a9b9049d48be7ffaab45')
    ) {
      data.message =
        'The UPC field must be unique for each product in your Sales Report. If UPC not available, then leave the field blank.';
    }
    return formatError(error);
  }
}
