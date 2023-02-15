import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Grid, Hidden, makeStyles, Paper, Typography } from '@material-ui/core'
import { useHistory, useParams } from 'react-router-dom';
import { Formik, useFormikContext } from 'formik';
import moment from 'moment';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PrintIcon from '@material-ui/icons/Print';

import { useAxiosGet, useAxiosPatch } from '@/hooks/axios';
import { Business, LocationConfig, UserRO } from '@/constants/localInterfaces';
import { 
  StyledButton,
  LocationTypeLabels, 
  StyledRadioGroup,
  StyledConfirmDialog, 
  LocationType,
  StyledConfirmDateDialog,
  StyledDialog,
  StyledAutocomplete
} from 'vaping-regulation-shared-components';
import { ConfigContext } from '@/contexts/Config';
import StyledEditableTextField from '@/components/generic/StyledEditableTextField';
import LocationViewMap from './Map/LocationViewMap';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import Note from '@/components/note/Note';
import LocationProductTable from '@/components/tables/LocationProductTable';
import LocationManufacturingTable from '@/components/tables/LocationManufacturingTable';
import LocationSalesTable from '@/components/tables/LocationSalesTable';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';
import { LocationReportStatus } from '@/components/location/LocationReportStatus';
import { LocationUtil } from '@/util/location.util';
import ReactDOMServer from 'react-dom/server';
import { LocationDetailsPdf } from '@/components/location/LocationDetailsPdf';
import jsPDF from 'jspdf';
import { useScreenshot } from "use-react-screenshot";

const useStyles = makeStyles((theme) => ({
  contentWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  content: {
    maxWidth: '1440px',
    width: '95%',
    padding: '20px 30px'
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
    justifyContent: 'space-between',    
  },
  toc: {
    display: 'block',
    position: 'fixed',
    height: '270px',
    width: '15%',
    [theme.breakpoints.down('xs')] : {
      width: '100%',
      height: 'fit-content',
      position: 'unset',
      '& h6.MuiTypography-subtitle2': {
        display: 'none'
      },
      '& div.MuiFormGroup-root' : {
        flexDirection: 'row',
        position: 'fixed',
        marginTop: -8,
        zIndex: 1000,
        background: 'white',
        marginLeft: -32,
        paddingLeft: 25,
        width: '100%',
        height: 90,
        boxShadow: "0 4px 6px -6px #222",
        marginRight: -20,
        '& label.MuiFormControlLabel-root': {
          display: 'block',
          width: 'min-content',
          textAlign: 'center',
          '& span p.MuiTypography-body2':{
            fontSize: 12
          },
          '&:last-child span.MuiIconButton-label span:after': {
            display: 'none'
          }
        }
      }
    }
  },
  rowContent: {
    fontSize: '14px',
    fontWeight: 600,
  },
  tableBox: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem !important',
    boxShadow: 'none',
    [theme.breakpoints.down('xs')] : {
      border: 0,
      paddingTop: 0
    }
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
  breadcrumbWrap: {
    [theme.breakpoints.down('xs')]: {
      position: 'fixed',
      zIndex: 1300,
      width: '100%',
      background: 'white',
      marginTop: -8,
      height: 30,
      padding: '4px 12px 0',
      marginLeft: -10
    }
  },
  businessName: {
    [theme.breakpoints.down('xs')]: {
      position: 'fixed',
      zIndex: 1000,
      width: '100%',
      background: 'white',
      height: 25,
    }
  },
  rightDivWrap: {
    [theme.breakpoints.down('xs')]: {
      position: 'relative',
      paddingTop: '65px !important'
    }
  }
}));

export default function ViewLocations() {
  return (
    <Formik 
      initialValues={{content: 'locationStatus'}}
      onSubmit={() => {}}>
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
  const [isConfirmCloseDialogOpen, setConfirmCloseDialogOpen] = useState<boolean>();
  const [isConfirmTransferDialogOpen, setConfirmTransferDialogOpen] = useState<boolean>();
  const [selectedBusiness, setSelectedBusiness] = useState<string>();
  const [currentContent, setCurrentContent] = useState<string>('locationStatus');
  const { id } = useParams<{id: string}>();
  const { config: authConfig } = useContext(ConfigContext);
  const locationStatusRef = useRef(null);
  const locationInformationRef = useRef(null);
  const productReportRef = useRef(null);
  const manufacturingReportRef = useRef(null);
  const salesReportRef = useRef(null);
  const mapBoxRef = useRef(null);
  const userInfoRef = useRef(null);
  const [locationInfoUpdates, updateLocationInfo] = useState("");

  const [printing, setPrinting] = useState<Boolean>(false);
  const [locationStatusScreenshot, takeLocationStatusScreenshot] = useScreenshot();
  const [userInfoScreenshot, takeUserInfoScreenshot] = useScreenshot();
  const [locationInfoScreenshot, takeLocationInfoScreenshot] = useScreenshot();
  
  const [{ data, loading, error }, get] = useAxiosGet(`/data/location/get-location/${id}?includes=business,business.users,noi`, {
    manual: false,
  });

  const [{ response: deleteData, loading: deleteLoading, error: deleteError }, patch] = useAxiosPatch(`/data/location/delete-location/${id}`, {
    manual: true,
  });

  const [{ response: closeResponse, loading: closeLoading, error: closeError }, closePatch] = useAxiosPatch(`/data/location/close/`, { manual: true });

  const closeLocation = async ({ date }: { date: Date }) => {
    await closePatch({
      url: `/data/location/close/${id}?closedTime=${moment(date).unix()}`,
    });    
  };

  const [{ data: config, error: configError, loading: configLoading }, getData] = useAxiosGet<LocationConfig>(
    '/data/location/config'
  );

  const [{ data: businesses, loading: businessLoading, error: businessError }, getBusinesses] = useAxiosGet<Business[]>('/data/business', {
    manual: true,
  });

  const [{ response: completeTransferResponse, loading: completingTransfer, error: completingTransferError }, transferLocation] = useAxiosPatch(`/data/location/transfer/${id}`, { manual: true });

  const completeLocationTransfer = async () => {
    await transferLocation({
      url: `/data/location/transfer/${id}?businessId=${selectedBusiness}`,
    }); 
  }

  let options: any = {
    root: null,
    rootMargin: "0px",
    threshold: 0.9 // [1.0]
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
    if(closeResponse) {
      if (isConfirmCloseDialogOpen) setConfirmCloseDialogOpen(false);
      get();
    }
  }, [closeResponse])

  useEffect(() => {    
    if (completeTransferResponse && completeTransferResponse.status == 200) {
      if (isConfirmTransferDialogOpen) setConfirmTransferDialogOpen(false);
      get();          
    }
  }, [completeTransferResponse])

  useEffect(() => {
    showNetworkErrorMessage(deleteError ?? closeError ?? completingTransferError);    
    if (isConfirmCloseDialogOpen) setConfirmCloseDialogOpen(false); 
  }, [deleteError, closeError, completingTransferError])

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

  useEffect(() => {
    if (isConfirmTransferDialogOpen) {
      getBusinesses();
    }
  }, [isConfirmTransferDialogOpen])

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
        label: <Typography variant="body2">Product Report</Typography>, value: 'productReport'
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

  const initiatePrintLocation = async () => {
    setPrinting(true);
    await takeLocationStatusScreenshot(locationStatusRef.current); 
    await takeUserInfoScreenshot(userInfoRef.current);
    await takeLocationInfoScreenshot(locationInformationRef.current);   
  }

  useEffect(() => {
    if (locationStatusScreenshot && userInfoScreenshot && locationInfoScreenshot) {
      generateLocationDetailsPdf();
    }
  }, [locationStatusScreenshot, userInfoScreenshot, locationInfoScreenshot]);

  const generateLocationDetailsPdf = async () => {
    const pdf = new jsPDF('p', 'pt', 'letter');
    await pdf.html(ReactDOMServer.renderToStaticMarkup(<LocationDetailsPdf 
                                                          location={data} 
                                                          locationStatusImg = {locationStatusScreenshot} 
                                                          userInfoImg = {userInfoScreenshot}
                                                          locationInfoImg = {locationInfoScreenshot}
                                                          />));
    pdf.save(`Location-Details-${data.id}`)
    setPrinting(false);
  }

  const submitChangeToNote = async (data:string) => { //data: the content to update in the Notes
    get()
    updateLocationInfo(data)
  }

  return (
    <div className={classes.contentWrapper}>
      <div className={classes.content}>
        {
          deleteLoading || closeLoading
          ? 
            <CircularProgress/>
          :
            <>
              <Typography variant="body1" className={classes.breadcrumbWrap}><span className={classes.clickBack} onClick={() => history.goBack()}>{getBreadcrumb()}</span> / Location Details</Typography>
              {
                data
                  &&
                authConfig
                  &&
                <>
                  <Typography variant="h5" className={classes.businessName}>{data.business.businessName} {data.doingBusinessAs ? "("+data.doingBusinessAs+")": ""}</Typography>
                  <Grid container spacing={2}>
                    <Grid item lg={3} xs= {12} className={classes.rightDivWrap}>
                      <Box className={`${classes.tableBox} ${classes.toc}`}>
                        <Typography variant="subtitle2">Table of Contents</Typography>                        
                        <StyledRadioGroup
                          name="content"
                          options={getOptions()}
                          onChange={handleTocSelection}
                        />
                      </Box>
                    </Grid>
                    <Grid container item xs={12} lg={9} spacing={3} className={classes.rightDivWrap}>
                      <Grid item xs={12} id="locationStatus" ref={locationStatusRef} >
                        <Box
                          display='flex'
                        >
                          <Typography className={classes.cellTitle}>Location Status</Typography>
                          <Box marginLeft='auto'>
                            {printing ? <CircularProgress />:<PrintIcon color="action" onClick={initiatePrintLocation} />}
                          </Box>
                        </Box>
                        <Paper className={classes.box} style={{ display: 'block'}}>
                          <Grid container spacing={2}>
                          {!data.closedAt &&
                            <Hidden smUp>
                              <Grid item xs={6}> 
                                  <StyledButton variant="contained" onClick={() => setConfirmTransferDialogOpen(true)} style={{minWidth: 100, fontWeight: 600}}>
                                    <ExitToAppIcon />&nbsp;&nbsp; Transfer 
                                  </StyledButton>                                  
                              </Grid>
                              <Grid item xs={6}>  
                                  <StyledButton variant="contained" onClick={() => setConfirmCloseDialogOpen(true)} style={{minWidth: 100, backgroundColor: '#FF534A', fontWeight: 600}}>
                                    <HighlightOffIcon />&nbsp;&nbsp; Close  
                                  </StyledButton>
                              </Grid>
                            </Hidden>}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body2">Status</Typography>
                                <Typography className={classes.rowContent}>{data.closedAt ? 'Closed' : 'Open'}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              {data.closedAt && 
                              <>
                                <Typography variant="body2">Closed At</Typography>
                                <Typography className={classes.rowContent}>{data.closedAt}</Typography>
                              </>}
                            </Grid>
                            {!data.closedAt &&
                            <Hidden smDown>
                              <Grid item xs={6} md={4} style={{display: 'flex', gap: 12, justifyContent: 'end'}}> 
                                <StyledButton variant="contained" onClick={() => setConfirmTransferDialogOpen(true)} style={{minWidth: 150, fontWeight: 600}}>
                                  <ExitToAppIcon />&nbsp;&nbsp; Transfer 
                                </StyledButton>
                                <StyledButton variant="contained" onClick={() => setConfirmCloseDialogOpen(true)} style={{minWidth: 150, backgroundColor: '#FF534A', fontWeight: 600}}>
                                  <HighlightOffIcon />&nbsp;&nbsp; Close  
                                </StyledButton>
                              </Grid>
                            </Hidden>}
                          </Grid>                          
                          <Box mt={3}>
                            <LocationReportStatus id={id}/>
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} id="userInformation" ref={userInfoRef} >
                        <Typography className={classes.cellTitle}>User Information</Typography>

                        <Grid container spacing={2} className={classes.box} style={{margin: 0, width: '100%', padding: 8}}>                          
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2">User Name</Typography>
                            <Typography className={classes.rowContent}>{`${businessOwner?.firstName} ${businessOwner?.lastName}`}</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2">Email Address</Typography>
                            <Typography className={classes.rowContent}>{businessOwner?.email}</Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2">User's BCeId</Typography>
                            <Typography className={classes.rowContent}>{businessOwner?.bceidUser}</Typography>
                          </Grid>
                        </Grid>                      
                      </Grid>

                      <Grid item xs={12} id="locationInformation" ref={locationInformationRef} >
                        <Typography className={classes.cellTitle}>Location Information</Typography>
                        <Paper className={classes.box}>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Box>
                                <Typography variant="body2">Location is Physical, Online or Physical and Online</Typography>
                                <Typography className={classes.rowContent}>
                                  {LocationTypeLabels[data.location_type as keyof typeof LocationTypeLabels]}
                                </Typography>
                              </Box>
                            </Grid>
                            {data.location_type !== LocationType.online &&
                            <>
                            <Grid item xs={6} md={4}>
                              <Box>
                                <Typography variant="body2">Address</Typography>
                                <StyledEditableTextField id={data.id} value={data.addressLine1} type={"addressLine1"} onSuccessfulUpdate={submitChangeToNote}/>
                              </Box>
                            </Grid>                            
                            <Grid item xs={6} md={4}>
                              <Box>
                                <Typography variant="body2">City</Typography>
                                <Typography className={classes.rowContent}>{data.city}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md={4}>
                              <Box>
                                <Typography variant="body2">Postal Code</Typography>
                                <StyledEditableTextField id={data.id} value={data.postal} type={"postal"} onSuccessfulUpdate={submitChangeToNote}/>
                              </Box>
                            </Grid>
                            </>}
                            {data.location_type === LocationType.online &&                            
                            <Grid item xs={12} md={4}>
                              <Box>
                                <Typography variant="body2">Webpage</Typography>
                                <StyledEditableTextField id={data.id} value={data.webpage} type={"webpage"} onSuccessfulUpdate={submitChangeToNote}/>
                              </Box>
                            </Grid>}
                            <Grid item xs={6} md={4}>
                              <Box>
                                <Typography variant="body2">Business Phone Number</Typography>
                                <StyledEditableTextField id={data.id} value={data.phone} type="phone" onSuccessfulUpdate={submitChangeToNote}/>
                              </Box>
                            </Grid>
                            <Grid item xs={6} md = {4}>
                              <Box>
                                <Typography variant="body2">Business Email</Typography>
                                <StyledEditableTextField id={data.id} value={data.email} type="email" onSuccessfulUpdate={submitChangeToNote}/>
                              </Box>
                            </Grid>
                            {data.location_type !== LocationType.online &&
                            <>
                            <Grid item xs={12}>
                              <Box>
                                <Typography variant="body2">If persons under 19 years of age are permitted on the sales premises</Typography>
                                <StyledEditableTextField id={data.id} value={data.underage} type="underage" onSuccessfulUpdate={submitChangeToNote}/>
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <Box>
                                <Typography variant="body2">Regional health authority the sales premises is located in</Typography>
                                <Typography className={classes.rowContent}>{data.ha === 'other' ? data.ha_other : data.ha}</Typography>
                              </Box>
                            </Grid>
                            </>}
                            <Grid item xs={12}>
                              <Box>
                                <Typography variant="body2">Intent to manufacture e-substances for sale at this business location</Typography>
                                <StyledEditableTextField id={data.id} value={data.manufacturing === true ? 'Yes' : 'No'} type="manufacturing" onSuccessfulUpdate={submitChangeToNote}/>
                              </Box>
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <Box>
                                <Typography variant="body2">NOI Original Submission Date</Typography>
                                <Typography className={classes.rowContent}>{data.noi ? moment(data.noi.created_at).format('YYYY-MM-DD') : 'N/A'}</Typography>
                              </Box>
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <Box>
                                <Typography variant="body2">Date of Last NOI Renewal</Typography>
                                <Typography className={classes.rowContent}>{data.noi ? data.noi.renewed_at ? moment(data.noi.renewed_at).format('YYYY-MM-DD') : 'Not Renewed' : 'N/A'}</Typography>
                              </Box>
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <Box>
                                <Typography variant="body2">Next NOI Renewal Date</Typography>
                                <Typography className={classes.rowContent}>{data.noi ? data.noi.expiry_date ? moment(data.noi.expiry_date).format('YYYY-MM-DD') : 'N/A' : 'N/A'}</Typography>
                              </Box>
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <Box>
                                <Typography variant="body2">Location Creation Date</Typography>
                                <Typography className={classes.rowContent}>{data ? data.created_at ? moment(data.created_at).utc(true).format('YYYY-MM-DD hh:mm:ss a') : '' : 'N/A'}</Typography>
                              </Box>
                            </Grid>
                          </Grid>    
                        </Paper>
                      </Grid>

                      <Grid item xs={12} id="notes">
                          <Note targetId={id} type='location' showHideButton={true} showFlag={true} refresh={locationInfoUpdates} />
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
              {
                isConfirmCloseDialogOpen
                  &&
                  <StyledConfirmDateDialog
                    open={isConfirmCloseDialogOpen}
                    confirmHandler={closeLocation}
                    dialogTitle="Confirm Your Closing Location"
                    setOpen={() => setConfirmCloseDialogOpen(false)}
                    dialogMessage="You are about to close this location. Please provide the Closing Date."
                    checkboxLabel="I confirm that I wish to close this location. I understand that I will still be required to submit a Sales Report for the sales that occurred prior to closing."
                    maxDate={LocationUtil.getLocationCloseWindow().max}
                    minDate={LocationUtil.getLocationCloseWindow().min}
                  />                
              }
              {
                isConfirmTransferDialogOpen 
                &&
                <StyledDialog
                  open={isConfirmTransferDialogOpen}
                  cancelButtonText="Cancel"
                  acceptButtonText="Transfer"
                  acceptHandler={() => completeLocationTransfer()}
                  cancelHandler={() => setConfirmTransferDialogOpen(false)}
                  title="Transfer Location"
                  acceptDisabled={businessLoading || !selectedBusiness || completingTransfer}
                >
                  <Typography>
                    Please select the business you wish to transfer this location to:
                  </Typography>
                  <br/>
                  {businessLoading || completingTransfer ? 
                  <CircularProgress />
                  :
                  <StyledAutocomplete                  
                    placeholder="Start typing or select..."
                    options= {
                      businesses?.filter(
                        (b) => b.id != id 
                                && (b.businessName !== "" || b.legalName !== "") //&& b.status === 'active'
                      ) || []
                    }
                    getOptionLabel={(b: Business) => `${b.businessName || b.legalName} - ${b.addressLine1}`}
                    onChange={(e: any, newValue: Business) => {
                      setSelectedBusiness(newValue.id);
                    }}
                  />}
                </StyledDialog>
              }
            </>
        }
      </div>
    </div>
  )
}