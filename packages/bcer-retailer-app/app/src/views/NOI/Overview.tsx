import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { useAxiosGet } from '@/hooks/axios';
import { makeStyles, Typography, Paper } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment';

import { StyledTable, StyledButton } from 'vaping-regulation-shared-components';
import { BusinessLocationHeaders } from '@/constants/localEnums';
import { BusinessLocation } from '@/constants/localInterfaces';
import NoiSubmission from '@/components/Noi/NoiSubmission';
import { AppGlobalContext } from '@/contexts/AppGlobal';

const useStyles = makeStyles({
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
  }
});

export default function NoiOverview() {
  const classes = useStyles();
  const history = useHistory();
  const [outstanding, setOutstanding] = useState([]);
  const [submitted, setSubmitted] = useState([]);

  const { location: { pathname } } = history;
  const [{ data: locations = [], loading, error }] = useAxiosGet(`/location?includes=noi`);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const tableAction = () => (
    <Typography variant='body1' className={classes.actionLink}>View</Typography>
  )

  useEffect(() => {
    if (pathname.includes('success') && !appGlobal.noiComplete) {
      setAppGlobal({ ...appGlobal, noiComplete: true })
    }
  }, [pathname, setAppGlobal, appGlobal]);

  useEffect(() => {
    if (locations.length && !error) {
      const outstanding = locations.filter((l: BusinessLocation) => !l.noi);
      const submitted = locations.filter((l: BusinessLocation) => l.noi);
      setOutstanding(outstanding);
      setSubmitted(submitted);
    } else {
        if (error) {
          setAppGlobal({...appGlobal, networkErrorMessage: error.response.data.message})
        }
    }
  }, [locations, error]);

  return loading ? <CircularProgress /> : (
    <>
      <div>
        <div className={classes.actionsWrapper}>
        <Typography className={classes.title} variant='h5'>Notice of Intent</Typography>
          {
            outstanding.length 
            ? 
            <div className={classes.buttonWrapper}>
              <StyledButton variant='contained' onClick={() => history.push('/noi/submit')}>
                <SendIcon className={classes.sendIcon} />
                Submit Outstanding NOI
              </StyledButton> 
            </div>
            : null
          }
        </div>
        {
          pathname === '/noi/success'
            ?
              <NoiSubmission />
            :
            <>
              <Typography variant='body1'>
                Business owners must notify the Ministry of Health of their intent to sell restricted E-substances by submitting a, Notice of Intent to sell E-Substances to the Ministry of Health. The Notice of Intent to Sell E-Substances is required for each separate sales premises for your business and for the sale of non-therapeutic nicotine E-substances. Business owners will be required to submit the following information:
              </Typography>
              <ul>
                <li><Typography variant='body1'>Legal name of business</Typography></li>
                <li><Typography variant='body1'>Name under which business conducted</Typography></li>
                <li><Typography variant='body1'>Address of sales premises from which restricted E-substances are sold</Typography></li>
                <li><Typography variant='body1'>Phone Number for sales premises</Typography></li>
                <li><Typography variant='body1'>Email address for sales premises</Typography></li>
                <li><Typography variant='body1'>Webpage for sales premises (if applicable)</Typography></li>
                <li><Typography variant='body1'>If persons under 19 years of age are permitted on the sales premises</Typography></li>
                <li><Typography variant='body1'>Health authority in which the retail location is located</Typography></li>
              </ul>
              <Typography variant='body1'>
                The business owner must submit the Notice of Intent a minimum of 6 weeks before an e-substance is first sold from the sales premises. The Notice of Intent must also be submitted prior to January 15 of each year that a retailer intends to continue sales.
              </Typography>
            </>
        }
        <div className={classes.subtitleWrapper}>
          <Typography className={classes.subtitle} variant='h6'>Outstanding Notice of Intent</Typography>
        </div>
        <Paper variant='outlined' className={classes.box}>
          <Typography className={classes.boxTitle} variant='subtitle1'>Business Locations</Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant='body2'>
              You have {outstanding.length} retail locations that need a Notice of Intent
            </Typography>
            {
              outstanding.length
                ?
                  <CSVLink
                    headers={Object.keys(BusinessLocationHeaders)}
                    data={
                      outstanding.reduce((dataList: Array<any>, l: BusinessLocation) => {
                        dataList.push([l.addressLine1, l.addressLine2, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing]);
                        return dataList;
                      }, [])
                    }
                    filename={'business_locations.csv'} className={classes.csvLink} target='_blank'>
                    <StyledButton variant='outlined'>
                      <SaveAltIcon className={classes.buttonIcon} />
                      Download CSV
                    </StyledButton>
                  </CSVLink>
                :
                null
            }
          </div>
          <div>
            <StyledTable
              columns={[
                {
                  title: 'Address 1',
                  render: (rd: BusinessLocation) => `${rd.addressLine1}, ${rd.postal}, ${rd.city}`,
                },
                {
                  title: 'Added Date',
                  render: (rd: BusinessLocation) => rd.created_at ? `${moment(rd.created_at).format('MMM DD, YYYY')}` : '',
                },
                {
                  title: 'Status',
                  render: (rd: BusinessLocation) => `${rd.noi ? 'Submitted' : 'Not Submitted'}`
                },
              ]}
              data={outstanding}
            />
          </div>
        </Paper>
        <div className={classes.subtitleWrapper}>
          <Typography className={classes.subtitle} variant='h6' >Submitted Notice of Intent</Typography>
        </div>
        <Paper className={classes.box} variant='outlined' >
          <Typography className={classes.boxTitle} variant='subtitle1'>Business Locations</Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant='body2'>You have {locations.filter((l: BusinessLocation) => l.noi).length} retail locations</Typography>
            {
              submitted.length
                ?
                  <CSVLink
                    headers={Object.keys(BusinessLocationHeaders)}
                    data={
                      submitted.reduce((dataList: Array<any>, l: BusinessLocation) => {
                        dataList.push([l.addressLine1, l.addressLine2, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing]);
                        return dataList
                      }, [])
                    }
                    filename={'business_locations.csv'} className={classes.csvLink} target='_blank'>
                    <StyledButton variant='outlined'>
                      <SaveAltIcon className={classes.buttonIcon} />
                      Download CSV
                    </StyledButton>
                  </CSVLink>
                :
              null
            }
          </div>
          <div>
            <StyledTable
              columns={[
                {
                  title: 'Address 1',
                  render: (rd: BusinessLocation) => `${rd.addressLine1}, ${rd.postal}, ${rd.city}`,
                },
                {
                  title: 'Submitted Date',
                  render: (rd: BusinessLocation) => rd.noi?.created_at ? `${moment(rd.noi.created_at).format('MMM DD, YYYY')}` : '',
                },
                {
                  title: 'Status',
                  render: (rd: BusinessLocation) => `${rd.noi ? 'Submitted' : 'Not Submitted'}`
                },
              ]}
              actions={[
                {
                  icon: tableAction,
                  onClick: (event: any, rowData: any) => history.push(`/view-location/${rowData.id}`)
                }
              ]}
              data={submitted}
            />
          </div>
        </Paper>
      </div>
    </>
  );
}
