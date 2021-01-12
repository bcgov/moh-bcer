import React from 'react';
import store from 'store';
import { useKeycloak } from '@react-keycloak/web';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import logo from '@/assets/images/logo-banner.svg';

const useStyles = makeStyles({
  header: {
    position: 'fixed',
    zIndex: 11,
    alignItems: 'center',
    backgroundColor: '#036',
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    borderBottom: '2px solid #fcba19',
    padding: '0 65px 0 10px',
    color: '#fff',
    display: 'flex',
    height: '70px',
  },
  titleWrapper: {
    height: '45px',
    width: '100%',
  },
  topTitle: {
    fontSize: '10px',
    lineHeight: '10px',
  },
  bottomTitle: {
    fontSize: '27px',
    lineHeight: '32px',
    whiteSpace: 'nowrap',
  },
  logoWrapper: {
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    borderRight: '1px solid #F3B229',
    marginRight: '20px',
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
  accountType: {
    color: 'white',
  },
  authButton: {
    color: '#181818',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    margin: '1rem 2rem',
    border: 'solid 1px white',
    borderRadius: '5px',
    fontWeight: 600,
    backgroundColor: 'whitesmoke',
    boxShadow: 'grey 1px 1px',
    '&:hover': {
      cursor: 'pointer',
    },
  }
});

export default function Header() {
  const history = useHistory();
  const classes = useStyles();
  const [keycloak] = useKeycloak();

  return (
    <div className={classes.header}>
      <div className={classes.logoWrapper} >
        <img className={classes.logo} src={logo} alt="BC Government Logo" />
      </div>
      <div className={classes.titleWrapper} >
        <div className={classes.topTitle} >
          E-Substances Regulation
        </div>
        <div className={classes.bottomTitle} >
          BC E-Substances Regulation Data Portal
        </div>
      </div>
      {
        keycloak.authenticated &&
        <div className={classes.help}>
          Having Trouble? <Link className={classes.getHelp} to='/gethelp'>Get Help</Link>
        </div>
      }
    </div>
  );
}
