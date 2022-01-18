import React, { useContext, useEffect, useRef, useState } from 'react';
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
  MenuItemProps,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { useAxiosGet, useAxiosPostFormData } from '@/hooks/axios';
import { useKeycloak } from '@react-keycloak/web';
import GetAppIcon from '@material-ui/icons/GetApp';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import moment from 'moment';
import store from 'store';

import {
  StyledButton,
  StyledSelectField,
  StyledTable,
  StyledTextField,
  StyledMenus,
  StyledMenuItems,
} from 'vaping-regulation-shared-components';
import { BusinessLocation } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';

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
});

export default function Locations() {
  const classes = useStyles();
  const history = useHistory();
  const [keycloak] = useKeycloak();
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState({
    term: undefined,
    authority: undefined,
    page: 0,
    pageSize: 20,
    orderBy: undefined,
    orderDirection: undefined,
  });
  const [locations, setLocations] = useState([]);

  const tableColumns = [
    {
      title: 'Business Name',
      field: 'business.businessName',
      sorting: false,
    },
    {
      title: 'Business Legal Name',
      field: 'business.legalName',
    },
    {
      title: 'Doing Business As',
      field: 'doingBusinessAs',
    },
    {
      title: 'Phone Number',
      field: 'phone',
      sorting: false,
    },
    {
      title: 'Address 1',
      render: (rd: BusinessLocation) =>
        `${rd.addressLine1}, ${rd.postal}, ${rd.city}`,
      sorting: false,
    },
    {
      title: 'Email Address',
      field: 'email',
      sorting: false,
    },
    {
      title: 'Submitted Date',
      render: (rd: BusinessLocation) =>
        rd.noi?.created_at
          ? `${moment(rd.noi.created_at).format('MMM DD, YYYY')}`
          : '',
    },
    {
      title: 'Health Authority',
      field: 'health_authority',
    },
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
    searchTerms?.orderBy
      ? (url += `&orderBy=${tableColumns[searchTerms.orderBy].title}`)
      : null;
    searchTerms?.orderDirection
      ? (url += `&order=${searchTerms.orderDirection.toUpperCase()}`)
      : null;
    return url;
  };

  const [{ data, loading, error }, get] = useAxiosGet(buildSearchUrl(), {
    manual: true,
  });
  const [{ data: zipFile, loading: zipLoading, error: zipError }, post] =
    useAxiosPostFormData(`/data/location/reportsFile`, { manual: true });
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const healthAuthorityOptions = [
    { value: 'all', label: 'All' },
    { value: 'coastal', label: 'Coastal' },
    { value: 'fraser', label: 'Fraser' },
    { value: 'interior', label: 'Interior' },
    { value: 'island', label: 'Island' },
    { value: 'northern', label: 'Northern' },
  ];

  const logout = () => {
    store.clearAll();
    keycloak.logout();
    history.push('/');
  };

  const search = (e: any) => {
    const authority = e.authority !== 'all' ? e.authority : undefined;
    setSearchTerms({
      ...searchTerms,
      term: e.search,
      authority,
    });
  };

  useEffect(() => {
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
        setAppGlobal({
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

  const viewLocation = () => {
    if(selectedRows?.length === 1){
      history.push(`/location/${selectedRows[0].id}`)
    }
  }

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
              All locations with a submitted Notice of Intent can be viewed
              here.
            </Typography>
            <div className={classes.subtitleWrapper}>
              <Typography className={classes.subtitle} variant="h6">
                Locations with a Notice of Intent
              </Typography>
            </div>
            <Paper className={classes.box} variant="outlined">
              <Typography className={classes.boxTitle} variant="subtitle1">
                Business Locations
              </Typography>
              <Formik
                onSubmit={search}
                initialValues={{
                  search: undefined,
                  authority: 'all',
                }}
              >
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={7}>
                      <StyledTextField
                        name="search"
                        label="Search (Address, Business Name, Legal Name, Doing Business As)"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <StyledSelectField
                        name="authority"
                        options={healthAuthorityOptions}
                        label="Health Authority"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Box
                        alignContent="center"
                        alignItems="center"
                        justifyContent="center"
                        display="flex"
                        minHeight="100%"
                      >
                        <StyledButton
                          fullWidth
                          variant="contained"
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
                  {totalRowCount} retail locations have submitted a Notice of
                  Intent
                </Typography>
                <Box display ='flex' justifyContent='flex-end' my={2}>
                  <Tooltip title={selectedRows.length > 1 ? "Can't view more than one location at a time" : ''}>
                    <Box>
                      <StyledButton 
                        variant="small-outlined" 
                        disabled={!selectedRows?.length || selectedRows.length >1}
                        onClick={viewLocation}
                      >
                        View Fullscreen
                      </StyledButton>
                    </Box>
                  </Tooltip>
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
              <div className={'tableDiv'}>
                <StyledTable
                  columns={tableColumns}
                  options={{
                    selection: true,
                    pageSize: 20,
                    pageSizeOptions: [20, 30, 50],
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
