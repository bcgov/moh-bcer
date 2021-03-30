import React, { useContext, useEffect } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { StyledButton } from 'vaping-regulation-shared-components';
import { useAxiosPost } from '@/hooks/axios';
import { makeStyles, CircularProgress, Typography } from '@material-ui/core';
import classes from '*.module.css';
import { AppGlobalContext } from '@/contexts/AppGlobal';

const useStyles = makeStyles({
  splashContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  splashWrapper: {
    maxWidth: '950px'
  },
  buttonWrapper: {
    paddingTop: '30px',
    display: 'flex',
    justifyContent: 'flex-end'
  }
})

export default function Welcome() {
  const classes = useStyles();
  const history = useHistory();
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext)
  const [{ data: profile, loading, error }] = useAxiosPost('/users/profile');
  const businessInformation = profile?.business && profile?.business.legalName;

  useEffect(() => {
    if (error) {
      setAppGlobal({...appGlobal, networkErrorMessage: error?.response?.data?.message})
    }
  }, [error])

  return loading ? <CircularProgress /> : businessInformation ? <Redirect to='/mybusiness' /> : (
    <div className={classes.splashContainer}>
      <div className={classes.splashWrapper}>
        <Typography variant='h5'>Welcome to E-Substances Reporting Application</Typography>
        <Typography variant='body1'>As a first-time user of this application, you need to finish the initial setup of your organization. Next time you login, you will not have to complete this step.</Typography>
        <Typography variant='body1'>If you have already submitted a product and manufacturing report by email to <a href="mailto:vaping.info@gov.bc.ca">vaping.info@gov.bc.ca</a>, you will have to reupload this into the BCER.</Typography>
        <div className={classes.buttonWrapper}> 
          <StyledButton variant='contained' onClick={() => history.push('/business/details')}>
            Start
          </StyledButton>
        </div>
      </div>
    </div>
  )
}
