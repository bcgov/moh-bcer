import React, { useContext, useEffect, useState } from 'react';
import { makeStyles, Typography, Paper } from '@material-ui/core';
import { StyledButton, StyledTable } from 'vaping-regulation-shared-components';
import { useAxiosGet } from '@/hooks/axios';
import { CSVLink } from 'react-csv';
import SaveAltIcon from '@material-ui/icons/SaveAlt'

import { SuccessStepEnum, BusinessLocationHeaders } from '@/constants/localEnums';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';
import { BusinessDetails } from '@/constants/localInterfaces';
import SuccessStep from '@/components/successStep/SuccessStep'
import FileCheckGreen from '@/assets/images/file-check-green.png';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';

const useStyles = makeStyles({
  title: {
    color: '#0F327F',
    paddingBottom: '30px'
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem 1.4rem 0rem 1.4rem',
    marginBottom: '30px'
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
    height: '45px',
    paddingRight: '20px'
  },
  bannerText: {
    fontWeight: 600,
    color: '#3A3A3A'
  },
  description: {
    color: '#565656',
    paddingBottom: '20px'
  },
  stepsSubtitle: {
    paddingBottom: '20px'
  },
  boxTitle: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: '22px',
  },
  boxHeader: {
    fontSize: '17px',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '15px',
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
  boxDescription: {
    fontSize: '14px',
    color: '#3A3A3A',
    lineHeight: '20px',
    paddingBottom: '15px',
  },
  boxRow: {
    display: 'flex',
    paddingBottom: '20px',
  },
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  csvLink: {
    textDecoration: 'none',
  },
  rowTitle: {
    fontSize: '14px',
    color: '#424242',
    width: '300px'
  },
  rowContent: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#3A3A3A',
  },
  editButton: {
    fontSize: '14px',
    width: '150px',
    minWidth: '150px'
  },
  tableWrapper: {
    marginBottom: '20px'
  }
})


export default function MyBusinessSubmission (props: any) {
  const classes = useStyles();

  const [{ data: submission, error }, get] = useAxiosGet(`/submission/${props.match.params.submissionId}`);
  const [details, setDetails] = useState<BusinessDetails>();
  const [locations, setlocations] = useState<Array<IBusinessLocationValues>>();
  const [appGlobal, setAppGlobalContext ] = useContext(AppGlobalContext);

  useEffect(() => {
    if (submission) {
      (async()=> {
          get()
      })()
    }
  },[])

  useEffect(() => {
    if (submission && !error) {
      setDetails(submission.data.details);
      setlocations(submission.data.locations)
    }
  }, [submission]);

  useEffect(() => {
    if (error) {
      setAppGlobalContext({...appGlobal, networkErrorMessage: formatError(error)})
    }
  }, [error])

  return (
    <div>
      <Typography variant='h5' className={classes.title}>My Business</Typography>
      <Paper variant='outlined' className={classes.box}>
        <div className={classes.successBanner}>
          <img src={FileCheckGreen} className={classes.bannerIcon} />
          <Typography variant='body2' className={classes.bannerText}>Your Business Details have been submited.</Typography>
        </div>
        <Typography variant='body1' className={classes.description}>
          To continue to sell vape products you must also submit the following items: Notice of intent,
          Product Report, and Manufacturing Report (if your retail locations also manufacture e-vape products)
        </Typography>
        <Typography variant="subtitle1" className={classes.stepsSubtitle}>Next steps</Typography>
        <SuccessStep active={true} completed={false} step={SuccessStepEnum.noi}/>
        <SuccessStep active={false} completed={false} step={SuccessStepEnum.product}/>
        <SuccessStep active={false} completed={false} step={SuccessStepEnum.manufacturing}/>
        <SuccessStep active={false} completed={false} step={SuccessStepEnum.sale}/>
      </Paper>
      {
        details
          ?
            <Paper variant='outlined' className={classes.box}>
              <div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Legal name of business
                  </div>
                  <div className={classes.rowContent}>
                    {details.legalName}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Name under which business is conducted
                  </div>
                  <div className={classes.rowContent}>
                    {details.businessName}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Business address line 1
                  </div>
                  <div className={classes.rowContent}>
                    {details.addressLine1}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Business address line 2
                  </div>
                  <div className={classes.rowContent}>
                    {details.addressLine2}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    City
                  </div>
                  <div className={classes.rowContent}>
                    {details.city}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Postal code
                  </div>
                  <div className={classes.rowContent}>
                    {details.postal}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Business phone number
                  </div>
                  <div className={classes.rowContent}>
                    {details.phone}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Business email
                  </div>
                  <div className={classes.rowContent}>
                    {details.email}
                  </div>
                </div>
                <div className={classes.boxRow}>
                  <div className={classes.rowTitle}>
                    Business web page (optional)
                  </div>
                  <div className={classes.rowContent}>
                    {details.webpage}
                  </div>
                </div>
              </div>
            </Paper>
          :
            null
      }

      {
        locations?.length
          ?
            <div className={classes.box}>
              <div className={classes.boxHeader}>
                Business Locations
              </div>
              <div className={classes.actionsWrapper}>
                <div className={classes.boxDescription}>You have {locations.length} retail entries.</div>
                <CSVLink
                  headers={Object.keys(BusinessLocationHeaders)}
                  data={locations.map((l) => {
                    return [l.addressLine1, l.addressLine2, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
                  })}
                  filename={'business_locations.csv'} className={classes.csvLink} target='_blank'>
                  <StyledButton variant='outlined'>
                    <SaveAltIcon className={classes.buttonIcon} />
                    Download CSV
                  </StyledButton>
                </CSVLink>
              </div>
              <div className={classes.tableWrapper}>
                <StyledTable
                  columns={[
                    {title: 'Address 1', field: 'addressLine1'},
                    {title: 'Address 2', field: 'addressLine2'},
                    {title: 'Postal Code', field: 'postal'},
                    {title: 'City', field: 'city'},
                    {title: 'Business Phone', field: 'phone'},
                    {title: 'Business email', field: 'email'},
                    {title: 'Health Authority', field: 'health_authority'},
                    {title: 'Doing Business As', field: 'doingBusinessAs'},
                    {title: 'Minors Allowed', render: (rowData: IBusinessLocationValues) => rowData.underage === 'other' && rowData.underage_other ? `${rowData.underage_other}` : `${rowData.underage}`},
                    {title: 'Manufacturing  Premises', field: 'manufacturing'}
                  ]}
                  data={locations}
                />
              </div>
            </div>
          :
            null
      }
    </div>
  )
}
