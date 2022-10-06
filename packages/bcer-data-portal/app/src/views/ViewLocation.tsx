import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Dialog, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import { useHistory, useParams } from 'react-router-dom';
import { Formik, useFormikContext } from 'formik';
import moment from 'moment';

import { routes } from '@/constants/routes';
import { useAxiosGet, useAxiosPatch } from '@/hooks/axios';
import { GroupedSalesRO, LocationConfig, ManufacturesRO, SalesRO, UserRO } from '@/constants/localInterfaces';
import { 
  StyledButton,
  StyledTable, 
  StyledRadioGroup,
  StyledConfirmDialog 
} from 'vaping-regulation-shared-components';
import { ConfigContext } from '@/contexts/Config';
import { CSVLink } from 'react-csv';
import LocationViewMap from './Map/LocationViewMap';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/util/formatting';
import Note from '@/components/note/Note';
import LocationProductTable from '@/components/tables/LocationProductTable';
import LocationManufacturingTable from '@/components/tables/LocationManufacturingTable';
import LocationSalesTable from '@/components/tables/LocationSalesTable';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';
import { LocationReportStatus } from '@/components/location/LocationReportStatus';


const useStyles = makeStyles({
  contentWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  content: {
    maxWidth: '1440px',
    width: '95%',
    padding: '20px 30px',
  },
  clickBack: {
    cursor: 'pointer',
    color: 'rgba(51, 51, 51, 0.5)',
  },
  cellTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#0053A4',
    paddingBottom: '12px'
  },
  box: {
    display: 'flex',
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
    boxShadow: 'none',
    justifyContent: 'space-between'
  },
  toc: {
    display: 'block',
    position: 'fixed',
    height: '270px',
    width: '15%',
  },
  rowContent: {
    fontSize: '14px',
    fontWeight: 600,
  },
  tableBox: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
    boxShadow: 'none',
  },
  dialogWrap: {
    marginTop: '100px',
    padding: '1rem 1.5rem',
  },
  subtitleWrapper: {
    display: 'flex',
    alignItems: 'bottom',
    justifyContent: 'space-between',
    padding: '30px 0px 10px 0px',
  },
  subtitle: {
    color: '#0053A4',
  },
  boxTitle: {
    paddingBottom: '10px',
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
  },
  mapBox: {
    height: '540px',
  },
})

export default function ViewLocations() {
  return (
    <Formik 
      initialValues={{content: 'locationStatus'}}
      onSubmit={() => {}}
    >
        <LocationsContent />
    </Formik>

  )

}


function LocationsContent() {
  const classes = useStyles();
  const history = useHistory();
  const { values, setFieldValue }: {values: any, setFieldValue: Function} = useFormikContext();
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);
  const [businessOwner, setBusinessOwner] = useState<UserRO>();
  const { showNetworkErrorMessage } = useNetworkErrorMessage();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>();
  const [currentContent, setCurrentContent] = useState<string>('locationStatus');
  const { id } = useParams<{id: string}>();
  const { config: authConfig } = useContext(ConfigContext);
  const locationStatusRef = useRef(null);
  const locationInformationRef = useRef(null);
  const productReportRef = useRef(null);
  const manufacturingReportRef = useRef(null);
  const salesReportRef = useRef(null);
  const mapBoxRef = useRef(null);
  
  const [{ data, loading, error }, get] = useAxiosGet(`/data/location/get-location/${id}?includes=business,business.users,noi`, {
    manual: false,
  });

  const [{ response: deleteData, loading: deleteLoading, error: deleteError }, patch] = useAxiosPatch(`/data/location/delete-location/${id}`, {
    manual: true,
  });


  const [{ data: config, error: configError, loading: configLoading }, getData] = useAxiosGet<LocationConfig>(
    '/data/location/config'
  );

  let options: any = {
    root: null,
    rootMargin: "0px",
    threshold: [1.0]
  };

  useEffect(() => {
    if (data) {
      setBusinessOwner(data.business.users.find((e: UserRO) => e.type === 'bo'));
    }
  }, [data])

  useEffect(() => {
    if(deleteData) {
      history.push('/')
    }
  }, [deleteData])

  useEffect(() => {
    showNetworkErrorMessage(deleteError)
  }, [deleteError])

  useEffect(() => {
    showNetworkErrorMessage(error)
  }, [error])

  useEffect(() => {
  
    const observer = new IntersectionObserver(handleIntersect, options);

    if (locationStatusRef.current) observer.observe(locationStatusRef.current);
    if (locationInformationRef.current) observer.observe(locationInformationRef.current);
    if (productReportRef.current) observer.observe(productReportRef.current);
    if (manufacturingReportRef.current) observer.observe(manufacturingReportRef.current);
    if (salesReportRef.current) observer.observe(salesReportRef.current);
    if (mapBoxRef.current) observer.observe(mapBoxRef.current);
    
    return () => {
      if (locationStatusRef.current) observer.unobserve(locationStatusRef.current);
      if (locationInformationRef.current) observer.unobserve(locationInformationRef.current);
      if (productReportRef.current) observer.unobserve(productReportRef.current);
      if (manufacturingReportRef.current) observer.unobserve(manufacturingReportRef.current);
      if (salesReportRef.current) observer.unobserve(salesReportRef.current);
      if (mapBoxRef.current) observer.unobserve(mapBoxRef.current);
    }
  },[
      locationStatusRef,
      locationInformationRef,
      productReportRef,
      manufacturingReportRef,
      salesReportRef,
      mapBoxRef,
      options
    ]
  )

  const displayLocationType = () => {
    if(data.location_type === "both") return <Typography className={classes.rowContent}>Physical and Online</Typography>;
    else if(data.location_type === "online") return <Typography className={classes.rowContent}>Online</Typography>;
    else return <Typography className={classes.rowContent}>Pysical</Typography>;
  }

  const handleTocSelection = (field: string) => {
    const element = document.getElementById(field)
    if (element) element.scrollIntoView({behavior: 'smooth', block: 'end'});
  }

  const handleIntersect = (entries: any, observer: any) => {
    if (entries[0].isIntersecting) {
      setFieldValue('content', entries[0].target.id)
    }
  }


  const getBreadcrumb = () => {
    if (appGlobal?.history?.pathname?.includes('business')) return 'Business Details'
    else if (appGlobal?.history?.pathname?.includes('locations')) return 'Submitted Locations'
    else return 'Previous Page'
  }

  const getOptions = () => {
    const options = [
      {
        label: <Typography variant="body2">Location Status</Typography>, value: 'locationStatus'
      },
      {
        label: <Typography variant="body2">Location Information</Typography>, value: 'locationInformation'
      },
      {
        label: <Typography variant="body2">ProductReport</Typography>, value: 'productReport'
      },
      {
        label: <Typography variant="body2">Manufacturing Report</Typography>, value: 'manufacturingReport'
      }
    ]
    if (authConfig.permissions.VIEW_SALES) {
      options.push(
        {
          label: <Typography variant="body2">Sales Report</Typography>, value: 'salesReport'
        }
      )
    }
    options.push(
      {
        label: <Typography variant="body2">Map</Typography>, value: 'mapBox'
      }
    )
    return options
  }
  return (
    <div className={classes.contentWrapper}>
      <div className={classes.content}>
        {
          deleteLoading
          ? 
            <CircularProgress/>
          :
            <>
              <Typography variant="body1"><span className={classes.clickBack} onClick={() => history.goBack()}>{getBreadcrumb()}</span> / Location Details</Typography>
              {
                data
                  &&
                authConfig
                  &&
                <>
                  <Typography variant="h5">{data.doingBusinessAs} </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={3}>
                      <Box className={`${classes.tableBox} ${classes.toc}`}>
                        <Typography variant="subtitle2">Table of Contents</Typography>
                        <StyledRadioGroup
                          name="content"
                          options={getOptions()}
                          onChange={handleTocSelection}
                        />
                      </Box>
                    </Grid>
                    <Grid container item xs={9} spacing={3}>
                      <Grid item xs={12} id="locationStatus" ref={locationStatusRef} >
                        <Typography className={classes.cellTitle}>Location Status</Typography>
                        <Paper className={classes.box} style={{ display: 'block'}}>
                          <Box display="flex" justifyContent="space-between">
                            <Box>
                              <Typography variant="body2">Business Status</Typography>
                              <Typography className={classes.rowContent}>{data.closedAt ? 'Closed' : 'Open'}</Typography>
                            </Box>
                            {
                              data.closedAt 
                                && 
                              <Box>
                                <Typography variant="body2">Closed At</Typography>
                                <Typography className={classes.rowContent}>{data.closedAt}</Typography>
                              </Box>
                            }

                            {
                              authConfig.permissions.SEND_TEXT_MESSAGES
                                &&
                              <StyledButton variant="outlined" onClick={() => setConfirmDialogOpen(true)}>Permanently Delete</StyledButton>
                            }
                            
                          </Box>
                          <Box mt={3}>
                            <LocationReportStatus id={id}/>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} id="userInformation" >
                        <Typography className={classes.cellTitle}>User Information</Typography>
                        <Paper className={classes.box}>
                          <Box>
                            <Typography variant="body2">User Name</Typography>
                            <Typography className={classes.rowContent}>{`${businessOwner?.firstName} ${businessOwner?.lastName}`}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2">Email Address</Typography>
                            <Typography className={classes.rowContent}>{businessOwner?.email}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2">User's BCeId</Typography>
                            <Typography className={classes.rowContent}>{businessOwner?.bceidUser}</Typography>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} id="locationInformation" ref={locationInformationRef} >
                        <Typography className={classes.cellTitle}>Location Information</Typography>
                        <Paper className={classes.box}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Box>
                                <Typography variant="body2">Location is Physical, Online or Physical and Online</Typography>
                                {displayLocationType()}
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box>
                                <Typography variant="body2">Address</Typography>
                                <Typography className={classes.rowContent}>{data.addressLine1}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box>
                                <Typography variant="body2">City</Typography>
                                <Typography className={classes.rowContent}>{data.city}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box>
                                <Typography variant="body2">Postal Code</Typography>
                                <Typography className={classes.rowContent}>{data.postal}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box>
                                <Typography variant="body2">Business Phone Number</Typography>
                                <Typography className={classes.rowContent}>{data.phone}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box>
                                <Typography variant="body2">Business Email</Typography>
                                <Typography className={classes.rowContent}>{data.email}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Box>
                                <Typography variant="body2">If persons under 19 years of age are permitted on the sales premises</Typography>
                                <Typography className={classes.rowContent}>{data.underage}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Box>
                                <Typography variant="body2">Regional health authority the sales premises is located in</Typography>
                                <Typography className={classes.rowContent}>{data.ha === 'other' ? data.ha_other : data.ha}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Box>
                                <Typography variant="body2">Intent to manufacture e-substances for sale at this business location</Typography>
                                <Typography className={classes.rowContent}>{data.manufacturing === true ? 'Yes' : 'No'}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box>
                                <Typography variant="body2">NOI Original Submission Date</Typography>
                                <Typography className={classes.rowContent}>{data.noi ? moment(data.noi.created_at).format('YYYY-MM-DD') : 'N/A'}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box>
                                <Typography variant="body2">NOI Renewal Date</Typography>
                                <Typography className={classes.rowContent}>{data.noi ? data.noi.renewed_at ? moment(data.noi.renewed_at).format('YYYY-MM-DD') : 'Not Renewed' : 'N/A'}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box>
                                <Typography variant="body2">Location Creation Date</Typography>
                                <Typography className={classes.rowContent}>{data ? data.created_at ? moment(data.created_at).utc(true).format('YYYY-MM-DD hh:mm:ss a') : '' : 'N/A'}</Typography>
                              </Box>
                            </Grid>
                          </Grid>    
                        </Paper>
                      </Grid>

                      <Grid item xs={12} id="notes">
                          <Note targetId={id} type='location' showHideButton={true}/>
                      </Grid>

                      <Grid item xs={12} id="productReport" ref={productReportRef}>
                        <Typography className={classes.cellTitle}>Product Report Submissions</Typography>
                        <Paper className={classes.tableBox}>
                          <LocationProductTable locationId={id} />
                        </Paper>
                      </Grid>

                      <Grid item xs={12} id="manufacturingReport" ref={manufacturingReportRef} >
                        <Typography className={classes.cellTitle}>Manufacturing Report Submissions</Typography>
                        <Paper className={classes.tableBox}>
                          <LocationManufacturingTable locationId={id} />
                        </Paper>
                      </Grid>

                      {
                        authConfig.permissions.VIEW_SALES
                          &&
                        <Grid item xs={12} id="salesReport" ref={salesReportRef} >
                          <Typography className={classes.cellTitle}>Sales Report Submissions</Typography>
                          <Paper className={classes.tableBox}>
                            <LocationSalesTable locationId={id} />
                          </Paper>
                        </Grid>
                      }


                      <Grid item xs={12} >
                        <Box style={{display: 'flex', justifyContent: 'space-between'}}>
                          <Typography className={classes.cellTitle}>Map</Typography>
                          <StyledButton 
                            variant="small-outlined" 
                            onClick={() => history.push(`/map?locations=${id}`)}
                          >
                            Create Itinerary
                          </StyledButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12} id="mapBox" ref={mapBoxRef} >
                        <Box className={classes.mapBox}>
                          {config && !configError && <LocationViewMap id={id} config={config} />}
                        </Box>
                      </Grid>

                    </Grid>
                  </Grid>
                </>
              }
              {
                isConfirmDialogOpen
                  &&
                <StyledConfirmDialog
                  open={isConfirmDialogOpen}
                  maxWidth="xs"
                  dialogTitle="Delete location"
                  checkboxLabel="I understand that this location will be permanently removed from the database."
                  dialogMessage="If you delete this location it will be removed from the database along with its attached NOIs, Product reports, Manufacturing reports and Sales Reports. This action cannot be undone"
                  setOpen={() => setConfirmDialogOpen(false)}
                  confirmHandler={patch}
                />
              }
            </>
        }
      </div>
    </div>
  )
}
