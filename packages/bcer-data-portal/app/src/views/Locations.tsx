import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  makeStyles,
  Typography,
  Paper,
  Snackbar,
  CircularProgress,
  IconButton,
  SnackbarContent,
  Tooltip,
  Link,
  TextField
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { useAxiosGet, useAxiosPostFormData } from '@/hooks/axios';
import { useKeycloak } from '@react-keycloak/web';
import GetAppIcon from '@material-ui/icons/GetApp';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment';
import store from 'store';
import {
  StyledButton,
  StyledSelectField,
  StyledTable,
  StyledTextField,
  StyledMenus,
  StyledMenuItems,
  LocationType,
  LocationTypeLabels,
  locationTypeOptions,
  StyledTableColumn,
  BusinessDashboardUtil,
  ReportStatusLegend,
  reportingStatusOptions,
  StyledConfirmDateDialog
} from 'vaping-regulation-shared-components';

import { BusinessLocation } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { healthAuthorityOptions} from '../constants/arrays'

const useStyles = makeStyles({
  loadingWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  helpTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },
  helperIcon: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  title: {
    padding: '10px 0px',
    color: '#002C71',
  },
  highlighted: {
    fontWeight: 600,
    color: '#0053A4',
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
  tableRowCount: {
    paddingBottom: '10px',
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
  },
  csvLink: {
    textDecoration: 'none',
  },
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  buttonIconAlt: {
    paddingRight: '5px',
    color: 'white',
    fontSize: '20px',
  },
  sendIcon: {
    height: '24px',
    paddingRight: '4px',
  },
  actionLink: {
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  downloadSnackbar: {
    height: '100px',
    backgroundColor: 'white',
    '& .MuiSnackbarContent-message': {
      fontWeight: '600',
      color: '#0053A4',
    },
    '& .MuiSnackbarContent-action': {
      minWidth: '64px',
    },
  },
  messageTextContent: {
    paddingLeft: '10px',
  },
  fileLoading: {
    fontSize: '2.5rem',
    color: 'rgba(0, 0, 0, 0.2)',
  },
  fileComplete: {
    fontSize: '2.5rem',
    color: '#0053A4',
  },
  downloadButtonIcon: {
    color: '#285CBC',
    fontSize: '40px',
  },
  groupButtons: {
    display: 'flex',
    marginBottom: '1rem',
    '& > * + *': {
      marginLeft: '1rem',
    },
  },
  reportTitle: {
    minWidth: 150,   
    width: 150 
  },
  reportStatusFilterTable: {

  },
  reportStatus: {
    minWidth: 30,    
    paddingTop: 0,
    paddingBottom: 0,
    textAlign: 'center'
  },
  reportSelect: {
    paddingBottom: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  radioGroup: {
    display: 'inline-block'
  },
  showMoreLink: {
    float: 'right',
    textDecoration: 'underline',
    fontWeight: 'bold'
  },
  root: {
    backgroundColor: '#F5F5F5',
    height: '40px',
    width: '100%',
    borderRadius: '2px',
    '& .MuiInput-underline::before': {
      display: 'none',
    },
    cursor: 'pointer',
  },
  picker: {
    color: '#535353',
    fontSize: '16px',
    marginLeft: '9px',
    minWidth: '56px',
    height: '19px',
  }
});

export default function Locations() {
  const classes = useStyles();
  const history = useHistory();
  const [keycloak] = useKeycloak();
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const getInitialState = () => {
    const user_ha = store.get('KEYCLOAK_USER_HA') || '';
    const initialState = {
      authority: store.get('KEYCLOAK_USER_HA') || undefined,
      page: 0,
      pageSize: 20      
    }

    const filterParams = JSON.parse(localStorage.getItem('location_searchOptions'));

    if (filterParams) {
      if (user_ha) {
        filterParams.authority = user_ha;
      }

      return filterParams
    }

    return initialState;
  }

  const [searchTerms, setSearchTerms] = useState(getInitialState());
  const [locations, setLocations] = useState([]);
  const [showMoreFilters, setShowMoreFilter] = useState(false);

  const handleRouteWithHistory = (locationId: string) => {
    setAppGlobalContext({
      ...appGlobal,
      history: history.location
    })
    history.push(`/location/${locationId}`)
  }

  const tableColumns = [
    {
      title: 'Business Name',
      render: (rd: BusinessLocation) => <span className={classes.actionLink} onClick={() => handleRouteWithHistory(rd.id)}>{rd.business.businessName}</span>,
      sortTitle: "Business Name",
      sorting: true,
      width: 400
    },
    {
      title: 'Address / URL',
      render: (rd: BusinessLocation) =>
        rd.location_type === LocationType.online ? rd.webpage: <StyledTableColumn value={`${rd.addressLine1}, ${rd.postal}, ${rd.city}`} />,
      sortTitle: "Address",
      sorting: true,
      width: 350
    },
    {
      title: 'Type of Location',
      render: (rd: BusinessLocation) => LocationTypeLabels[rd.location_type],
      sortTitle: "Location Type",
      sorting: true,
    },
    {
      title: 'Latest NOI Date',
      render: (rd: BusinessLocation) =>
        rd.noi?.renewed_at ? 
          `${moment(rd.noi.created_at).format('MMM DD, YYYY')}`
        : rd.noi?.created_at 
          ? `${moment(rd.noi.created_at).format('MMM DD, YYYY')}`
          : '',          
      sortTitle: "Submitted Date",
      sorting: true,
    },
    {
      title: 'NOI',
      render: (l: BusinessLocation) => BusinessDashboardUtil.renderStatus(l.reportStatus?.noi),
      sorting: false
    },
    {
      title: 'Product Report', 
      render: (l: BusinessLocation) => BusinessDashboardUtil.renderStatus(l.reportStatus?.productReport),
      sorting: false
    },
    {
      title: 'Manufacturing Report', 
      render: (l: BusinessLocation) => BusinessDashboardUtil.renderStatus(l.reportStatus?.manufacturingReport),
      sorting: false
    },
    {
      title: 'Sales Report', 
      render: (l: BusinessLocation) => BusinessDashboardUtil.renderStatus(l.reportStatus?.salesReport),
      sorting: false
    }
  ];

  const buildSearchUrl = (): string => {
    let url = `/data/location?page=${searchTerms.page + 1 || 1}&numPerPage=${
      searchTerms.pageSize || 20
    }&includes=business,noi`;
    searchTerms?.term && searchTerms.term.length > 3
      ? (url += `&search=${searchTerms.term}`)
      : null;
    searchTerms?.authority
      ? (url += `&authority=${searchTerms.authority}`)
      : null;
    searchTerms?.location_type
      ? (url += `&location_type=${searchTerms.location_type}`)
      : null;    
    searchTerms?.underage
      ? (url += `&underage=${searchTerms.underage}`)
      : null;
    searchTerms?.noi_report
      ? (url += `&noi_report=${searchTerms.noi_report}`)
      : null;
    searchTerms?.product_report
      ? (url += `&product_report=${searchTerms.product_report}`)
      : null;
    searchTerms?.manufacturing_report
      ? (url += `&manufacturing_report=${searchTerms.manufacturing_report}`)
      : null;
    searchTerms?.sales_report
      ? (url += `&sales_report=${searchTerms.sales_report}`)
      : null;
    searchTerms?.orderBy >= 0
      ? (url += `&orderBy=${tableColumns[searchTerms.orderBy].sortTitle}`)
      : null;
    searchTerms?.orderDirection
      ? (url += `&order=${searchTerms.orderDirection.toUpperCase()}`)
      : null;
    searchTerms?.fromdate
      ? (url += `&fromdate=${searchTerms.fromdate}`)
      : null;
    searchTerms.todate
      ? (url += `&todate=${searchTerms.todate}`)
      : null;
    return url;
  };

  const [{ data, loading, error }, get] = useAxiosGet(buildSearchUrl(), {
    manual: true,
  });

  const [{ data: zipFile, loading: zipLoading, error: zipError }, post] =
    useAxiosPostFormData(`/data/location/reportsFile`, { manual: true });

  const logout = () => {
    store.clearAll();
    keycloak.logout();
    history.push('/');
  };

  //date filter
  const [selectedFromDate, setFromDate] = useState(null);
  const [selectedToDate, setToDate] = useState(null);
  const onFromDateChange = (date:any, value:any) => {setFromDate(date);};
  const onToDateChange = (date:any, value:any) => {setToDate(date); };

  const search = (e: any) => {
    const authority = e.authority !== 'all' ? e.authority : undefined;
    const location_type = e.location_type !== 'all' ? e.location_type : undefined;
    const underage = e.underage !== 'all' ? e.underage : undefined;
    const noi_report = e.noi_report !== 'all' ? e.noi_report : undefined;
    const product_report = e.product_report !== 'all' ? e.product_report : undefined;
    const manufacturing_report = e.manufacturing_report !== 'all' ? e.manufacturing_report : undefined;
    const sales_report = e.sales_report !== 'all' ? e.sales_report : undefined;
    const fromdate = e.fromdate = selectedFromDate !== null? moment(selectedFromDate.setHours(0,0,0,0)).format("MM/DD/YYYY HH:mm:ss"): null;
    const todate = e.todate = selectedToDate !== null? moment(selectedToDate.setHours(23,59,59,0)).format("MM/DD/YYYY HH:mm:ss"): null;
    setSearchTerms({
      ...searchTerms,
      page: 0,
      term: e.search,
      authority,
      location_type,
      underage,
      noi_report,
      product_report,
      manufacturing_report,
      sales_report,
      fromdate,
      todate
    });
  };

  useEffect(() => {
    localStorage.setItem('location_searchOptions', JSON.stringify(searchTerms));
    get();
  }, [searchTerms]);

  useEffect(() => {
    setTotalRowCount(data?.totalRows || 0);
    setLocations(data?.rows || []);
  }, [data]);

  const getReportsFile = (requestFilter: string = 'selected') => {
    let postConfig: { url: string; data: Array<string> } = {
      url: '',
      data: [],
    };
    switch (requestFilter) {
      case 'all':
        postConfig.url = `/data/location/reportsFile?getAll=true${
          searchTerms.authority ? `&authority=${searchTerms.authority}` : ''
        }${searchTerms.term ? `&search=${searchTerms.term}` : ''}`;
        break;

      case 'selected':
        postConfig.url = '/data/location/reportsFile';
        postConfig.data = selectedRows.map((row) => row.id);
        break;

      case 'NOI':
        postConfig.url = `/data/location/reportsFile?getAll=true&getNOI=true${
          searchTerms.authority ? `&authority=${searchTerms.authority}` : ''
        }${searchTerms.term ? `&search=${searchTerms.term}` : ''}`;
        break;

      case 'SELECTED_SALESREPORT':
        postConfig.url = `/data/location/reportsFile?getSalesReport=true`;
        postConfig.data = selectedRows.map((row) => row.id);
        break;

      default:
        return;
    }

    post(postConfig);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (locations && !error) {
    } else {
      if (error) {
        setAppGlobalContext({
          ...appGlobal,
          networkErrorMessage: error?.response?.data?.message,
        });
      }
    }
  }, [error]);

  const menuOptions: StyledMenuItems[] = [
    {
      icon: <SaveAltIcon />,
      text: 'Download All NOIs',
      handler: () => getReportsFile('NOI'),
      disabled: zipLoading,
    },
    {
      icon: <SaveAltIcon />,
      text: 'Download Selected',
      handler: () => getReportsFile('selected'),
      disabled: !selectedRows.length || zipLoading,
    },
    {
      icon: <SaveAltIcon />,
      text: 'Download Selected Sales Report(s)',
      handler: () => getReportsFile('SELECTED_SALESREPORT'),
      disabled: !selectedRows.length || zipLoading,
    },
    {
      icon: <SaveAltIcon />,
      text: 'Download All Locations',
      handler: () => getReportsFile('all'),
      disabled: zipLoading || totalRowCount > 400,
      tooltip: totalRowCount > 1
      ? 'Must be less than 400 locations to download'
      : ''
    }
  ];

  const openMap = () => {
    if(selectedRows?.length){
      const ids: string[] = selectedRows.reduce((prev, current) => [...prev, current?.id], []);
      history.push(`/map?locations=${ids.join(",")}`)
    }
  }

  const TextFieldComponent = (props: any) => {
    return <TextField {...props} disabled={true} />;
  };

  return (
    <div className={classes.contentWrapper}>
      <div className={classes.content}>
        {error && (
          <>
            <div className={classes.helpTextWrapper}>
              <GetAppIcon className={classes.helperIcon} />
              <Typography variant="body1">
                You do not have the correct role to view this page.
              </Typography>
            </div>
            <div className={classes.buttonWrapper}>
              <StyledButton variant="outlined" onClick={logout}>
                Log Out
              </StyledButton>
            </div>
          </>
        )}
        {!error && (
          <>
            <div className={classes.actionsWrapper}>
              <Typography className={classes.title} variant="h5">
                Submitted Locations
              </Typography>
            </div>
            <div className={classes.helpTextWrapper}>
              <GetAppIcon className={classes.helperIcon} />
              <Typography variant="body1">
                You may download all submitted reports for one or more locations
                by selecting them from the table below and clicking the
                'Download Selected' button.
              </Typography>
            </div>
            <Typography variant="body1">
              All locations submitted by the retailers can be viewed here.
            </Typography>  
            <br />          
            <Paper className={classes.box} variant="outlined">
              <Typography className={classes.boxTitle} variant="subtitle1">
                Business Locations
              </Typography>              
              {/* <Link
                className={classes.showMoreLink}
                component="button"
                variant="body2"
                onClick={() => showMoreFilters ? setShowMoreFilter(false) : setShowMoreFilter(true)}                  >
                {showMoreFilters ? "Show less filters" : "Show more filters"}
              </Link> */}
              <Formik
                onSubmit={search}
                initialValues={{
                  search: searchTerms.term ? searchTerms.term: undefined,
                  authority: searchTerms.authority || store.get('KEYCLOAK_USER_HA')  || 'all',
                  location_type: searchTerms.location_type ? searchTerms.location_type: 'all',
                  reporting_status: searchTerms.reporting_status ? searchTerms.reporting_status: 'all',
                  underage: searchTerms.underage ? searchTerms.underage: 'all',
                  noi_report: searchTerms.noi_report ? searchTerms.noi_report: 'all',
                  product_report: searchTerms.product_report ? searchTerms.product_report: 'all',
                  manufacturing_report: searchTerms.manufacturing_report ? searchTerms.manufacturing_report: 'all',
                  sales_report:  searchTerms.sales_report ? searchTerms.sales_report: 'all',
                  fromdate: searchTerms.fromdate ? searchTerms.fromdate : null,
                  todate: searchTerms.todate ? searchTerms.todate : null
                }}
              >
                <Form>
                  <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                      <StyledTextField
                        name="search"
                        label="Search (Address, Business Name, Legal Name, Doing Business As)"
                      />
                    </Grid>
                    <Grid item md={3} xs={6}>
                      <StyledSelectField
                        name="authority"
                        options={healthAuthorityOptions}
                        label="Health Authority"
                      />
                    </Grid>
                    <Grid item md={3} xs={6}>
                      <StyledSelectField
                        name="location_type"
                        options={locationTypeOptions(true)}
                        label="Location Type"
                      />
                    </Grid>   
                    <Grid item md={2} xs={6}>
                      <StyledSelectField
                        name="underage"
                        options={[
                          {label: 'All', value: 'all'},
                          {label: 'Yes', value: 'Yes'},
                          {label: 'No', value: 'No'},
                          {label: 'Other', value: 'other'}
                        ]}
                        label="Underage Allowed"
                      />
                    </Grid>                 
                    <Grid item md={2} xs={6}>
                      <StyledSelectField
                        name="noi_report"
                        options={reportingStatusOptions(false)}
                        label="NOI Status"
                      />                     
                    </Grid>
                    {/*
                    <Grid item md={3} xs={6}>
                      <StyledSelectField
                        name="product_report"
                        options={reportingStatusOptions(false)}
                        label="Product Report Status"
                      />                     
                    </Grid> 
                    {showMoreFilters && 
                    <>             
                    <Grid item md={3} xs={6}>
                      <StyledSelectField
                        name="manufacturing_report"
                        options={reportingStatusOptions(true)}
                        label="Manufacturing Report Status"
                      />                     
                    </Grid> 
                    <Grid item md={3} xs={6}>
                      <StyledSelectField
                        name="sales_report"
                        options={reportingStatusOptions(true)}
                        label="Sales Report Status"
                      />                     
                    </Grid> 
                    </>}*/}
                    <Grid item md={2} xs={6}>
                      From
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          className={classes.root}
                          inputProps={{ className: classes.picker }}
                          TextFieldComponent={TextFieldComponent}
                          format="MM/dd/yyyy"
                          value={selectedFromDate ? moment(selectedFromDate) : null}
                          onChange={onFromDateChange}
                          showTodayButton={true}
                          clearable={true}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>   
                    <Grid item md={2} xs={6}>
                      To
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          className={classes.root}
                          inputProps={{ className: classes.picker }}
                          TextFieldComponent={TextFieldComponent}
                          format="MM/dd/yyyy"
                          value={selectedToDate ? moment(selectedToDate) : null}
                          onChange={onToDateChange}
                          showTodayButton={true}
                          clearable={true}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item md={1} xs={12}>                   
                      <Box
                        alignContent="center"
                        alignItems="center"
                        justifyContent="center"
                        display="flex"
                        minHeight="100%"
                      >
                        <StyledButton
                          fullWidth
                          variant="dialog-accept"
                          type="submit"
                        >
                          Search
                        </StyledButton>
                      </Box>
                    </Grid>
                  </Grid>                  
                  
                </Form>
              </Formik>
              <div>
                <Typography className={classes.tableRowCount} variant="body2">
                  {totalRowCount} retail locations.
                </Typography>
                <Box display ='flex' justifyContent='flex-end' my={2}>
                  <Box mx={2}/>
                    <Tooltip title={selectedRows.length > 8 ? "Can't open map with more than 8 locations at a time" : ''}>
                    <Box>
                      <StyledButton 
                        variant="small-outlined" 
                        disabled={!selectedRows?.length || selectedRows.length >8}
                        onClick={openMap}
                      >
                        Show on Map
                      </StyledButton>
                    </Box>
                  </Tooltip>
                  <Box mx={2}/>
                  <StyledMenus items={menuOptions} buttonComponent="Download"/>
                </Box>
              </div>
              <ReportStatusLegend /> <br/>
              <div className={'tableDiv'}>
                <StyledTable
                  columns={tableColumns}
                  options={{
                    selection: true,
                    pageSize: searchTerms.pageSize, //getInitialPagination(locations),
                    pageSizeOptions: [5, 10, 20, 30, 50],
                    sorting: true,
                  }}
                  onSelectionChange={(rows: BusinessLocation[]) => {
                    const currentLocationIds = locations.map(
                      (location) => location.id
                    );
                    const filterCurrentLocationsFromSelectedRows =
                      selectedRows.filter(
                        (selectedRow) =>
                          !currentLocationIds.includes(selectedRow.id)
                      );
                    const finalRows = [
                      ...filterCurrentLocationsFromSelectedRows,
                      ...rows,
                    ];
                    setSelectedRows(finalRows);
                  }}
                  onChangePage={(page: number) => {
                    setSearchTerms({
                      ...searchTerms,
                      page: page,
                    });
                  }}
                  onChangeRowsPerPage={(rowsPerPage: number) => {
                    setSearchTerms({
                      ...searchTerms,
                      pageSize: rowsPerPage,
                    });
                  }}
                  onOrderChange={(orderColumn: number, orderDirection: any) => {
                    if (orderColumn === -1) {
                      setSearchTerms({
                        ...searchTerms,
                        orderBy: undefined,
                        orderDirection: undefined,
                      });
                      return;
                    }                    
                    setSearchTerms({
                      ...searchTerms,
                      orderBy: orderColumn,
                      orderDirection,
                    });
                  }}
                  totalCount={totalRowCount}
                  page={searchTerms.page}
                  data={
                    locations
                      ? locations.map((row: BusinessLocation) => ({
                          ...row,
                          tableData: {
                            ...row.tableData,
                            checked: !!selectedRows.find(
                              (selected) => selected.id === row.id
                            ),
                          },
                        }))
                      : []
                  }
                />
              </div>
            </Paper>
          </>
        )}
      </div>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <SnackbarContent
          className={classes.downloadSnackbar}
          message={
            <div>
              <FileCopyIcon
                className={
                  zipLoading ? classes.fileLoading : classes.fileComplete
                }
              />
              <span className={classes.messageTextContent}>
                {`locations-${moment().format('MMM-DD-hh-mm')}.zip`}
              </span>
            </div>
          }
          action={
            zipLoading ? (
              <CircularProgress />
            ) : (
              <IconButton
                href={window.URL.createObjectURL(new Blob([zipFile]))}
                download={`locations-${moment().format('MMM-DD-hh-mm')}.zip`}
                onClick={() => {
                  setSnackbarOpen(false);
                }}
              >
                <SaveAltIcon className={classes.downloadButtonIcon} />
              </IconButton>
            )
          }
        />
      </Snackbar>
    </div>
  );
}