import React, { useContext, useEffect, useState } from 'react';
import { makeStyles, Typography, Paper, Snackbar, CircularProgress, IconButton, SnackbarContent } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { useAxiosGet, useAxiosPostFormData } from '@/hooks/axios';
import { useKeycloak } from '@react-keycloak/web';
import GetAppIcon from '@material-ui/icons/GetApp';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import moment from 'moment';
import store from 'store';

import { StyledTable, StyledButton } from 'vaping-regulation-shared-components';
import { BusinessLocationHeaders } from '@/constants/localEnums';
import { BusinessLocation } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';

const useStyles = makeStyles({
  loadingWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center'
  },
  content: {
    maxWidth: '1440px',
    width: '95%',
    padding: '30px'
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
    padding: '20px 0px',
    color: '#002C71'
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
    paddingBottom: '10px'
  },
  tableRowCount: {
    paddingBottom: '10px'
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
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
    paddingRight: '4px'
  },
  actionLink: {
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  downloadSnackbar: {
    height: '100px',
    backgroundColor: 'white',
    '& .MuiSnackbarContent-message': {
      fontWeight: '600',
      color: '#0053A4'
    },
    '& .MuiSnackbarContent-action': {
      minWidth: '64px'
    }
  },
  messageTextContent: {
    paddingLeft: '10px'
  },
  fileLoading: {
    fontSize: '2.5rem',
    color: 'rgba(0, 0, 0, 0.2)'
  },
  fileComplete: {
    fontSize: '2.5rem',
    color: '#0053A4'
  },
  downloadButtonIcon: {
    color: '#285CBC',
    fontSize: '40px',
  },
});

export default function Locations() {
  const classes = useStyles();
  const history = useHistory();
  const [keycloak] = useKeycloak();
  const [selectedRows, setSelectedRows] = useState([]);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { location: { pathname } } = history;
  const [{ data: locations, loading, error }, get] = useAxiosGet(`/data/location?includes=noi`, { manual: true });
  const [{ data: zipFile, loading: zipLoading, error: zipError }, post] = useAxiosPostFormData(`/data/location/reportsFile`, { manual: true });
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const logout = () => {
    store.clearAll();
    keycloak.logout();
    history.push('/');
  };

  const getReportsFile = (requestFilter: string = 'selected') => {
    let postConfig: { url: string; data: Array<string> } = { url: '', data: [] };
    switch (requestFilter) {

      case 'all':
        postConfig.url = '/data/location/reportsFile?getAll=true'
        break

      case 'selected':
        postConfig.url = '/data/location/reportsFile'
        postConfig.data = selectedRows.map(row => row.id)
        break

      case 'NOI':
        postConfig.url = '/data/location/reportsFile?getAll=true&getNOI=true'
        break

      default:
        return
    }

    post(postConfig)
    setSnackbarOpen(true)
  }

  useEffect(() => {
    if (locations && !error) {
    } else {
      if (error) {
        setAppGlobal({ ...appGlobal, networkErrorMessage: error?.response?.data?.message })
      }
    }
  }, [error]);

  return (
    <div className={classes.contentWrapper}>
      <div className={classes.content}>
        {!error && <div className={classes.actionsWrapper}>
          <Typography className={classes.title} variant='h5'>Submitted Locations</Typography>
          <div className={classes.buttonWrapper}>
            <StyledButton variant='outlined' onClick={logout}>
              Log Out
            </StyledButton>
          </div>
        </div>
        }
        {error &&
          <>
            <div className={classes.helpTextWrapper}>
              <GetAppIcon className={classes.helperIcon} />
              <Typography variant='body1'>
                You do not have the correct role to view this page.
              </Typography>
            </div>
            <div className={classes.buttonWrapper}>
              <StyledButton variant='outlined' onClick={logout}>
                Log Out
              </StyledButton>
            </div>
          </>
        }
        {!error &&
          <>
            <div className={classes.helpTextWrapper}>
              <GetAppIcon className={classes.helperIcon} />
              <Typography variant='body1'>
                You may download all submitted reports for one or more locations by selecting them from the table below and clicking the 'Download Selected' button.
              </Typography>
            </div>
            <Typography variant='body1'>
              All locations with a submitted Notice of Intent can be viewed here.
            </Typography>
            <div className={classes.subtitleWrapper}>
              <Typography className={classes.subtitle} variant='h6' >Locations with a Notice of Intent</Typography>
            </div>
            <Paper className={classes.box} variant='outlined' >
              <Typography className={classes.boxTitle} variant='subtitle1'>Business Locations</Typography>
              <div className={classes.actionsWrapper}>
                <Typography className={classes.tableRowCount} variant='body2'>{totalRowCount} retail locations have submitted a Notice of Intent</Typography>
                <StyledButton
                  variant='outlined'
                  onClick={() => getReportsFile('NOI')}
                  disabled={zipLoading}
                >
                  <SaveAltIcon className={classes.buttonIcon} />
                  Download All NOIs
                </StyledButton >
                <StyledButton
                  variant='outlined'
                  onClick={() => getReportsFile()}
                  disabled={!selectedRows.length || zipLoading}
                >
                  <SaveAltIcon className={classes.buttonIcon} />
                  Download Selected
                </StyledButton>
                <StyledButton
                  variant='contained'
                  onClick={() => getReportsFile('all')}
                  disabled={zipLoading}
                >
                  <SaveAltIcon className={classes.buttonIconAlt} />
                  Download All Locations
                </StyledButton>
              </div>
              <div className={'tableDiv'}>
                <StyledTable
                  columns={[
                    {
                      title: 'Business Name',
                      field: 'business.businessName',
                      sorting: false
                    },
                    {
                      title: 'Business Legal Name',
                      field: 'business.legalName'
                    },
                    {
                      title: 'Phone Number',
                      field: 'phone',
                      sorting: false
                    },
                    {
                      title: 'Address 1',
                      render: (rd: BusinessLocation) => `${rd.addressLine1}, ${rd.postal}, ${rd.city}`,
                      sorting: false
                    },
                    {
                      title: 'Email Address',
                      field: 'email',
                      sorting: false,
                    },
                    {
                      title: 'Submitted Date',
                      render: (rd: BusinessLocation) => rd.noi?.created_at ? `${moment(rd.noi.created_at).format('MMM DD, YYYY')}` : '',
                    },
                    {
                      title: 'Health Authority',
                      field: 'health_authority'
                    }
                  ]}
                  options={{
                    selection: true,
                    pageSize: 20,
                    pageSizeOptions: [20, 30, 50],
                    sorting: true
                  }}
                  onSelectionChange={(rows: any) => {
                    const displayedIds = locations.rows.map((result: BusinessLocation) => result.id)
                    const selectedRowsNotDisplayed = selectedRows.filter(selectedRow => {
                      return !displayedIds.includes(selectedRow.id)
                    })
                    setSelectedRows([...selectedRowsNotDisplayed, ...rows])
                  }}
                  data={(query: any) =>
                    new Promise((resolve, reject) => {
                      let URL = `/data/location?page=${query.page + 1}&numPerPage=${query.pageSize}&includes=business,noi`
                      query?.orderBy?.title ? URL += `&orderBy=${query.orderBy.title}` : null
                      query?.orderDirection ? URL += `&order=${query.orderDirection.toUpperCase()}` : null
                      get({ url: URL })
                        .then(res => {
                          setTotalRowCount(res?.data?.totalRows)
                          resolve({
                            data: res?.data ? res.data.rows?.map((row: BusinessLocation) => selectedRows.find(selected => selected.id === row.id) ? { ...row, tableData: { checked: true } } : row) : [],
                            page: res?.data ? res.data.pageNum - 1 : 0,
                            totalCount: res?.data ? res.data.totalRows : 0,
                          })
                        })
                    })
                  }
                />
              </div>
            </Paper>
          </>
        }
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
              <FileCopyIcon className={zipLoading ? classes.fileLoading : classes.fileComplete} />
              <span className={classes.messageTextContent}>
                {`locations-${moment().format('MMM-DD-hh-mm')}.zip`}
              </span>
            </div>
          }
          action={[
            zipLoading
              ?
              <CircularProgress />
              :
              <IconButton
                href={window.URL.createObjectURL(new Blob([zipFile]))}
                download={`locations-${moment().format('MMM-DD-hh-mm')}.zip`}
                onClick={() => {
                  setSnackbarOpen(false)
                }}
              >
                <SaveAltIcon className={classes.downloadButtonIcon} />
              </IconButton>,
          ]}
        />
      </Snackbar>
    </div>
  );
}
