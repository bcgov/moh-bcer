import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Dialog, Grid, makeStyles, Paper, Typography } from '@material-ui/core'
import { useHistory, useParams } from 'react-router-dom';
import { Formik } from 'formik';
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
  csvLink: {
    textDecoration: 'none',
  },
})

export default function ViewLocations() {
  const classes = useStyles();
  const history = useHistory();
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);
  const [businessOwner, setBusinessOwner] = useState<UserRO>();
  const [selectedManufactureReport, setSelectedManufactureReport] = useState<ManufacturesRO>();
  const [selectedSalesReport, setSelectedSalesReport] = useState<GroupedSalesRO>();
  const [viewOpen, setViewOpen] = useState<boolean>();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>();
  const [currentContent, setCurrentContent] = useState<string>('locationStatus');
  const { id } = useParams<{id: string}>();
  const { config: authConfig } = useContext(ConfigContext);
  const csvRef = useRef(null);

  const [{ data, loading, error }, get] = useAxiosGet(`/data/location/get-location/${id}`, {
    manual: false,
  });

  const [{ response: deleteData, loading: deleteLoading, error: deleteError }, patch] = useAxiosPatch(`/data/location/delete-location/${id}`, {
    manual: true,
  });


  const [{ data: config, error: configError, loading: configLoading }, getData] = useAxiosGet<LocationConfig>(
    '/data/location/config'
  );

  const [{ data: download = [], loading: downloadLoading, error: downloadError }, getDownload] = useAxiosGet(`/data/location/download/`, { manual: true });

  useEffect(() => {
    if (data) {
      setBusinessOwner(data.business.users.find((e: UserRO) => e.type === 'bo'));
    }
  }, [data])

  useEffect(() => {
    const element = document.getElementById(currentContent)
    if (element) element.scrollIntoView({behavior: 'smooth', block: 'end'});
  }, [currentContent])

  useEffect(() => {
    if(deleteData) {
      history.push('/')
    }
  }, [deleteData])

  useEffect(() => {
    if (deleteError) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(deleteError),
      });
    }
  }, [deleteError])

  const handleManufactureSelect = (manufactureReport: ManufacturesRO) => {
    setSelectedManufactureReport(manufactureReport)
    setViewOpen(true)
  }

  const handleSalesSelect = (salesReport: GroupedSalesRO) => {
    setSelectedSalesReport(salesReport)
    setViewOpen(true)
  }


  const yeildGroupedSalesArray = (salesReports: Array<any>) => {
    const grouped =  salesReports.reduce((group, report) => {
      const { year } = report;
      const groupIndex = group.findIndex((element: any) => element.year === year)
      groupIndex === -1 
        ? group.push({year: report.year, submissionDate: moment(report.created_at).format('YYYY-MM-DD'), reports: [report]}) 
        : group[groupIndex].reports.push(report)

      return group
    }, [])
    return grouped
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
              <Typography variant="body1"><span className={classes.clickBack} onClick={() => history.push(routes.root)}>Submitted Locations</span> / Location Details</Typography>
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
                        <Formik 
                          initialValues={{content: 'locationStatus'}}
                          onSubmit={() => {}}
                          >
                            {({values}) => {
                              setCurrentContent(values.content)
                              return (
                                <StyledRadioGroup
                                  name="content"
                                  options={getOptions()}
                              />
                              )
                            }}
                          </Formik>
                      </Box>
                    </Grid>
                    <Grid container item xs={9} spacing={3}>
                      <Grid item xs={12} id="locationStatus">
                        <Typography className={classes.cellTitle}>Location Status</Typography>
                        <Paper className={classes.box}>
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
                          <StyledButton variant="outlined" onClick={() => setConfirmDialogOpen(true)}>Permanently Delete</StyledButton>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} id="userInformation">
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

                      <Grid item xs={12} id="locationInformation">
                        <Typography className={classes.cellTitle}>Location Information</Typography>
                        <Paper className={classes.box}>
                          <Grid container spacing={2}>
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
                                <Typography className={classes.rowContent}>{moment(data.noi.created_at).format('YYYY-MM-DD')}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={4}>
                              <Box>
                                <Typography variant="body2">NOI Renewal Date</Typography>
                                <Typography className={classes.rowContent}>{data.noi.renewed_at ? moment(data.noi.renewed_at).format('YYYY-MM-DD') : 'Not Renewed'}</Typography>
                              </Box>
                            </Grid>
                          </Grid>    
                        </Paper>
                      </Grid>

                      <Grid item xs={12} id="productReport">
                        <Typography className={classes.cellTitle}>Product Report Submissions</Typography>
                        <Paper className={classes.tableBox}>
                          <Typography variant="body2" style={{paddingBottom: '8px'}}>{data.products.length} product reports submitted</Typography>
                          <StyledTable 
                            data={data.products}
                            columns={[
                              {
                                title: 'Type of Product', field: 'type'
                              },
                              {
                                title: 'Brand Name', field: 'brandName'
                              },
                              {
                                title: 'Product Name', field: 'productName'
                              },
                              {
                                title: 'Manufacturer Name', field: 'manufacturerName'
                              },
                            ]}
                          />
                        </Paper>
                      </Grid>

                      <Grid item xs={12} id="manufacturingReport">
                        <Typography className={classes.cellTitle}>Manufacturing Report Submissions</Typography>
                        <Paper className={classes.tableBox}>
                          <Typography variant="body2" style={{paddingBottom: '8px'}}>{data.manufactures.length} manufacturing reports submitted</Typography>
                          <StyledTable 
                            data={data.manufactures}
                            columns={[
                              {
                                title: 'Product', field: 'productName'
                              },
                              {
                                title: '',
                                render: (manufactureReport: ManufacturesRO) => <StyledButton variant="table" onClick={() => handleManufactureSelect(manufactureReport)}>View</StyledButton> 
                              }
                            ]}
                          />
                        </Paper>
                      </Grid>

                      {
                        authConfig.permissions.VIEW_SALES
                          &&
                        <Grid item xs={12} id="salesReport">
                          <Typography className={classes.cellTitle}>Sales Report Submissions</Typography>
                          <Paper className={classes.tableBox}>
                            <Typography variant="body2" style={{paddingBottom: '8px'}}>{data.sales.length} sales reports submitted</Typography>
                            <StyledTable 
                              data={yeildGroupedSalesArray(data.sales)}
                              columns={[
                                {
                                  title: 'Reporting Year', field: 'year'
                                },
                                {
                                  title: 'Submission Date', field: 'submissionDate'
                                },
                                {
                                  title: '',
                                  render: (salesReport: SalesRO) => <StyledButton variant="small-outlined" onClick={async() => {
                                    await getDownload({
                                      url: `/data/location/download?locationId=${data.id}&year=${salesReport.year}`,
                                    });
                                    csvRef.current.link.click();
                                  }}>Download</StyledButton> 
                                },
                                {
                                  title: '',
                                  render: (salesReport: GroupedSalesRO) => <StyledButton variant="table" onClick={() => handleSalesSelect(salesReport)}>View</StyledButton> 
                                }
                              ]}
                            />
                          </Paper>
                          <CSVLink
                            ref={csvRef}
                            headers={[
                              'Brand Name',
                              'Product Name',
                              'Concentration (mg/mL) (optional)',
                              'Container Capacity',
                              'Cartridge Capacity',
                              'Flavour',
                              'UPC (optional)',
                              'Number of Containers Sold',
                              'Number of Cartridges Sold',
                            ]}
                            data={download}
                            filename={`sales_report_${data.doingBusinessAs}.csv`}
                            className={classes.csvLink}
                            target="_blank"
                          />
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
                      <Grid item xs={12} id="mapBox" >
                        <Box className={classes.mapBox}>
                          {config && !configError && <LocationViewMap id={id} config={config} />}
                        </Box>
                      </Grid>

                    </Grid>
                  </Grid>
                </>
              }

              {
                selectedManufactureReport
                  &&
                <Dialog
                  fullScreen
                  open={viewOpen}
                  onClose={() => {
                    setSelectedManufactureReport(null)
                    setViewOpen((open) => !open)
                  }}
                >
                  <div className={classes.dialogWrap}>
                    <Paper variant="outlined" className={classes.tableBox}>
                      <Typography className={classes.boxTitle} variant="subtitle1">
                        Ingredients
                      </Typography>
                      <div className={classes.actionsWrapper}>
                        <Typography style={{paddingBottom: '8px'}} variant="body2">
                          There are {selectedManufactureReport.ingredients.length} submitted ingredients
                        </Typography>
                      </div>
                      <div>
                        <StyledTable
                          data={selectedManufactureReport.ingredients}
                          columns={[
                            {
                              title: 'Name',
                              field: 'name',
                            },
                            {
                              title: 'Scientific Name',
                              field: 'scientificName',
                            },
                            {
                              title: 'Manufacturer Name',
                              field: 'manufacturerName',
                            },
                            {
                              title: 'Manufacturer Name',
                              field: 'manufacturerName',
                            },
                          ]}
                        />
                      </div>
                    </Paper>
                    <div>
                      <StyledButton
                        variant="outlined"
                        onClick={() => setViewOpen(false)}
                        style={{ margin: '1rem 0' }}
                      >
                        Close
                      </StyledButton>
                    </div>
                  </div>
                </Dialog>
              }

              {
                selectedSalesReport
                  &&
                <Dialog
                  fullScreen
                  open={viewOpen}
                  onClose={() => {
                    setSelectedSalesReport(null)
                    setViewOpen((open) => !open)
                  }}
                >
                  <div className={classes.dialogWrap}>
                    <Paper variant="outlined" className={classes.tableBox}>
                      <Typography className={classes.boxTitle} variant="subtitle1">
                        Reports
                      </Typography>
                      <div className={classes.actionsWrapper}>
                        <Typography style={{paddingBottom: '8px'}} variant="body2">
                          There are {selectedSalesReport.reports.length} submitted reports
                        </Typography>
                      </div>
                      <div>
                        <StyledTable
                          data={selectedSalesReport.reports}
                          columns={[
                            {
                              title: 'Product Name',
                              field: 'productSold.productName',
                            },
                            {
                              title: 'Cartridges',
                              field: 'cartridges',
                            },
                            {
                              title: 'Containers',
                              field: 'containers',
                            },
                            {
                              title: 'Containers',
                              field: 'containers',
                            },
                            {
                              title: 'UPC',
                              field: 'productSold.upc',
                            },
                          ]}
                        />
                      </div>
                    </Paper>
                    <div>
                      <StyledButton
                        variant="outlined"
                        onClick={() => setViewOpen(false)}
                        style={{ margin: '1rem 0' }}
                      >
                        Close
                      </StyledButton>
                    </div>
                  </div>
                </Dialog>
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