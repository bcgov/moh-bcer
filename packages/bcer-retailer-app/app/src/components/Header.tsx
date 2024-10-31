import React from 'react';
import { styled } from '@mui/material/styles';
import store from 'store';
import { useKeycloak } from '@react-keycloak/web';
import { Link, useNavigate } from 'react-router-dom';
import { StyledButton } from 'vaping-regulation-shared-components';
import logo from '@/assets/images/logo-banner.svg';
import { HelpOutlineOutlined } from '@mui/icons-material';

const PREFIX = 'Header';

const classes = {
  header: `${PREFIX}-header`,
  titleWrapper: `${PREFIX}-titleWrapper`,
  topTitle: `${PREFIX}-topTitle`,
  bottomTitle: `${PREFIX}-bottomTitle`,
  logoWrapper: `${PREFIX}-logoWrapper`,
  logo: `${PREFIX}-logo`,
  help: `${PREFIX}-help`,
  getHelp: `${PREFIX}-getHelp`,
  accountType: `${PREFIX}-accountType`,
  authButton: `${PREFIX}-authButton`
};

const Root = styled('div')({
  [`&.${classes.header}`]: {
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
  [`& .${classes.titleWrapper}`]: {
    height: '45px',
    width: '100%',
  },
  [`& .${classes.topTitle}`]: {
    fontSize: '10px',
    lineHeight: '10px',
  },
  [`& .${classes.bottomTitle}`]: {
    fontSize: '27px',
    lineHeight: '32px',
    whiteSpace: 'nowrap',
  },
  [`& .${classes.logoWrapper}`]: {
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    borderRight: '1px solid #F3B229',
    marginRight: '20px',
  },
  [`& .${classes.logo}`]: {
    height: '37px',
    width: '200px',
  },
  [`& .${classes.help}`]: {
    minWidth: '195px',
  },
  [`& .${classes.getHelp}`]: {
    color: '#F3B229',
    fontWeight: 'bold',
  },
  [`& .${classes.accountType}`]: {
    color: 'white',
  },
  [`& .${classes.authButton}`]: {
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
  const navigate = useNavigate();

  const{keycloak} = useKeycloak();

  const logout = () => {
    store.clearAll();
    keycloak.logout();
    navigate('/');
  };

  return (
    <Root className={classes.header}>
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
            onClick={() => navigate('/FAQ')}
          >
            <HelpOutlineOutlined/> FAQ
          </StyledButton>
        </>
      }
    </Root>
  );
}
