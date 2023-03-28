import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Container, makeStyles, Typography } from '@material-ui/core';

import Header from '@/components/Header';
import userLoginLogo from '@/assets/images/user-check-1.png';
import arrowRight from '@/assets/images/arrow-right.png';

const useStyles = makeStyles((theme) => ({
  splashContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  splashWrapper: {
    maxWidth: '950px',
    [theme.breakpoints.down('xs')]: {
      '& h5': {
        fontSize: 24
      }     
    }    
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
    [theme.breakpoints.down('xs')]: {
      width: 340,
      height: 50,
      fontSize: 16,
      lineHeight: '22px',      
    }    
  },
  authButtonIcon: {
    height: '50px',
    width: '50px',
    margin: '19px',
    border: 'solid 1px #0053A4',
    borderRadius: '4px',
    float: 'left',
    [theme.breakpoints.down('xs')]: {
      width: 32,
      height: 32,
      margin: 10
    }
  },
  buttonImage: {
    height: '24px',
    width: '24px',
    margin: '15px',
    [theme.breakpoints.down('xs')]: {
      width: 20,
      height: 20,
      margin: 7
    }
  },
  arrowRight: {
    height: '24px',
    width: '24px',
  },
  buttonText: {
    height: '20px',
    width: '300px',
    margin: '32px 0px 0px 0px',
    [theme.breakpoints.down('xs')]: {
      height: 10,
      margin: '18px 0px 0px 0px'
    }
  },
  authArrow: {
    height: '14px',
    width: '14px',
    margin: '-16px 23px 0px 0px',
    float: 'right'
  },
  splashVerbiage: {
    padding: '30px 0px 30px 0px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14      
    } 
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
    paddingTop: '20px',
    [theme.breakpoints.down('xs')]: {
      '& p.MuiTypography-body1': {
        fontSize: 14
      }
    }
  }
}));

const Login = () => {
  const classes = useStyles();
  const [keycloak, initialized] = useKeycloak();
  return (
    <>
      <Header />
      <Container maxWidth="lg" className={classes.splashContainer}>
        <Container maxWidth="md" className={classes.splashWrapper}>
          <Typography variant='h5'>BC E-Substances Regulation Data Portal</Typography>
          <Typography variant='body1' className={classes.splashVerbiage}>
              The new <b className={classes.splashVerbiageBold}>E-Substances Regulation</b> introduced requirements for all businesses who currently
              sell E-substances or intend to sell E-substances in British Columbia. This application provides access to all reports submitted through the
              BC Vaping Regulation application.
              <br />
              <br />
          </Typography>
          {
            initialized
              ?
              <>
                <div className={classes.authContainer}>
                  <Typography variant='body1'>
                    This application utilizes IDIR or HA ID for authentication.<br />
                  </Typography>
                  <div className={classes.authButtonContainer} onClick={() => keycloak.login({ idpHint: 'idir', redirectUri: location.origin + '/#/keycloak' })}>
                    <div className={classes.authButtonIcon}>
                      <img className={classes.buttonImage} src={userLoginLogo} alt="Login" />
                    </div>
                    <div className={classes.buttonText}>Continue with IDIR</div>
                    <div className={classes.authArrow}>
                      <img className={classes.arrowRight} src={arrowRight} alt="Login" />
                    </div>
                  </div>
                </div>
                <div className={classes.authButtonContainer} onClick={() => keycloak.login({ idpHint: 'phsa', redirectUri: location.origin + '/#/keycloak' })}>
                  <div className={classes.authButtonIcon}>
                    <img className={classes.buttonImage} src={userLoginLogo} alt="Login" />
                  </div>
                  <div className={classes.buttonText}>Continue with HA ID</div>
                  <div className={classes.authArrow}>
                    <img className={classes.arrowRight} src={arrowRight} alt="Login" />
                  </div>
                </div>
              </>
              :
              <span>Connecting to KeyCloak</span>
          }
        </Container>
      </Container>
    </>
  );
};
export default Login;
