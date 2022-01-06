import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, CircularProgress, Grid, Typography, Paper } from '@material-ui/core';
import { StyledButton, StyledTable } from 'vaping-regulation-shared-components';
import { useAxiosGet } from '@/hooks/axios';
import { CSVLink } from 'react-csv';
import SaveAltIcon from '@material-ui/icons/SaveAlt'

import { BusinessLocationHeaders } from '@/constants/localEnums';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import { BusinessDetails } from '@/constants/localInterfaces';
import { BusinessInfoContext } from '@/contexts/BusinessInfo';

const useStyles = makeStyles({
  title: {
    color: '#0F327F',
    paddingBottom: '30px',
    paddingTop: 0,
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem 1.4rem 0rem 1.4rem',
    marginBottom: '30px'
  },
  description: {
    color: '#565656',
    paddingBottom: '20px'
  },
  boxTitle: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: '22px',
  },
  boxHeader: {
    fontSize: '17px',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '15px',
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
  boxDescription: {
    fontSize: '14px',
    color: '#3A3A3A',
    lineHeight: '20px',
    paddingBottom: '15px',
  },
  boxRow: {
    display: 'flex',
    paddingBottom: '20px',
  },
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  csvLink: {
    textDecoration: 'none',
  },
  rowTitle: {
    fontSize: '14px',
    color: '#424242',
    width: '300px'
  },
  rowContent: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#3A3A3A',
  },
  editButton: {
    fontSize: '14px',
    width: '150px',
    minWidth: '150px',
    maxHeight: '26px',
  },
  tableWrapper: {
    marginBottom: '20px',
  },
})


export default function MyBusinessSubmission () {
  const classes = useStyles();
  const history = useHistory();

  const [{ data: business, loading }] = useAxiosGet(`/business?includes=locations`);
  const [businessInfo, setBusinessInfo] = useContext(BusinessInfoContext);
  const [details, setDetails] = useState<BusinessDetails>();
  const [locations, setlocations] = useState<Array<IBusinessLocationValues>>();

  useEffect(() => {
    if (business) {
      setDetails(business);
      setlocations(business.locations)
    }
  }, [business]);

  return (
    <div>
      <Typography variant='h5' className={classes.title}>My Business</Typography>
      {
        loading ? <CircularProgress /> :
        details
          ?
            <Paper variant='outlined' className={classes.box}>
              <Grid container justify='space-between'>
                <Grid className={classes.actionsWrapper} item xs={12}>
                  <Typography paragraph variant='h6'>Business Details</Typography>
                  <StyledButton
                    onClick={() => history.push('/business/details')}
                    className={classes.editButton}
                    variant='outlined'
                  >
                    Edit
                  </StyledButton>
                </Grid>

                <Grid item xs={6}>
                  <Typography paragraph variant='body1'>Legal name of business</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography paragraph variant='subtitle1'>{details.legalName}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography paragraph variant='body1'>Name under which business is conducted</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography paragraph variant='subtitle1'>{details.businessName}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography paragraph variant='body1'>Business address line 1</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography paragraph variant='subtitle1'>{details.addressLine1}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography paragraph variant='body1'>City</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography paragraph variant='subtitle1'>{details.city}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography paragraph variant='body1'>Postal Code</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography paragraph variant='subtitle1'>{details.postal}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography paragraph variant='body1'>Business address line 2</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography paragraph variant='subtitle1'>{details.addressLine2}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography paragraph variant='body1'>Business email</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography paragraph variant='subtitle1'>{details.email}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography paragraph variant='body1'>Business phone number</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography paragraph variant='subtitle1'>{details.phone}</Typography>
                </Grid>

              </Grid>
            </Paper>
          :
        null
      }
      {
        locations?.length
          ?
            <div className={classes.box}>
              <div className={classes.boxHeader}>
                Business Locations
              </div>
              <div className={classes.actionsWrapper}>
                <div className={classes.boxDescription}>You have {locations.length} retail entries.</div>
                <CSVLink
                  headers={Object.keys(BusinessLocationHeaders)}
                  data={locations.map((l) => {
                    return [l.addressLine1, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
                  })}
                  filename={'business_locations.csv'} className={classes.csvLink} target='_blank'>
                  <StyledButton variant='outlined'>
                    <SaveAltIcon className={classes.buttonIcon} />
                    Download CSV
                  </StyledButton>
                </CSVLink>
              </div>
              <div className={classes.tableWrapper}>
                <StyledTable
                  columns={[
                    {title: 'Address 1', field: 'addressLine1'},
                    {title: 'Address 2', field: 'addressLine2'},
                    {title: 'Postal Code', field: 'postal'},
                    {title: 'City', field: 'city'},
                    {title: 'Business Phone', field: 'phone'},
                    {title: 'Business email', field: 'email'},
                    {title: 'Health Authority', field: 'health_authority'},
                    {title: 'Doing Business As', field: 'doingBusinessAs'},
                    {title: 'Minors Allowed', render: (rowData: IBusinessLocationValues) => rowData.underage === 'other' && rowData.underage_other ? `${rowData.underage_other}` : `${rowData.underage}`},
                    {title: 'Manufacturing  Premises', field: 'manufacturing'}
                  ]}
                  data={locations}
                />
              </div>
            </div>
          :
            null
      }
    </div>
  )
}
