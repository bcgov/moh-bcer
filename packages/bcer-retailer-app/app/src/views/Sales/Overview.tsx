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

export default function SalesOverview() {
  const classes = useStyles();
  const history = useHistory();
  const [outstanding, setOutstanding] = useState([]);
  const [submitted, setSubmitted] = useState([]);

  const { location: { pathname } } = history;
  const [{ data: locations = [], loading, error }] = useAxiosGet(`/location?count=sales,products`);
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
      const outstanding = locations.filter((l: BusinessLocation) => (!l.sales || l.sales?.length === 0) || l.salesCount === 0);
      const submitted = locations.filter((l: BusinessLocation) => l?.sales?.length > 0 || l.salesCount > 0);
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
          <Typography className={classes.title} variant='h5'>Sales Reports</Typography>
          <div className={classes.buttonWrapper}>
            <StyledButton variant='contained' onClick={() => history.push('/sales/select')}>
              <SendIcon className={classes.sendIcon} />
              Submit New Sales Report
            </StyledButton>
          </div>
        </div>
        <div className={classes.subtitleWrapper}>
          <Typography className={classes.subtitle} variant='h6'>Outstanding Sales Reports</Typography>
        </div>
        <Paper variant='outlined' className={classes.box}>
          <Typography className={classes.boxTitle} variant='subtitle1'>Business Locations</Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant='body2'>
              You have {outstanding.length} retail locations that are missing Sales Reports
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
          <Typography className={classes.subtitle} variant='h6' >Submitted Sales Reports</Typography>
        </div>
        <Paper className={classes.box} variant='outlined' >
          <Typography className={classes.boxTitle} variant='subtitle1'>Business Locations</Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant='body2'>You have {submitted.length} retail locations</Typography>
            {
              submitted.length
                ?
                  <CSVLink
                    headers={Object.keys(BusinessLocationHeaders)}
                    data={
                      submitted.reduce((dataList: Array<any>, l: BusinessLocation) => {
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
                  title: 'Sales Reports Submitted',
                  render: (rd: BusinessLocation) => new Set(rd.sales.map(sale => sale.year)).size,
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
