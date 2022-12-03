import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import moment from 'moment';

import { useAxiosGet } from '@/hooks/axios';
import { Divider, Grid, makeStyles, Typography, Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import ArrowBack from '@material-ui/icons/ArrowBack';
import SendIcon from '@material-ui/icons/Send';

import FileCheckGreen from '@/assets/images/file-check-green.png';

import { StyledTable, StyledButton } from 'vaping-regulation-shared-components';
import { BusinessLocation, ManufacturingReport } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import FullScreen from '@/components/generic/FullScreen';
import TableWrapper from '@/components/generic/TableWrapper';

const useStyles = makeStyles({
  bannerWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#F8F2E4',
    marginBottom: '20px',
    borderRadius: '5px',
  },
  bannerHeader: {
    fontWeight: 600,
    paddingBottom: '10px'
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem 1.4rem 0rem 1.4rem',
    marginBottom: '30px',
  },
  tableBox: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '2rem',
    marginBottom: '30px',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  highlighted: {
    fontWeight: 600,
    color: '#0053A4',
  },
  successBanner: {
    display: 'flex',
    backgroundColor: '#E7F9EA',
    borderRadius: '4px',
    padding: '20px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  bannerIcon: {
    fontSize: '45px',
    color: '#f3b229',
  },
  successImg: {
    maxHeight: '48px',
    marginRight: '2rem',
  },
  bannerText: {
    fontWeight: 600,
    color: '#3A3A3A'
  },
  subtitleWrapper: {
    display: 'flex',
    alignItems: 'bottom',
    justifyContent: 'space-between',
    padding: '30px 0px 10px 0px',
  },
  floatRight: {
    float: 'right',
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
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  sendIcon: {
    height: '24px',
    paddingRight: '4px'
  },
  dividerGrid: {
    margin: '1rem 0'
  },
  viewLink: {
    color: '#0053A4',
    fontSize: '16px',
    letterSpacing: '0',
    lineHeight: '20px',
    textDecoration: 'underline',
    '&:hover': {
      backgroundColor: 'transparent',
    }
  },
  listGroup: {
    paddingLeft: '15px',
    paddingBottom: '15px'
  },
  listRow: {
    display: 'flex',
    paddingTop: '15px'
  },
  listBullet: {
    margin: '10px 15px 0px 0px',
    minHeight: '6px',
    minWidth: '6px',
    maxHeight: '6px',
    maxWidth: '6px',
    borderRadius: '5px',
    backgroundColor: '#0053A4'
  },
  pageDescription: {
    padding: '20px 0'
  },
  highlightedText: {
    fontWeight: 600,
    color: '#0053A4'
  },
});

export default function ManufacturingOverview() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  let [success, setSuccess] = useState<boolean>(false);
  let viewFullscreenTable = useState<boolean>(false);

  const [{ data: manufacturingReports = [], error: manufacturingError }] = useAxiosGet(`/manufacturing`);
  const [{ data: locations = [], loading, error: locationsError }] = useAxiosGet(`/manufacturing/locations`);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  useEffect(() => {
    if (locationsError) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(locationsError)})
    }
    if (manufacturingError) {
      setAppGlobal({...appGlobal, networkErrorMessage: formatError(manufacturingError)})
    }
  }, [locationsError, manufacturingError ])

  useEffect(() => {
    if (searchParams.get('success')) {
      if (locations.length > 0 && !locations.find((l: BusinessLocation) => l.manufactures?.length === 0)) {
        setSuccess(true);
      };
    };
  }, [setSuccess, locations, searchParams]);

  useEffect(() => {
    if (success && !appGlobal.manufacturingReportComplete) {
      setAppGlobal({ ...appGlobal, manufacturingReportComplete: true });
    }
  }, [success, appGlobal]);

  return loading ? <CircularProgress /> : (
    <>
      <div>
        <Grid container justify='space-between' alignItems='center'>
          <Grid item xs={8}>
            <Typography className={classes.title} variant='h5'>Manufacturing Report</Typography>
          </Grid>
          <Grid item xs={4}>
            <StyledButton className={classes.floatRight} variant='contained' onClick={() => history.push('/manufacturing/submit')}>
              <SendIcon className={classes.sendIcon} />
              Submit Manufacturing Report
            </StyledButton>
          </Grid>
        </Grid>
        {success && (
          <div className={classes.successBanner}>
            <img src={FileCheckGreen} className={classes.successImg} alt='Success Icon' />
            <Typography variant='body2' className={classes.bannerText}>Your Manufacturing Report has been uploaded.</Typography>
          </div>
        )}
        {locations.filter((l: BusinessLocation) => !l.manufactures.length).length ? (
          <Paper className={classes.bannerWrapper}>
            <Grid container>
              <Grid item xs={1}>
                <ReportProblemOutlinedIcon className={classes.bannerIcon} />
              </Grid>
              <Grid item xs={11}>
                <Typography variant='body1' className={classes.bannerHeader}>
                  You have outstanding manufacturing reports that need to be submitted
                </Typography>
                <Typography variant='body1' className={classes.bannerHeader}>
                  To submit your manufacturing report click the "Submit Manufacturing Report" button.
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.dividerGrid}>
                <Divider light variant='middle' />
              </Grid>
              <Grid item xs={1}>
                <HelpOutlineOutlinedIcon className={classes.bannerIcon} />
              </Grid>
              <Grid item xs={11}>
                <Typography variant='body1' className={classes.bannerHeader}>
                  If you forgot to specify that you manufacture at any locations, you need to go back to My Business and edit the location information.
                </Typography>
                <StyledButton variant='outlined' onClick={() => history.push('/business/details')}>
                  <ArrowBack /> Back to My Business
                </StyledButton>
              </Grid>
            </Grid>
          </Paper>
        ) : null}

        <Typography variant='body1'>
          As a business owner, if a retailer formulates, packages, re-packages or prepares restricted E-substances for sale at your sales premises, you are required to provide information about those E-substances. <span className={classes.highlightedText}>Manufacturing</span> reports must be submitted at least 6 weeks prior to selling the restricted E-substance at the retail location.
          A <span className={classes.highlightedText}>Manufacturing Report</span> must include the following information for each restricted E-substance that will be sold from the sales premises.
          Name and contact information of the manufacturer of each ingredient, both the common and scientific names of each ingredient, unless one of these names is not available from the manufacturer:
        </Typography>
        <div className={classes.listGroup}>
          <div className={classes.listRow}>
            <div className={classes.listBullet} />
            Ingredient name
          </div>
          <div className={classes.listRow}>
            <div className={classes.listBullet} />
            Ingredient scientific name
          </div>
          <div className={classes.listRow}>
            <div className={classes.listBullet} />
            Manufacturer’s name
          </div>
          <div className={classes.listRow}>
            <div className={classes.listBullet} />
            Manufacturer’s address
          </div>
          <div className={classes.listRow}>
            <div className={classes.listBullet} />
            Manufacturer’s phone number
          </div>
          <div className={classes.listRow}>
            <div className={classes.listBullet} />
            Manufacturer’s email address
          </div>
          <Typography variant='body1' className={classes.pageDescription}>If any of the above information changes for a restricted E-substance product, the business owner must report this change to the Ministry within 7 days of selling the changed product.</Typography>
        </div>
        <FullScreen fullScreenProp={viewFullscreenTable}>
          <TableWrapper
            blockHeader='Submitted Manufacturing Reports'
            tableHeader='Manufacturing List'
            data={manufacturingReports}
            fullScreenProp={viewFullscreenTable} 
          >
            <div>
              <StyledTable
                data={manufacturingReports}
                columns={[
                  {
                    title: 'Product name',
                    render: (report: ManufacturingReport) => `${report.productName}`,
                  },
                  {
                    title: 'Submitted Date',
                    render: (report: ManufacturingReport) => `${moment(report.created_at).format('MMM DD, YYYY')}`,
                  },
                  {
                    title: 'Locations',
                    render: (report: ManufacturingReport) => `${report.locations.length}`
                  },
                  {
                    title: '',
                    readOnly: true,
                    render: (report: ManufacturingReport) => (
                      <Link to={`/manufacturing/${report.id}`} className={classes.viewLink}>
                        View
                      </Link>
                    ),
                    align: 'right'
                  }
                ]}
              />
            </div>
          </TableWrapper>
        </FullScreen>
      </div>
    </>
  );
}
