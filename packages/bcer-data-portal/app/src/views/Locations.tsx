import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Snackbar,
  CircularProgress,
  IconButton,
  SnackbarContent,
  Tooltip,
  Link,
  LinearProgress,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { useAxiosGet, useAxiosPostFormData } from '@/hooks/axios';
import { useKeycloak } from '@react-keycloak/web';
import GetAppIcon from '@mui/icons-material/GetApp';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
  reportingStatusOptions
} from 'vaping-regulation-shared-components';

import { BusinessLocation } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { healthAuthorityOptions} from '../constants/arrays'
import Favourite from '@/components/location/favourite';
import { useFavourite } from '@/hooks/useFavourite';
import { Query, QueryResult } from '@material-table/core';

const ContentWrapper = styled('div')({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
});

const Content = styled('div')({
  maxWidth: '1440px',
  width: '95%',
  padding: '20px 30px',
});

const HelpTextWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#E0E8F0',
  marginBottom: '30px',
  borderRadius: '5px',
});

const HelperIcon = styled(GetAppIcon)({
  fontSize: '45px',
  color: '#0053A4',
  paddingRight: '25px',
});

const BoxStyled = styled(Paper)({
  border: 'solid 1px #CDCED2',
  borderRadius: '4px',
  padding: '1.4rem',
});

const Title = styled(Typography)({
  padding: '10px 0px',
  color: '#002C71',
});

const BoxTitle = styled(Typography)({
  paddingBottom: '10px',
});

const TableRowCount = styled(Typography)({
  paddingBottom: '10px',
});

const ActionsWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: '10px',
});

const ActionLink = styled('span')({
  color: 'blue',
  cursor: 'pointer',
  textDecoration: 'underline',
});

const ButtonWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const DownloadSnackbar = styled(SnackbarContent)({
  height: '100px',
  backgroundColor: 'white',
  '& .MuiSnackbarContent-message': {
    fontWeight: '600',
    color: '#0053A4',
  },
  '& .MuiSnackbarContent-action': {
    minWidth: '64px',
  },
});

const MessageTextContent = styled('span')({
  paddingLeft: '10px',
});

const FileLoading = styled(FileCopyIcon)({
  fontSize: '2.5rem',
  color: 'rgba(0, 0, 0, 0.2)',
});

const FileComplete = styled(FileCopyIcon)({
  fontSize: '2.5rem',
  color: '#0053A4',
});

const DownloadButtonIcon = styled(SaveAltIcon)({
  color: '#285CBC',
  fontSize: '40px',
});

const DateFilterTitle = styled('p')({
  fontSize: '16px',
  fontFamily: 'BCSans,Raleway,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif',
  fontWeight: 400,
  lineHeight: 1.5,
  margin: 0,
  width: '100%',
  height: 'auto',
  minHeight : '16px',
});

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  backgroundColor: '#F5F5F5',
  height: '40px',
  width: '100%',
  borderRadius: '2px',
  '& .MuiInput-underline::before': {
    display: 'none',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  cursor: 'pointer',
  '& .MuiInputBase-input': {
    color: '#535353',
    fontSize: '16px',
    marginLeft: '9px',
    minWidth: '56px',
    height: '19px',
  },
}));

export default function Locations() {
  const navigate = useNavigate();
  const location = useLocation();
  const { keycloak } = useKeycloak();
  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const tableRef = useRef<any>(); //rerender the table when data is updated
  
  const {
    onSubmit,
    isSubmitting, 
    submitError,
    submitSuccess
  } = useFavourite();

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
  const [hasSearchParams, setHasSearchParam] = useState(false);

  const handleRouteWithHistory = (locationId: string) => {
    setAppGlobalContext({
      ...appGlobal,
      history: location
    })
    navigate(`/location/${locationId}`)
  }

  const tableColumns = [
    {
      title: 'Business Name',
      render: (rd: BusinessLocation) => <ActionLink onClick={() => handleRouteWithHistory(rd.id)}>{rd.business.businessName}</ActionLink>,
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
        rd.noi?.renewed_at ?? rd.noi?.created_at 
        ? `${moment(rd.noi?.renewed_at ?? rd.noi?.created_at).format('MMM DD, YYYY')}`
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
    searchTerms?.todate
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
    navigate('/');
  };

  // Date filter
  const [selectedFromDate, setFromDate] = useState(searchTerms.fromdate ? new Date(searchTerms.fromdate) : null);
  const [selectedToDate, setToDate] = useState(searchTerms.todate ? new Date(searchTerms.todate) : null);

  const handleFromDateChange = (newValue: Date | null) => {
    if (newValue && !isNaN(newValue.getTime())) {
      setFromDate(newValue);
    }
  };

  const handleToDateChange = (newValue: Date | null) => {
    if (newValue && !isNaN(newValue.getTime())) {
      setToDate(newValue);
    }
  };

  const search = (e: any) => {
    const authority = e.authority !== 'all' ? e.authority : undefined;
    const location_type = e.location_type !== 'all' ? e.location_type : undefined;
    const underage = e.underage !== 'all' ? e.underage : undefined;
    const noi_report = e.noi_report !== 'all' ? e.noi_report : undefined;
    const product_report = e.product_report !== 'all' ? e.product_report : undefined;
    const manufacturing_report = e.manufacturing_report !== 'all' ? e.manufacturing_report : undefined;
    const sales_report = e.sales_report !== 'all' ? e.sales_report : undefined;
    const fromdate = selectedFromDate !== null? moment(selectedFromDate.setHours(0,0,0,0)).format("MM/DD/YYYY HH:mm:ss"): null;
    const todate = selectedToDate !== null? moment(selectedToDate.setHours(23,59,59,0)).format("MM/DD/YYYY HH:mm:ss"): null;
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
    if (
      (searchTerms.term && searchTerms.term !== "") ||
      (searchTerms.authority && searchTerms.authority !== 'all') ||
      (searchTerms.location_type && searchTerms.location_type !== 'all') ||
      (searchTerms.reporting_status && searchTerms.reporting_status !== 'all') ||
      (searchTerms.underage && searchTerms.underage !== 'all') ||
      (searchTerms.noi_report && searchTerms.noi_report !== 'all') ||
      (searchTerms.product_report && searchTerms.product_report !== 'all') ||
      (searchTerms.manufacturing_report && searchTerms.manufacturing_report !== 'all') ||
      (searchTerms.sales_report && searchTerms.sales_report !== 'all') ||
      (searchTerms.fromdate && searchTerms.fromdate !== null) ||
      (searchTerms.todate && searchTerms.todate !== null)
    ) {
      setHasSearchParam(true);
    } else {
      setHasSearchParam(false);
    }
    localStorage.setItem('location_searchOptions', JSON.stringify(searchTerms));
    get();
  }, [searchTerms]);

  useEffect(() => {
    setTotalRowCount(data?.totalRows || 0);
    setLocations(data?.rows || []);
    if (tableRef.current) {tableRef.current.onQueryChange();} //rerender the table when data is updated
  }, [data]);
  
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

  const fetchLocations = useCallback((query: Query<BusinessLocation>): Promise<QueryResult<BusinessLocation>> =>
    new Promise((resolve) => {
      const locationsWithTableData = locations
      ? locations.map((row: BusinessLocation) => ({
          ...row,
          tableData: {
            ...row.tableData,
            checked: !!selectedRows.find(
              (selected) => selected.id === row.id
            ),
          },
        }))
      : [];

      resolve({
        data: locationsWithTableData,
        page: searchTerms.page,
        totalCount: totalRowCount,
      });
    })
  , [locations, searchTerms.page, totalRowCount]);

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
    if (selectedRows?.length) {
      const ids: string[] = selectedRows.reduce((prev, current) => [...prev, current?.id], []);
      navigate(`/map?locations=${ids.join(",")}`)
    }
  }

  const saveFavourite = (name: string) => {
    if (hasSearchParams) {
      const data = { title: name, searchParams: JSON.stringify(searchTerms) }
      onSubmit(data);
    } else {
      console.log("No search")
    }
  }

  const deserializeSearchParam = (searchParam: string) => {
    const search = JSON.parse(searchParam)
    setSearchTerms(search);
  }

  return (
    <ContentWrapper>
      <Content>
        {error && (
          <>
            <HelpTextWrapper>
              <HelperIcon />
              <Typography variant="body1">
                You do not have the correct role to view this page.
              </Typography>
            </HelpTextWrapper>
            <ButtonWrapper>
              <StyledButton variant="outlined" onClick={logout}>
                Log Out
              </StyledButton>
            </ButtonWrapper>
          </>
        )}
        {!error && (
          <>
            <ActionsWrapper>
              <Title variant="h5">
                Submitted Locations
              </Title>
            </ActionsWrapper>
            <HelpTextWrapper>
              <HelperIcon />
              <Typography variant="body1">
                You may download all submitted reports for one or more locations
                by selecting them from the table below and clicking the
                'Download Selected' button.
              </Typography>
            </HelpTextWrapper>
            <Typography variant="body1">
              All locations submitted by the retailers can be viewed here.
            </Typography>
            <br />
            <BoxStyled>
              <BoxTitle variant="subtitle1">
                Business Locations
              </BoxTitle>
              <Formik
                onSubmit={search}
                initialValues={{
                  search: searchTerms.term ? searchTerms.term : undefined,
                  authority: searchTerms.authority || store.get('KEYCLOAK_USER_HA') || 'all',
                  location_type: searchTerms.location_type ? searchTerms.location_type : 'all',
                  reporting_status: searchTerms.reporting_status ? searchTerms.reporting_status : 'all',
                  underage: searchTerms.underage ? searchTerms.underage : 'all',
                  noi_report: searchTerms.noi_report ? searchTerms.noi_report : 'all',
                  product_report: searchTerms.product_report ? searchTerms.product_report : 'all',
                  manufacturing_report: searchTerms.manufacturing_report ? searchTerms.manufacturing_report : 'all',
                  sales_report: searchTerms.sales_report ? searchTerms.sales_report : 'all',
                  fromdate: searchTerms.fromdate ? searchTerms.fromdate : null,
                  todate: searchTerms.todate ? searchTerms.todate : null
                }}
                key={JSON.stringify(searchTerms)}
              >
                {props => {
                  const {
                    resetForm
                  } = props;
                  return (
                    <Form>
                      <Box
                        alignContent="center"
                        alignItems="center"
                        justifyContent="end"
                        display="flex"
                        minHeight="100%"
                        padding="0 0 12px"
                        style={{ gap: 6 }}
                      >
                        <Link
                          component="button"
                          variant="body2"
                          type="button"
                          onClick={() => showMoreFilters ? setShowMoreFilter(false) : setShowMoreFilter(true)}
                          sx={{
                            float: 'right',
                            textDecoration: 'underline',
                            fontWeight: 'bold'
                          }}
                          >
                          {showMoreFilters ? "Show less filters" : "Show more filters"}
                        </Link>
                        <Divider orientation="vertical" flexItem />
                        <Link
                          component="button"
                          variant="body2"
                          type="reset"
                          onClick={() => {
                            resetForm({
                              values: {
                                search: null,
                                authority: 'all', location_type: 'all',
                                reporting_status: 'all', underage: 'all', noi_report: 'all', product_report: 'all',
                                manufacturing_report: 'all', sales_report: 'all', fromdate: null, todate: null
                              }
                            });
                            setSearchTerms({ page: 0, pageSize: 20 })
                          }}
                          sx={{
                            color: 'red',
                            textDecoration: 'underline',
                            fontWeight: 'bold'
                          }}
                        >
                          Clear all filters
                        </Link>
                      </Box>
                      <Grid container spacing={1}>
                        <Grid item md={6} xs={12} sx={{ p: 1 }}>
                          <StyledTextField
                            name="search"
                            label="Search (Address, Business Name, Legal Name, Doing Business As)"
                          />
                        </Grid>
                        <Grid item md={3} xs={6} sx={{ p: 1 }}>
                          <StyledSelectField
                            name="authority"
                            options={healthAuthorityOptions}
                            label="Health Authority"
                          />
                        </Grid>
                        <Grid item md={3} xs={6} sx={{ p: 1 }}>
                          <StyledSelectField
                            name="location_type"
                            options={locationTypeOptions(true)}
                            label="Location Type"
                          />
                        </Grid>
                        <Grid item md={3} xs={6} sx={{ p: 1 }}>
                          <StyledSelectField
                            name="underage"
                            options={[
                              { label: 'All', value: 'all' },
                              { label: 'Yes', value: 'Yes' },
                              { label: 'No', value: 'No' },
                              { label: 'Other', value: 'other' }
                            ]}
                            label="Underage Allowed"
                          />
                        </Grid>
                        <Grid item md={3} xs={6} sx={{ p: 1 }}>
                          <StyledSelectField
                            name="noi_report"
                            options={reportingStatusOptions(false, true)}
                            label="NOI Status"
                          />
                        </Grid>
                        <Grid item md={3} xs={6} sx={{ p: 1 }}>
                          <StyledSelectField
                            name="product_report"
                            options={reportingStatusOptions(false)}
                            label="Product Report Status"
                          />
                        </Grid>
                        {(showMoreFilters || searchTerms.sales_report || searchTerms.todate || searchTerms.fromdate)
                          &&
                          <>
                            <Grid item md={3} xs={6} sx={{ p: 1 }}>
                              <StyledSelectField
                                name="manufacturing_report"
                                options={reportingStatusOptions(true)}
                                label="Manufacturing Report Status"
                              />
                            </Grid>
                            <Grid item md={3} xs={6} sx={{ p: 1 }}>
                              <StyledSelectField
                                name="sales_report"
                                options={reportingStatusOptions(true)}
                                label="Sales Report Status"
                              />
                            </Grid>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <Grid item md={3} xs={6} sx={{ p: 1 }}>
                                <DateFilterTitle>Location Creation Start Date</DateFilterTitle>
                                <StyledDatePicker
                                  value={selectedFromDate}
                                  onChange={handleFromDateChange}
                                  format="MM/dd/yyyy"
                                  maxDate={selectedToDate ? selectedToDate : new Date()}
                                  minDate={new Date(1900, 1, 1)}
                                  disableHighlightToday={false}
                                  slotProps={{
                                    field: { clearable: true, onClear: () => setFromDate(null) },
                                  }}
                                />
                                <DateFilterTitle/>
                              </Grid>
                              <Grid item md={3} xs={6} sx={{ p: 1 }}>
                                <DateFilterTitle>Location Creation End Date</DateFilterTitle>
                                <StyledDatePicker
                                  value={selectedToDate}
                                  onChange={handleToDateChange}
                                  format="MM/dd/yyyy"
                                  maxDate={new Date()}
                                  minDate={selectedFromDate ? selectedFromDate : new Date(1900, 1, 1)}
                                  disableHighlightToday={false}
                                  slotProps={{
                                    field: { clearable: true, onClear: () => setToDate(null) },
                                  }}
                                />
                                <DateFilterTitle/>
                              </Grid>
                            </LocalizationProvider>
                          </>
                        }
                        <Grid item md={3} xs={6} sx={{ p: 1 }}>
                          <Box
                            alignContent="center"
                            alignItems="center"
                            display="flex"
                            minHeight="100%"
                            sx={{ gap: 1.875 }}
                          >
                            <StyledButton
                              fullWidth
                              variant="dialog-accept"
                              type="submit"
                              style={{ width: '65%' }}
                            >
                              Search
                            </StyledButton>
                            <Favourite
                              enableAdd={hasSearchParams}
                              handleSave={saveFavourite}
                              isSubmitting={isSubmitting}
                              submitSuccess={submitSuccess}
                              submitError={submitError}
                              handleSetSearchParams={deserializeSearchParam}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Form>)
                }}
              </Formik>
              <div>
                <TableRowCount variant="body2">
                  {totalRowCount} retail locations.
                </TableRowCount>
                <Box display='flex' justifyContent='flex-end' my={2}>
                  <Box mx={2} />
                  <Tooltip title={selectedRows.length > 8 ? "Can't open map with more than 8 locations at a time" : ''}>
                    <Box>
                      <StyledButton
                        variant="small-outlined"
                        disabled={!selectedRows?.length || selectedRows.length > 8}
                        onClick={openMap}
                      >
                        Show on Map
                      </StyledButton>
                    </Box>
                  </Tooltip>
                  <Box mx={2} />
                  <StyledMenus items={menuOptions} buttonComponent="Download" />
                </Box>
              </div>
              <ReportStatusLegend /> <br />
              {loading ? <LinearProgress /> : <Box pt={0.5} />}
              <div className={'tableDiv'}>
                <StyledTable
                  tableRef={tableRef}
                  columns={tableColumns}
                  data={fetchLocations}
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
                  onPageChange={(newPage: number, newPageSize: number) => {
                    setSearchTerms({
                      ...searchTerms,
                      page: newPage,
                      pageSize: newPageSize,
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
                />
              </div>
            </BoxStyled>
          </>
        )}
      </Content>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <DownloadSnackbar
          message={
            <div>
              zipLoading ? <FileLoading/> : <FileComplete/>
              <MessageTextContent>
                {`locations-${moment().format('MMM-DD-hh-mm')}.zip`}
              </MessageTextContent>
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
                <DownloadButtonIcon/>
              </IconButton>
            )
          }
        />
      </Snackbar>
    </ContentWrapper>
  );
}