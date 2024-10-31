import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { useAxiosGet } from '@/hooks/axios';
import {
  Typography,
  Paper,
  Button,
  Dialog,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

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
import { getSalesReportYear } from '@/utils/time';
import Loader from '@/components/Sales/Loader';
import { LocationUtil } from '@/utils/location.util';
import { getInitialPagination } from '@/utils/util';
import moment from 'moment';

const PREFIX = 'Overview';

const classes = {
  title: `${PREFIX}-title`,
  reportingPeriodDisclaimer: `${PREFIX}-reportingPeriodDisclaimer`,
  box: `${PREFIX}-box`,
  subtitle: `${PREFIX}-subtitle`,
  subtitleWrapper: `${PREFIX}-subtitleWrapper`,
  boxTitle: `${PREFIX}-boxTitle`,
  tableRowCount: `${PREFIX}-tableRowCount`,
  actionsWrapper: `${PREFIX}-actionsWrapper`,
  csvLink: `${PREFIX}-csvLink`,
  buttonIcon: `${PREFIX}-buttonIcon`,
  sendIcon: `${PREFIX}-sendIcon`,
  actionLink: `${PREFIX}-actionLink`,
  buttonWrapper: `${PREFIX}-buttonWrapper`,
  editButton: `${PREFIX}-editButton`,
  dialogWrap: `${PREFIX}-dialogWrap`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.title}`]: {
    color: '#0F327F',
    paddingBottom: '30px',
    paddingTop: 0,
  },
  [`& .${classes.reportingPeriodDisclaimer}`]: {
    display: 'flex',
    padding: '10px 15px',
    marginBottom: '20px'
  },
  [`& .${classes.box}`]: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  [`& .${classes.subtitle}`]: {
    color: '#0053A4',
  },
  [`& .${classes.subtitleWrapper}`]: {
    display: 'flex',
    alignItems: 'bottom',
    justifyContent: 'space-between',
    padding: '30px 0px 10px 0px',
  },
  [`& .${classes.boxTitle}`]: {
    paddingBottom: '10px',
  },
  [`& .${classes.tableRowCount}`]: {
    paddingBottom: '10px',
  },
  [`& .${classes.actionsWrapper}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
  },
  [`& .${classes.csvLink}`]: {
    textDecoration: 'none',
  },
  [`& .${classes.buttonIcon}`]: {
    color: '#285CBC',
    fontSize: '20px',
  },
  [`& .${classes.sendIcon}`]: {
    height: '24px',
    paddingRight: '4px',
  },
  [`& .${classes.actionLink}`]: {
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  [`& .${classes.buttonWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${classes.editButton}`]: {
    width: '90px',
    fontSize: '14px',
    minWidth: '90px',
    lineHeight: '18px',
  },
  [`& .${classes.dialogWrap}`]: {
    padding: '1rem 1.5rem',
  },
}));

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

export default function SalesOverview() {
  const navigate = useNavigate();
  const location = useLocation();

  const [{ data: outstanding, loading: outstandingLoading, error: outstandingError }] = useAxiosGet(`/sales/locations`);
  const [{ data: submitted, loading: submittedLoading, error: submittedError }] = useAxiosGet(`/sales/locations?isSubmitted=${true}`);
  const [{ data: download = [], loading: downloadLoading, error: downloadError }, getDownload] = useAxiosGet(`/sales/download/`, { manual: true });

  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);
  const [sale, setSale] = useContext(SalesReportContext);

  const [nonSubmittedOpen, setNonSubmittedOpen] = useState(false);
  const [submittedOpen, setSubmittedOpen] = useState(false);

  const [downloadFilename, setDownloadFilename] = useState('');
  const csvRef = useRef(null);

  //TODO: we don't have a salesReportComplete variable in appGlobal yet
  useEffect(() => {
    if (location.pathname.includes('success') && !appGlobal.noiComplete) {
      setAppGlobal({ ...appGlobal, noiComplete: true });
    }
  }, [location.pathname, setAppGlobal, appGlobal]);

  const getPeriodYear = (): number => {
    const now = moment();
    return now.isSameOrBefore(`${now.year()}-01-15`) ? now.year() - 1 : now.year();
  };
  const periodYear = getPeriodYear();

  const commonColumns = LocationUtil.getTableColumns(['doingBusinessAs', 'address1', 'locationType']) as any;

  return outstandingLoading || submittedLoading ? (
    <CircularProgress />
  ) : (
    <Root>
      <Loader
        open={downloadLoading}
        message="File downloading. Please wait…"
      />
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
                As a vapour product retailer, you must submit a Sales Report for
                location(s) that you have listed. You must submit 1 Sales Report
                per location by uploading a CSV file. To submit a Sales Report,
                click on the "<strong>Select</strong>" button in the table below
                for the location that you would like to submit. The deadline to
                submit your Sales Reports is January 15, {periodYear + 1}, for
                the reporting period of October 1, {periodYear - 1} – September
                30, {periodYear}.
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
                pageSize: getInitialPagination(outstanding?.data || []),
                pageSizeOptions: [5, 10, 20, 30, 50]
              }}
              columns={[
                ...commonColumns,
                {
                  title: 'Timeline',
                  sorting: false, 
                  render: (rd: BusinessLocation) =>
                    `${outstanding?.year}/${+outstanding?.year + 1}`,
                },
                {
                  title: 'Status',
                  sorting: false, 
                  render: (rd: BusinessLocation) => (
                    <SalesSubmittedStatus isSubmitted={false} />
                  ),
                },
                {
                  title: '',
                  sorting: false, 
                  render: (rd: BusinessLocation) => (
                    <StyledButton
                      className={classes.editButton}
                      disabled={!submitted?.isAbleToEdit}
                      variant="outlined"
                      onClick={() => {
                        setSale({
                          ...sale,
                          year: outstanding?.year,
                          locationId: rd.id,
                          address: rd.addressLine1,
                          doingBusinessAs: rd.doingBusinessAs,
                          isSubmitted: false,
                          file: undefined,
                          saleReports: [],
                        });
                        navigate('/sales/upload');
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
          <div>
            <Typography className={classes.tableRowCount} variant="body2">
              You have {(submitted?.data || []).length} retail location(s) that
              have submitted a Sales Report.
            </Typography>
  
            <Typography className={classes.tableRowCount} variant="body2">
              If you would like to update the Sales Report, please click "
              <strong>Select</strong>" for the location that you would like to
              update. <strong>Note</strong>: updating your Sales Report will
              replace any reports that were previously submitted for this
              location and reporting period. You may download a copy of your
              submitted report by selecting the download button beside "
              <strong>Select</strong>".
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
                pageSize: getInitialPagination(submitted?.data || []),
                pageSizeOptions: [5, 10, 20, 30, 50]
              }}
              columns={[
                ...commonColumns,
                {
                  title: 'Timeline',
                  sorting: false, 
                  render: (rd: BusinessLocation) =>
                    `${submitted?.year}/${+submitted?.year + 1}`,
                },
                {
                  title: 'Status',
                  sorting: false, 
                  render: (rd: BusinessLocation) => (
                    <SalesSubmittedStatus isSubmitted />
                  ),
                },
                {
                  title: '',
                  sorting: false, 
                  render: (rd: BusinessLocation) => (
                    <>
                      <Tooltip title="Download CSV" placement="top">
                        <IconButton variant="outlined">
                          <SaveAltIcon
                            className={classes.buttonIcon}
                            onClick={async () => {
                              try {
                                await getDownload({
                                  url: `/sales/download?locationId=${rd.id}&year=${submitted?.year}`,
                                });
                                
                                if (download && download.length > 0) {
                                  setDownloadFilename(rd.doingBusinessAs || 'sales_report');
                                  setTimeout(() => {
                                    if (csvRef.current) {
                                      csvRef.current.link.click();
                                    }
                                  }, 0);
                                } else {
                                  console.error('No data available for download');
                                }
                              } catch (error) {
                                console.error('Error downloading CSV:', error);
                              }
                            }}
                          />
                        </IconButton>
                      </Tooltip>
  
                      <StyledButton
                        className={classes.editButton}
                        variant="outlined"
                        disabled={!submitted?.isAbleToEdit}
                        onClick={() => {
                          setSale({
                            ...sale,
                            year: submitted?.year,
                            locationId: rd.id,
                            address: rd.addressLine1,
                            doingBusinessAs: rd.doingBusinessAs,
                            isSubmitted: true,
                            file: undefined,
                            saleReports: [],
                          });
                          navigate('/sales/upload');
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
                  ...commonColumns,
                  {
                    title: 'Timeline',
                    sorting: false, 
                    render: (rd: BusinessLocation) =>
                      `${outstanding?.year}/${+outstanding?.year + 1}`,
                  },
                  {
                    title: 'Status',
                    sorting: false, 
                    render: (rd: BusinessLocation) => (
                      <SalesSubmittedStatus isSubmitted={false} />
                    ),
                  },
                  {
                    title: '',
                    sorting: false, 
                    render: (rd: BusinessLocation) => (
                      <StyledButton
                        className={classes.editButton}
                        disabled={!submitted?.isAbleToEdit}
                        variant="outlined"
                        onClick={() => {
                          setSale({
                            ...sale,
                            year: outstanding?.year,
                            locationId: rd.id,
                            address: rd.addressLine1,
                            doingBusinessAs: rd.doingBusinessAs,
                            isSubmitted: false,
                            file: undefined,
                            saleReports: [],
                          });
                          navigate('/sales/upload');
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
            <div>
              <Typography className={classes.tableRowCount} variant="body2">
                You have {(submitted?.data || []).length} retail location(s)
                that have submitted a Sales Report.
              </Typography>
              <Typography className={classes.tableRowCount} variant="body2">
                If you would like to update the Sales Report, please click "
                <strong>Select</strong>" for the location that you would like to
                update. <strong>Note</strong>: updating your Sales Report will
                replace any reports that were previously submitted for this
                location and reporting period. You may download a copy of your
                submitted report by selecting the download button beside "
                <strong>Select</strong>".
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
                  ...commonColumns,
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
                                try {
                                  await getDownload({
                                    url: `/sales/download?locationId=${rd.id}&year=${submitted?.year}`, // or outstanding?.year for the Outstanding table
                                  });
                                  
                                  if (download && download.length > 0) {
                                    setDownloadFilename(rd.doingBusinessAs || 'sales_report');
                                    setTimeout(() => {
                                      if (csvRef.current) {
                                        csvRef.current.link.click();
                                      }
                                    }, 0);
                                  } else {
                                    console.error('No data available for download');
                                  }
                                } catch (error) {
                                  console.error('Error downloading CSV:', error);
                                }
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
                              file: undefined,
                              saleReports: [],
                            });
                            navigate('/sales/upload');
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
    </Root>
  );
}
