import React, { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';

import { useAxiosGet } from '@/hooks/axios';
import { Divider, Grid, makeStyles, Typography, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';

import FileCheckGreen from '@/assets/images/file-check-green.png';

import { StyledTable, StyledButton } from 'vaping-regulation-shared-components';
import { BusinessLocation, ManufacturingReport } from '@/constants/localInterfaces';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import FullScreen from '@/components/generic/FullScreen';
import TableWrapper from '@/components/generic/TableWrapper';

const PREFIX = 'Overview';

const classes = {
  bannerWrapper: `${PREFIX}-bannerWrapper`,
  bannerHeader: `${PREFIX}-bannerHeader`,
  box: `${PREFIX}-box`,
  tableBox: `${PREFIX}-tableBox`,
  title: `${PREFIX}-title`,
  highlighted: `${PREFIX}-highlighted`,
  successBanner: `${PREFIX}-successBanner`,
  bannerIcon: `${PREFIX}-bannerIcon`,
  successImg: `${PREFIX}-successImg`,
  bannerText: `${PREFIX}-bannerText`,
  subtitleWrapper: `${PREFIX}-subtitleWrapper`,
  floatRight: `${PREFIX}-floatRight`,
  subtitle: `${PREFIX}-subtitle`,
  boxTitle: `${PREFIX}-boxTitle`,
  tableRowCount: `${PREFIX}-tableRowCount`,
  actionsWrapper: `${PREFIX}-actionsWrapper`,
  buttonIcon: `${PREFIX}-buttonIcon`,
  sendIcon: `${PREFIX}-sendIcon`,
  dividerGrid: `${PREFIX}-dividerGrid`,
  viewLink: `${PREFIX}-viewLink`,
  listGroup: `${PREFIX}-listGroup`,
  listRow: `${PREFIX}-listRow`,
  listBullet: `${PREFIX}-listBullet`,
  pageDescription: `${PREFIX}-pageDescription`,
  highlightedText: `${PREFIX}-highlightedText`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
  [`& .${classes.bannerWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#F8F2E4',
    marginBottom: '20px',
    borderRadius: '5px',
  },
  [`& .${classes.bannerHeader}`]: {
    fontWeight: 600,
    paddingBottom: '10px'
  },
  [`& .${classes.box}`]: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem 1.4rem 0rem 1.4rem',
    marginBottom: '30px',
  },
  [`& .${classes.tableBox}`]: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '2rem',
    marginBottom: '30px',
  },
  [`& .${classes.title}`]: {
    padding: '20px 0px',
    color: '#002C71'
  },
  [`& .${classes.highlighted}`]: {
    fontWeight: 600,
    color: '#0053A4',
  },
  [`& .${classes.successBanner}`]: {
    display: 'flex',
    backgroundColor: '#E7F9EA',
    borderRadius: '4px',
    padding: '20px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  [`& .${classes.bannerIcon}`]: {
    fontSize: '45px',
    color: '#f3b229',
  },
  [`& .${classes.successImg}`]: {
    maxHeight: '48px',
    marginRight: '2rem',
  },
  [`& .${classes.bannerText}`]: {
    fontWeight: 600,
    color: '#3A3A3A'
  },
  [`& .${classes.subtitleWrapper}`]: {
    display: 'flex',
    alignItems: 'bottom',
    justifyContent: 'space-between',
    padding: '30px 0px 10px 0px',
  },
  [`& .${classes.floatRight}`]: {
    float: 'right',
  },
  [`& .${classes.subtitle}`]: {
    color: '#0053A4',
  },
  [`& .${classes.boxTitle}`]: {
    paddingBottom: '10px'
  },
  [`& .${classes.tableRowCount}`]: {
    paddingBottom: '10px'
  },
  [`& .${classes.actionsWrapper}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  [`& .${classes.sendIcon}`]: {
    height: '24px',
    paddingRight: '4px'
  },
  [`& .${classes.dividerGrid}`]: {
    margin: '1rem 0'
  },
  [`& .${classes.viewLink}`]: {
    color: '#0053A4',
    fontSize: '16px',
    letterSpacing: '0',
    lineHeight: '20px',
    textDecoration: 'underline',
    '&:hover': {
      backgroundColor: 'transparent',
    }
  },
  [`& .${classes.listGroup}`]: {
    paddingLeft: '15px',
    paddingBottom: '15px'
  },
  [`& .${classes.listRow}`]: {
    display: 'flex',
    paddingTop: '15px'
  },
  [`& .${classes.listBullet}`]: {
    margin: '10px 15px 0px 0px',
    minHeight: '6px',
    minWidth: '6px',
    maxHeight: '6px',
    maxWidth: '6px',
    borderRadius: '5px',
    backgroundColor: '#0053A4'
  },
  [`& .${classes.pageDescription}`]: {
    padding: '20px 0'
  },
  [`& .${classes.highlightedText}`]: {
    fontWeight: 600,
    color: '#0053A4'
  },
});

export default function ManufacturingOverview() {

  const location = useLocation();
  const navigate = useNavigate();
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
    (<Root>
      <div>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item xs={8}>
            <Typography className={classes.title} variant='h5'>Manufacturing Report</Typography>
          </Grid>
          <Grid item xs={4}>
            <StyledButton className={classes.floatRight} variant='contained' onClick={() => navigate('/manufacturing/submit')}>
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
                <StyledButton variant='outlined' onClick={() => navigate('/business/details')}>
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
                    sorting: false
                  },
                  {
                    title: 'Submitted Date',
                    render: (report: ManufacturingReport) => `${moment(report.created_at).format('MMM DD, YYYY')}`,
                    sorting: false
                  },
                  {
                    title: 'Locations',
                    render: (report: ManufacturingReport) => `${report.locations.length}`,
                    sorting: false
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
    </Root>)
  );
}
