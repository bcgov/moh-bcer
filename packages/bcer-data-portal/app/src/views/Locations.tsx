import React, { useContext, useEffect, useState } from 'react';
import { makeStyles, Typography, Paper } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { useAxiosGet } from '@/hooks/axios';
import { useKeycloak } from '@react-keycloak/web';
import CircularProgress from '@material-ui/core/CircularProgress';
import GetAppIcon from '@material-ui/icons/GetApp';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
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

export default function Locations() {
  const classes = useStyles();
  const history = useHistory();
  const [keycloak] = useKeycloak();
  const [submitted, setSubmitted] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const { location: { pathname } } = history;
  const [{ data: locations = [], loading, error }, get] = useAxiosGet(`/location?includes=noi`);
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const logout = () => {
    store.clearAll();
    keycloak.logout();
    history.push('/');
  };

  useEffect(() => {
    if (locations.length && !error) {
      console.log(locations)
      setSubmitted(locations.filter((l: BusinessLocation) => l.noi));
    } else {
        if (error) {
          setAppGlobal({...appGlobal, networkErrorMessage: error.response.data.message})
        }
    }
  }, [locations, error]);

  return loading ? <div className={classes.loadingWrapper} ><CircularProgress /> </div>: (
    <div className={classes.contentWrapper}>
      <div className={classes.content}>
        <div className={classes.actionsWrapper}>
        <Typography className={classes.title} variant='h5'>Submitted Locations</Typography>
        <div className={classes.buttonWrapper}>
          <StyledButton variant='outlined' onClick={logout}>
            Log Out
          </StyledButton> 
        </div>
        </div>
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
            <Typography className={classes.tableRowCount} variant='body2'>{submitted.length} retail locations have submitted a Notice of Intent</Typography>
            {
              submitted.length
                ?
                  <CSVLink
                    headers={Object.keys(BusinessLocationHeaders)}
                    data={
                      submitted.reduce((dataList: Array<any>, l: BusinessLocation) => {
                        dataList.push([l.addressLine1, l.addressLine2, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.manufacturing]);
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
                  title: 'Business Name',
                  field: 'businessName'
                },
                {
                  title: 'Business Legal Name',
                  field: 'businessLegalName'
                },
                {
                  title: 'Phone Number',
                  field: 'phone'
                },
                {
                  title: 'Email Address',
                  field: 'email'
                },
                {
                  title: 'Address 1',
                  render: (rd: BusinessLocation) => `${rd.addressLine1}, ${rd.postal}, ${rd.city}`,
                },
                {
                  title: 'Submitted Date',
                  render: (rd: BusinessLocation) => rd.noi?.created_at ? `${moment(rd.noi.created_at).format('MMM DD, YYYY')}` : '',
                },
              ]}
              options={{ selection: true }}
              onSelectionChange={(rows: any) => {
                setSelectedProducts(rows.map((row: BusinessLocation) => row.id))
              }}
              data={submitted}
              // data={(query: any) =>
              //   new Promise((resolve, reject) => {
              //     get()
              //       .then(result => {
              //         resolve({
              //           data: result.data,
              //           page: result.page - 1,
              //           totalCount: result.total,
              //         })
              //       })
              //   })
              // }
            />
          </div>
        </Paper>
      </div>
    </div>
  );
}
