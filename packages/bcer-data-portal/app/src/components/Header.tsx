import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Link } from 'react-router-dom';
import { Box, Grid, Hidden, makeStyles } from '@material-ui/core';

import logo from '@/assets/images/logo-banner.svg';

const useStyles = makeStyles(theme => ({
  headerBox: {    
    height: 70,
    width: '100%',
    display: 'flex',    
    padding: '20px 65px 20px 10px',
    color: '#fff',
    backgroundColor: '#036',
    borderBottom: '2px solid #fcba19',
    zIndex: 1500,
    position: 'fixed',
    boxSizing: 'border-box',
    maxWidth: '100vw',
    [theme.breakpoints.down('xs')]: {
      boxSizing: 'inherit',
      height: 20,
      position: 'inherit'      
    }    
  },
  logoWrap: {    
    borderRight: '1px solid #F3B229',
    maxWidth: 209,
    height: 45,
    paddingTop: '4px !important',
    [theme.breakpoints.down('xs')]: {
      height: 40,
      maxWidth: 117,
      '& img': {
        width: 100
      }
    }
  },
  titleWrap: {    
    paddingLeft: '20px !important',
    paddingTop: '0px !important',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: '10px !important',
    }
  },
  topTitle: {
    fontSize: '10px',
    lineHeight: '10px',    
  },
  bottomTitle: {
    fontSize: '27px',
    lineHeight: '32px',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },  
  logo: {
    height: '37px',
    width: '200px',
  },
  help: {
    minWidth: '195px',
  },
  getHelp: {
    color: '#F3B229',
    fontWeight: 'bold',
  },
}));

export default function Header() {
  const classes = useStyles();
  const [keycloak] = useKeycloak();

  return (
    <>
    <Box className={classes.headerBox}>
      <Grid container spacing={2}>
        <Grid item xs={4} md={2} className={classes.logoWrap}>
          <img className={classes.logo} src={logo} alt="BC Government Logo" />
        </Grid>
        <Grid item xs={7} md={9} className={classes.titleWrap}>
          <div className={classes.topTitle} >
            E-Substances Regulation
          </div>
          <div className={classes.bottomTitle} >
            BC E-Substances Regulation Data Portal
          </div>
        </Grid>
      </Grid>
      {
      keycloak.authenticated &&
      <Hidden smDown>
        <Grid className={classes.help}>
            Having Trouble? <Link className={classes.getHelp} to='/gethelp'>Get Help</Link>      
        </Grid>
      </Hidden>
      }
    </Box>    
    </>
  );
}
