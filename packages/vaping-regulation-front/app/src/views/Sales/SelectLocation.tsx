import React, { useEffect, useState, useContext } from 'react'
import { StyledButton } from 'vaping-regulation-shared-components';
import { Box, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { BusinessLocation } from '@/constants/localInterfaces';
import { SalesReportContext } from '@/contexts/SalesReport';
import { useAxiosGet } from '@/hooks/axios';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  description: {
    paddingBottom: '30px',
    paddingTop: '20px',
  },
  box: {
    display: 'flex',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #CDCED2',
    backgroundColor: '#fff',
    marginBottom: '20px',
  },
})

export default function SelectSalesLocation() {
  const history = useHistory();
  const classes = useStyles();

  const [entry, setEntry] = useState<string>('year');
  const [salesReport, setSalesReport] = useContext(SalesReportContext);
  const [{ loading: locationsLoading, error: locationsError, data: locations }, getLocations] = useAxiosGet('/location?includes=sales');
  const [outstanding, setOutstanding] = useState([]);
  const [filteredOutstanding, setFilteredOutstanding] = useState([]);
  const [submitted, setSubmitted] = useState([]);
  const [filteredSubmitted, setFilteredSubmitted] = useState([]);

  useEffect(() => {
    setSalesReport({
      year: '',
      locationId: '',
      address: '',
    });
    getLocations();
  }, []);

  useEffect(() => {
    if (locations) {
      const outstanding = locations.filter((l: BusinessLocation) => !l.sales || l.sales.length === 0);
      const submitted = locations.filter((l: BusinessLocation) => l?.sales.length > 0);
      setOutstanding(outstanding);
      setFilteredOutstanding(outstanding);
      setSubmitted(submitted);
      setFilteredSubmitted(submitted);
    }
  }, [locations]);

  const selectYear = (e: any) => {
    setSalesReport({ ...salesReport, year: e.currentTarget.value });
    setEntry('location');
  }

  const selectLocation = (e: any) => {
    const locationId = e.currentTarget.value;
    setSalesReport({
      ...salesReport,
      locationId,
      address: locations.find((l: any) => l.id === locationId).addressLine1,
    });
    history.push('/sales/submit');
  }

  const goBack = () => {
    if (entry === 'location') {
      setEntry('year');
    } else {
      history.goBack();
    }
  }
  
  const filterLocations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.currentTarget.value;
    if (searchQuery.length === 0) {
      setFilteredOutstanding(outstanding);
      setFilteredSubmitted(submitted);
    } else {
      const outstandingFiltered = outstanding.filter(location => {
        const fullString = `${location.addressLine1} ${location.city} ${location.postal} ${location.doingBusinessAs}`;
        return fullString.toLowerCase().includes(searchQuery.toLowerCase());
      });
      const submittedFiltered = submitted.filter(location => {
        const fullString = `${location.addressLine1} ${location.city} ${location.postal} ${location.doingBusinessAs}`;
        return fullString.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredOutstanding(outstandingFiltered);
      setFilteredSubmitted(submittedFiltered);
    }
  }

  return (
    <>
      <div>
        <StyledButton onClick={goBack}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Back
        </StyledButton>
        <Typography className={classes.title} variant='h5'>New Sales Report</Typography>
        <Grid container justify='center'>
          <Grid item xs={12} md={6}>
            {
              entry === 'year' &&
                <>
                  <Grid item xs={12}>
                    <Typography variant='subtitle1' className={classes.description} align='center'>
                      Select Year to Submit Sales Report
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box paddingY={1} textAlign='center'>
                      <StyledButton
                        onClick={selectYear}
                        variant='contained'
                        value='2020'
                      >
                        October 1, 2020 - September 30, 2021
                      </StyledButton>
                    </Box>
                  </Grid>
                </>
            }
            {
              entry === 'location' && 
              <>
                <Grid item xs={12}>
                  <TextField
                    variant='filled'
                    label='Search Locations'
                    onChange={filterLocations}
                    fullWidth
                  ></TextField>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='subtitle1' className={classes.description} align='center'>
                    Select Location
                  </Typography>
                </Grid>
                {
                  filteredOutstanding.map((location: any) => (
                    <Grid item xs={12}>
                      <Box paddingY={1} textAlign='center'>
                        <StyledButton
                          key={location.id}
                          onClick={selectLocation}
                          variant='contained'
                          value={location.id}
                        >
                          {location.addressLine1}
                        </StyledButton>
                      </Box>
                    </Grid>
                  ))
                }
                {
                  filteredSubmitted.length > 0 ?
                    <Grid item xs={12}>
                      <Typography variant='subtitle1' className={classes.description} align='center'>
                        Previously Submitted Sales Reports
                      </Typography>
                    </Grid>
                    : null
                }
                {
                  filteredSubmitted.map((location: any) => (
                    <Grid item xs={12}>
                      <Box paddingY={1} textAlign='center'>
                        <StyledButton
                          key={location.id}
                          variant='contained'
                          disabled
                          value={location.id}
                        >
                          {location.addressLine1}
                        </StyledButton>
                      </Box>
                    </Grid>
                  ))
                }
              </>
            }
          </Grid>
        </Grid>
      </div>
    </>
  )
}