import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import WarningIcon from '@material-ui/icons/Warning';

import { ExistingTable } from './Tables';
import { BIContext, BusinessInfoContext } from '@/contexts/BusinessInfo';
import { BusinessLocation } from '@/constants/localInterfaces';
import { useAxiosPatch, useAxiosPost } from '@/hooks/axios';
import Loader from '@/components/Sales/Loader';
import { StyledConfirmDateDialog, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import FullScreen from '@/components/generic/FullScreen';
import LocationsEditForm from '@/components/form/forms/LocationsEditForm';
import { LocationUtil } from '@/utils/location.util';
import { editLocationFormatting } from '@/utils/formatting';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';

const useStyles = makeStyles({
  noiSubmittedBox: {
    display: 'flex',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #F9F1C6',
    backgroundColor: '#FAF3CA',
    color: '#785400',
    marginBottom: '20px',
  },
  warningIcon: {
    color: '#785400'
  },
  noiSubmittedBoxText: {
    fontSize: '16px', 
    fontWeight: 600
  }
})

export default function ViewLocation({rowData}: {rowData: IBusinessLocationValues}) {

  return (
    <Grid container spacing={3}>
      <Grid item container spacing={1} xs={12}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Address of sales premises from which restricted e-substances are sold</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Address 1</Typography>
          <Typography variant="body1">{rowData.addressLine1}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Address 2</Typography>
          <Typography variant="body2">{rowData.addressLine2}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">City</Typography>
          <Typography variant="body1">{rowData.city}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Postal Code</Typography>
          <Typography variant="body2">{rowData.postal}</Typography>
        </Grid>
      </Grid>
      <Grid item container spacing={1} xs={12}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Business Contact Info of sales premises from which restricted e-substances are sold</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Business Email Address</Typography>
          <Typography variant="body1">{rowData.email}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Business Phone Number</Typography>
          <Typography variant="body2">{rowData.phone}</Typography>
        </Grid>
      </Grid>
      <Grid item container spacing={1} xs={12}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Please state if persons under 19 years of age are permitted on the sales premises</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Underage Allowed</Typography>
          <Typography variant="body1">{rowData.underage}</Typography>
        </Grid>
        {
          rowData.underage_other
            ?
          <Grid item xs={6}>
            <Typography variant="subtitle2">Underage Other Option</Typography>
            <Typography variant="body2">{rowData.underage_other}</Typography>
          </Grid>
            :
              null
        }
      </Grid>
      <Grid item container spacing={1} xs={12}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Which Regional Health Authority is the sales premises located in</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Health Authority</Typography>
          <Typography variant="body1">{rowData.health_authority}</Typography>
        </Grid>
        {
          rowData.health_authority_other
            ?
          <Grid item xs={6}>
            <Typography variant="subtitle2">Health Authority Other Option</Typography>
            <Typography variant="body2">{rowData.health_authority_other}</Typography>
          </Grid>
            :
              null
        }
      </Grid>
      <Grid item container spacing={1} xs={12}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Do you produce, formulate, package, repackage, or prepare restricted e-substances for sale from this sales premises?</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2">Manufacturing Location</Typography>
          <Typography variant="body1">{rowData.manufacturing}</Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}