import React, { useContext, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { useAxiosGet } from '@/hooks/axios';
import {
  makeStyles,
  Typography,
  Paper,
  styled,
  Button,
  Dialog,
  Tooltip,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import moment from 'moment';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';

import { StyledTable, StyledButton } from 'vaping-regulation-shared-components';
import {
  BusinessLocationHeaders,
  SalesReportCSVHeaders,
} from '@/constants/localEnums';
import { BusinessLocation } from '@/constants/localInterfaces';
import NoiSubmission from '@/components/Noi/NoiSubmission';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import SaleBanner from './SaleBanner';
import { SalesReportContext } from '@/contexts/SalesReport';
import SalesSubmittedStatus from '@/components/Sales/SalesSubmittedStatus';
import { SalesTable } from '@/components/Sales/SalesTable';

const IconButton = styled(Button)({
  minWidth: '30px !important',
  height: '30px',
  marginRight: '0.5rem',
  padding: '5px 0 !important',
  color: '#234075',
  textTransform: 'none',
  border: '1px solid #234075',
  fontSize: '16px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#e6efff',
    boxShadow: 'none',
  },
});

const FullscreenButton = styled(Button)({
  minWidth: '150px',
  height: '30px',
  marginRight: '0.5rem',
  marginBottom: '0.5rem',
  padding: '5px 0',
  color: '#234075',
  textTransform: 'none',
  borderRadius: '5px',
  backgroundColor: '#F2F9FF',
  fontSize: '12px',
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: '#e6efff',
    boxShadow: 'none',
  },
});

const useStyles = makeStyles({
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71',
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
    color: '#285CBC',
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
  editButton: {
    width: '90px',
    fontSize: '14px',
    minWidth: '90px',
    lineHeight: '18px',
  },
  dialogWrap: {
    padding: '1rem 1.5rem',
  },
});

export default function SalesOverview() {
  const classes = useStyles();
  const history = useHistory();

  const {
    location: { pathname },
  } = history;
  const [
    { data: outstanding, loading: outstandingLoading, error: outstandingError },
  ] = useAxiosGet(`/sales/locations`);
  const [
    { data: submitted, loading: submittedLoading, error: submittedError },
  ] = useAxiosGet(`/sales/locations?isSubmitted=${true}`);
  const [
    { data: download = [], loading: downloadLoading, error: downloadError },
    getDownload,
  ] = useAxiosGet(`/sales/download/`, { manual: true });

  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [sale, setSale] = useContext(SalesReportContext);

  // full screen
  const [nonSubmittedOpen, setNonSubmittedOpen] = useState(false);
  const [submittedOpen, setSubmittedOpen] = useState(false);

  // download CSV
  const [downloadFilename, setDownloadFilename] = useState<string>('');
  const csvRef = useRef(null);

  useEffect(() => {
    if (pathname.includes('success') && !appGlobal.noiComplete) {
      setAppGlobal({ ...appGlobal, noiComplete: true });
    }
  }, [pathname, setAppGlobal, appGlobal]);

  return outstandingLoading || submittedLoading ? (
    <CircularProgress />
  ) : (
    <>
      <div>
        <div className={classes.actionsWrapper}>
          <Typography className={classes.title} variant="h5">
            Sales Reports
          </Typography>
        </div>
        <div>
          <SaleBanner
            content={
              <span>
                You are required to submit a Sale Report for all locations that
                you have added. You must only submit 1 Sale Report per location.
                Select the locations that this Sale Report applies, by clicking
                on "<strong>Select</strong>" button. You must submit a Sale
                Report for all locations where you formulate, package or
                re-package e-substances.
              </span>
            }
          />
        </div>
        <div className={classes.subtitleWrapper}>
          <Typography className={classes.subtitle} variant="h6">
            Outstanding Sales Reports
          </Typography>
        </div>
        <Paper variant="outlined" className={classes.box}>
          <Typography className={classes.boxTitle} variant="subtitle1">
            Business Locations
          </Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant="body2">
              You have {outstanding?.data?.length} retail location(s) that are
              missing Sales Reports
            </Typography>
          </div>
          <div>
            <SalesTable
              fullscreenButton={
                <FullscreenButton
                  variant="outlined"
                  onClick={() => setNonSubmittedOpen(true)}
                >
                  <ZoomOutMapIcon fontSize="small" />
                  View Fullscreen
                </FullscreenButton>
              }
              options={{
                fixedColumns: {
                  right: 1,
                },
                search: true,
                searchFieldAlignment: 'left',
              }}
              columns={[
                {
                  title: 'Doing Business As',
                  field: 'doingBusinessAs',
                  render: (rd: BusinessLocation) => rd.doingBusinessAs,
                },
                {
                  title: 'Address 1',
                  field: 'addressLine1',
                  render: (rd: BusinessLocation) => `${rd.addressLine1}`,
                },

                {
                  title: 'City',
                  field: 'city',
                  render: (rd: BusinessLocation) => rd.city,
                },
                {
                  title: 'Timeline',
                  render: (rd: BusinessLocation) =>
                    `${outstanding?.year}/${+outstanding?.year + 1}`,
                },
                {
                  title: 'Status',
                  render: (rd: BusinessLocation) => (
                    <SalesSubmittedStatus isSubmitted={false} />
                  ),
                },
                {
                  title: '',
                  render: (rd: BusinessLocation) => (
                    <StyledButton
                      className={classes.editButton}
                      variant="outlined"
                      onClick={() => {
                        setSale({
                          ...sale,
                          year: outstanding?.year,
                          locationId: rd.id,
                          address: rd.addressLine1,
                          doingBusinessAs: rd.doingBusinessAs,
                          isSubmitted: false,
                        });
                        history.push('/sales/upload');
                      }}
                    >
                      Select
                    </StyledButton>
                  ),
                },
              ]}
              data={outstanding?.data || []}
            />
          </div>
        </Paper>
        <div className={classes.subtitleWrapper}>
          <Typography className={classes.subtitle} variant="h6">
            Submitted Sales Reports
          </Typography>
        </div>
        <Paper className={classes.box} variant="outlined">
          <Typography className={classes.boxTitle} variant="subtitle1">
            Business Locations
          </Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant="body2">
              You have {(submitted?.data || []).length} retail location(s)
            </Typography>
          </div>

          <div>
            <SalesTable
              fullscreenButton={
                <FullscreenButton
                  variant="outlined"
                  onClick={() => setSubmittedOpen(true)}
                >
                  <ZoomOutMapIcon fontSize="small" />
                  View Fullscreen
                </FullscreenButton>
              }
              options={{
                fixedColumns: {
                  right: 1,
                },
                search: true,
                searchFieldAlignment: 'left',
              }}
              columns={[
                {
                  title: 'Doing Business As',
                  field: 'doingBusinessAs',
                  render: (rd: BusinessLocation) => rd.doingBusinessAs,
                },
                {
                  title: 'Address 1',
                  field: 'addressLine1',
                  render: (rd: BusinessLocation) => `${rd.addressLine1}`,
                },

                {
                  title: 'City',
                  field: 'city',
                  render: (rd: BusinessLocation) => rd.city,
                },
                {
                  title: 'Timeline',
                  render: (rd: BusinessLocation) =>
                    `${submitted?.year}/${+submitted?.year + 1}`,
                },
                {
                  title: 'Status',
                  render: (rd: BusinessLocation) => (
                    <SalesSubmittedStatus isSubmitted />
                  ),
                },
                {
                  title: '',
                  render: (rd: BusinessLocation) => (
                    <>
                      <Tooltip title="Download CSV" placement="top">
                        <IconButton variant="outlined">
                          <SaveAltIcon
                            className={classes.buttonIcon}
                            onClick={async () => {
                              await getDownload({
                                url: `/sales/download?locationId=${
                                  rd.id
                                }&year=${moment().year() - 1}`,
                              });
                              setDownloadFilename(rd.doingBusinessAs);
                              csvRef.current.link.click();
                            }}
                          />
                        </IconButton>
                      </Tooltip>

                      <StyledButton
                        className={classes.editButton}
                        variant="outlined"
                        // disabled={!submitted?.isAbleToEdit}
                        onClick={() => {
                          setSale({
                            ...sale,
                            year: submitted?.year,
                            locationId: rd.id,
                            address: rd.addressLine1,
                            doingBusinessAs: rd.doingBusinessAs,
                            isSubmitted: true,
                          });
                          history.push('/sales/upload');
                        }}
                      >
                        Select
                      </StyledButton>
                    </>
                  ),
                },
              ]}
              data={submitted?.data || []}
            />
          </div>
        </Paper>
        <CSVLink
          ref={csvRef}
          headers={Object.keys(SalesReportCSVHeaders)}
          data={download}
          filename={`sales_report_${downloadFilename}.csv`}
          className={classes.csvLink}
          target="_blank"
        />
      </div>
      {/* nonSubmittedDialog */}
      <Dialog
        fullScreen
        open={nonSubmittedOpen}
        onClose={() => setNonSubmittedOpen((open) => !open)}
      >
        <div className={classes.dialogWrap}>
          <div className={classes.subtitleWrapper}>
            <Typography className={classes.subtitle} variant="h6">
              Outstanding Sales Reports
            </Typography>
          </div>
          <Paper variant="outlined" className={classes.box}>
            <Typography className={classes.boxTitle} variant="subtitle1">
              Business Locations
            </Typography>
            <div className={classes.actionsWrapper}>
              <Typography className={classes.tableRowCount} variant="body2">
                You have {(outstanding?.data || []).length} retail location(s)
                that are missing Sales Reports
              </Typography>
            </div>
            <div>
              <SalesTable
                options={{
                  fixedColumns: {
                    right: 1,
                  },
                  search: true,
                  searchFieldAlignment: 'left',
                }}
                columns={[
                  {
                    title: 'Doing Business As',
                    field: 'doingBusinessAs',
                    render: (rd: BusinessLocation) => rd.doingBusinessAs,
                  },
                  {
                    title: 'Address 1',
                    field: 'addressLine1',
                    render: (rd: BusinessLocation) => `${rd.addressLine1}`,
                  },

                  {
                    title: 'City',
                    field: 'city',
                    render: (rd: BusinessLocation) => rd.city,
                  },
                  {
                    title: 'Timeline',
                    render: (rd: BusinessLocation) =>
                      `${outstanding?.year}/${+outstanding?.year + 1}`,
                  },
                  {
                    title: 'Status',
                    render: (rd: BusinessLocation) => (
                      <SalesSubmittedStatus isSubmitted={false} />
                    ),
                  },
                  {
                    title: '',
                    render: (rd: BusinessLocation) => (
                      <StyledButton
                        className={classes.editButton}
                        variant="outlined"
                        onClick={() => {
                          setSale({
                            ...sale,
                            year: outstanding?.year,
                            locationId: rd.id,
                            address: rd.addressLine1,
                            doingBusinessAs: rd.doingBusinessAs,
                            isSubmitted: false,
                          });
                          history.push('/sales/upload');
                        }}
                      >
                        Select
                      </StyledButton>
                    ),
                  },
                ]}
                data={outstanding?.data || []}
              />
            </div>
          </Paper>
          <div>
            <StyledButton
              variant="outlined"
              onClick={() => setNonSubmittedOpen(false)}
              style={{ margin: '1rem 0' }}
            >
              Close
            </StyledButton>
          </div>
        </div>
      </Dialog>
      {/* Submitted Dialog */}
      <Dialog
        fullScreen
        open={submittedOpen}
        onClose={() => setSubmittedOpen((open) => !open)}
      >
        <div className={classes.dialogWrap}>
          <div className={classes.subtitleWrapper}>
            <Typography className={classes.subtitle} variant="h6">
              Submitted Sales Reports
            </Typography>
          </div>
          <Paper className={classes.box} variant="outlined">
            <Typography className={classes.boxTitle} variant="subtitle1">
              Business Locations
            </Typography>
            <div className={classes.actionsWrapper}>
              <Typography className={classes.tableRowCount} variant="body2">
                You have {(submitted?.data || []).length} retail location(s)
              </Typography>
            </div>
            <div>
              <SalesTable
                options={{
                  fixedColumns: {
                    right: 1,
                  },
                  search: true,
                  searchFieldAlignment: 'left',
                }}
                columns={[
                  {
                    title: 'Doing Business As',
                    field: 'doingBusinessAs',
                    render: (rd: BusinessLocation) => rd.doingBusinessAs,
                  },
                  {
                    title: 'Address 1',
                    field: 'addressLine1',
                    render: (rd: BusinessLocation) => `${rd.addressLine1}`,
                  },

                  {
                    title: 'City',
                    field: 'city',
                    render: (rd: BusinessLocation) => rd.city,
                  },
                  {
                    title: 'Timeline',
                    render: (rd: BusinessLocation) =>
                      `${submitted?.year}/${+submitted?.year + 1}`,
                  },
                  {
                    title: 'Status',
                    render: (rd: BusinessLocation) => (
                      <SalesSubmittedStatus isSubmitted />
                    ),
                  },
                  {
                    title: '',
                    render: (rd: BusinessLocation) => (
                      <>
                        <Tooltip title="Download CSV" placement="top">
                          <IconButton variant="outlined">
                            <SaveAltIcon
                              className={classes.buttonIcon}
                              onClick={async () => {
                                await getDownload({
                                  url: `/sales/download?locationId=${
                                    rd.id
                                  }&year=${moment().year() - 1}`,
                                });
                                csvRef.current.link.click();
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                        <StyledButton
                          className={classes.editButton}
                          disabled={!submitted?.isAbleToEdit}
                          variant="outlined"
                          onClick={() => {
                            setSale({
                              ...sale,
                              year: submitted?.year,
                              locationId: rd.id,
                              address: rd.addressLine1,
                              doingBusinessAs: rd.doingBusinessAs,
                              isSubmitted: true,
                            });
                            history.push('/sales/upload');
                          }}
                        >
                          Select
                        </StyledButton>
                      </>
                    ),
                  },
                ]}
                data={submitted?.data || []}
              />
            </div>
          </Paper>
          <div>
            <StyledButton
              variant="outlined"
              onClick={() => setSubmittedOpen(false)}
              style={{ margin: '1rem 0' }}
            >
              Close
            </StyledButton>
          </div>
        </div>
      </Dialog>
    </>
  );
}
