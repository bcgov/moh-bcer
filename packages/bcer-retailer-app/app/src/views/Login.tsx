import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { makeStyles, Typography } from '@material-ui/core';

import Header from '@/components/Header';
import userLoginLogo from '@/assets/images/user-check-1.png';
import userSignupLogo from '@/assets/images/user-plus.png';
import arrowRight from '@/assets/images/arrow-right.png';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  splashContainer: {
    display: 'flex',
    width: '100%',
    marginTop: '70px',
    alignItems: 'center',
    justifyContent: 'center'
  },
  splashWrapper: {
    maxWidth: '950px'
  },
  authButtonContainer: {
    color: '#1E5DB1',
    display: 'block',
    textDecoration: 'none',
    height: '90px',
    width: '652px',
    marginBottom: '30px',
    marginTop: '30px',
    border: 'solid 1px #0053A4',
    borderRadius: '4px',
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '0',
    float: 'left',
    lineHeight: '27px',
    '&:hover': {
      background: '#E5EDF5',
      cursor: 'pointer',
    },
  },
  authButtonIcon: {
    height: '50px',
    width: '50px',
    margin: '19px',
    border: 'solid 1px #0053A4',
    borderRadius: '4px',
    float: 'left',
  },
  buttonImage: {
    height: '24px',
    width: '24px',
    margin: '15px '
  },
  arrowRight: {
    height: '24px',
    width: '24px',
  },
  buttonText: {
    height: '20px',
    width: '390px',
    margin: '32px 0px 0px 0px',
  },
  authArrow: {
    height: '14px',
    width: '14px',
    margin: '-16px 23px 0px 0px',
    float: 'right'
  },
  splashVerbiage: {
    padding: '0px 0px 30px 0px',
  },
  splashVerbiageBold: {
    color: '#0053A4',
  },
  splashVerbiageLastParagraph: {
    paddingBottom: '30px',
  },
  getHelp: {
    clear: 'both'
  },
  authContainer: {
    borderTop: '1px solid gray',
    paddingTop: '20px'
  }
});

const Login = () => {
  const classes = useStyles();
  const [keycloak, initialized] = useKeycloak();
  return (
    <>
      <Header />

      <div className={classes.splashContainer}>
        <div className={classes.splashWrapper}>
          <Typography variant='h5'>E-Substances Reporting Application</Typography>
          <Typography variant='body1' className={classes.splashVerbiage}>
            The new <b className={classes.splashVerbiageBold}>E-Substances Regulation</b> introduced requirements for all businesses who currently
            sell E-substances or intend to sell E-substances in British Columbia. Business owners must notify the Ministry
            of Health of their intent to sell restricted E-substances 6 weeks prior to their first sale. Product Reports
            (and Manufacturing Reports as applicable) must also be submitted at least 6 weeks before the product can be sold.
            The Notice of Intent to Sell E-Substances is required for each location of your business and only for non-therapeutic nicotine E-substances.
            If you completed your Notice of Intent and submitted your product and manufacturing reports prior to October 5th, 2020, there is no action required
            until you renew your Notice of Intent before January 15, 2021. However, if you are updating your product reports before
            this time, you will have to use the B.C. E-Substances Reporting Application.
            <br />
            <br />
            <Typography variant='body1'>
              For technical support, please send an email to <a href="mailto:vaping.info@gov.bc.ca?subject=BCER">vaping.info@gov.bc.ca</a>
            </Typography>
            <br />
            <Typography variant='body1'>
              For questions related to submitting your business details, NOI and product or manufacturing reports, please send an email to <a href="mailto:vaping.info@gov.bc.ca">vaping.info@gov.bc.ca</a>
            </Typography>
            <br />
            <br />
            <b className={classes.splashVerbiageBold}>NOTE: Business owners that fail to submit their Notice of Intent and that fail to comply with the new reporting requirements may be subject to offences under the Public Health Act.</b>
          </Typography>
          {
            initialized
              ?
              <div className={classes.authContainer}>
                <Typography variant='body1'>
                  This application utilizes BCeID for authentication.<br />
                </Typography>
                <div className={classes.authButtonContainer} onClick={() => keycloak.login({ idpHint: 'bceid_basic', redirectUri: location.origin + '/#/keycloak' })}>
                  <div className={classes.authButtonIcon}>
                    <img className={classes.buttonImage} src={userLoginLogo} alt="Login" />
                  </div>
                  <div className={classes.buttonText}>Continue with Basic BCeID</div>
                  <div className={classes.authArrow}>
                    <img className={classes.arrowRight} src={arrowRight} alt="Login" />
                  </div>
                </div>
                <div className={classes.authButtonContainer} onClick={() => keycloak.login({ idpHint: 'bceid_business', redirectUri: location.origin + '/#/keycloak' })}>
                  <div className={classes.authButtonIcon}>
                    <img className={classes.buttonImage} src={userLoginLogo} alt="Login" />
                  </div>
                  <div className={classes.buttonText}>Continue with Business BCeID</div>
                  <div className={classes.authArrow}>
                    <img className={classes.arrowRight} src={arrowRight} alt="Login" />
                  </div>
                </div>
              </div>
              :
              <span>Connecting to KeyCloak</span>
          }
        </div>
      </div>
    </>
  );
};
export default Login;
