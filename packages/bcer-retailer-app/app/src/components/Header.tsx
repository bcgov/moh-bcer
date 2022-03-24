import React from 'react';
import store from 'store';
import { useKeycloak } from '@react-keycloak/web';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import { StyledButton } from 'vaping-regulation-shared-components';
import logo from '@/assets/images/logo-banner.svg';
import { HelpOutlineOutlined } from '@material-ui/icons';

const useStyles = makeStyles({
  header: {
    position: 'fixed',
    zIndex: 12,
    alignItems: 'center',
    backgroundColor: '#036', // TODO: Replace with theme color once theme is refactored with MUI
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

  const logout = () => {
    store.clearAll();
    keycloak.logout();
    history.push('/');
  };

  return (
    <div className={classes.header}>
      <Link to="/" className={classes.logoWrapper} >
        <img className={classes.logo} src={logo} alt="Go to the homepage" />
      </Link>
      <div className={classes.titleWrapper} >
        <div className={classes.topTitle} >
          E-Substances Regulation
        </div>
        <div className={classes.bottomTitle} >
          E-Substances Reporting Application
        </div>
      </div>
      {
        keycloak.authenticated &&
        <>
          <div className={classes.help}>
            Having Trouble? <Link className={classes.getHelp} to='/gethelp'>Get Help</Link>
          </div>
          <StyledButton 
            variant="small-outlined" 
            size="small" 
            style={{
              backgroundColor: 'white',
              marginLeft: '10px'
            }} 
            onClick={() => history.push('/FAQ')}
          >
            <HelpOutlineOutlined/> FAQ
          </StyledButton>
        </>
      }
    </div>
  );
}
